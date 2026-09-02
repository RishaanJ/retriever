-- Two corrections to the initial schema.

-- 1. Views default to the definer's rights, which means they read straight
--    through the row level security on the underlying tables. That is
--    invisible today because every policy is permissive, but it would become
--    a silent leak the moment sign-in is added and the policies tighten.
--    security_invoker makes the views respect the caller's policies instead.

alter view location_paths set (security_invoker = true);
alter view parts_with_location set (security_invoker = true);

-- 2. similarity() normalises over the whole string, so a short typo scored
--    against a long part name lands far below any useful threshold:
--    similarity('encodr', 'REV Through Bore Encoder') is near zero and the
--    search missed it entirely. word_similarity() scores the query against
--    the best matching run of words instead, which is the behaviour a person
--    expects when they half-remember a part name.

create or replace function search_parts(q text default '')
returns table (
  id uuid,
  name text,
  quantity integer,
  min_quantity integer,
  notes text,
  category_id uuid,
  category_name text,
  location_id uuid,
  location_path text,
  area_id uuid,
  area_name text,
  is_low_stock boolean,
  rank real
)
language sql
stable
as $$
  with normalised as (
    select coalesce(trim(q), '') as q
  )
  select
    p.id,
    p.name,
    p.quantity,
    p.min_quantity,
    p.notes,
    p.category_id,
    p.category_name,
    p.location_id,
    p.location_path,
    p.area_id,
    p.area_name,
    p.is_low_stock,
    case
      when n.q = '' then 0::real
      else (
        -- Full-text relevance dominates, fuzzy name similarity breaks ties,
        -- and matching only the address or category ranks last so a search
        -- for "huge shelf" still returns that shelf's contents in a sensible
        -- order rather than alphabetically.
        ts_rank(pt.search_vector, websearch_to_tsquery('english', n.q)) * 4
        + word_similarity(n.q, p.name)
        + case
            when coalesce(p.location_path, '') ilike '%' || n.q || '%'
              or coalesce(p.category_name, '') ilike '%' || n.q || '%'
            then 0.1
            else 0
          end
      )::real
    end as rank
  from normalised n
  cross join parts_with_location p
  join parts pt on pt.id = p.id
  where
    n.q = ''
    or pt.search_vector @@ websearch_to_tsquery('english', n.q)
    or p.name ilike '%' || n.q || '%'
    or coalesce(p.category_name, '') ilike '%' || n.q || '%'
    or coalesce(p.location_path, '') ilike '%' || n.q || '%'
    or word_similarity(n.q, p.name) > 0.45
  order by rank desc, p.name asc;
$$;
