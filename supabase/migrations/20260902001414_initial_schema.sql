-- Retriever: core inventory schema.
--
-- The central idea from PRODUCT.md is that every part resolves to a precise,
-- human-readable storage address. Locations are therefore stored as a tree
-- (Huge Shelf -> Tier 3 -> Box 3) and the display string is derived by a
-- recursive view rather than typed in by hand, so an area rename propagates
-- everywhere at once.

create extension if not exists pg_trgm;

-- Enums -----------------------------------------------------------------

create type location_kind as enum (
  'area', 'tier', 'shelf', 'drawer', 'bin', 'box', 'compartment', 'section'
);

create type request_priority as enum ('low', 'normal', 'high');

create type request_status as enum ('requested', 'ordered', 'arrived');

-- Shared trigger ---------------------------------------------------------

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Categories -------------------------------------------------------------

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- Locations --------------------------------------------------------------
-- A root row (parent_id is null) is one of the five real storage areas.
-- Children describe the tiers, drawers, bins, and boxes inside them.

create table locations (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references locations (id) on delete cascade,
  name text not null,
  kind location_kind not null default 'section',
  -- Presentation hints consumed by the sidebar and location cards. Only
  -- meaningful on root areas; children inherit their area's styling.
  icon text,
  tone text check (tone in ('green', 'blue', 'violet', 'orange', 'yellow')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint locations_no_self_parent check (id <> parent_id)
);

-- Sibling names must be unique so an address is never ambiguous. Two indexes
-- are needed because NULL parent_id never compares equal to itself.
create unique index locations_unique_child_name
  on locations (parent_id, lower(name))
  where parent_id is not null;

create unique index locations_unique_area_name
  on locations (lower(name))
  where parent_id is null;

create index locations_parent_id_idx on locations (parent_id);

create trigger locations_set_updated_at
  before update on locations
  for each row execute function set_updated_at();

-- Parts ------------------------------------------------------------------

create table parts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_id uuid references categories (id) on delete set null,
  -- Parts point at the deepest node that describes where they actually sit,
  -- which may be an area itself if that area has no subdivisions yet.
  location_id uuid references locations (id) on delete set null,
  quantity integer not null default 0 check (quantity >= 0),
  -- Drives the low-stock notification toggle in settings.
  min_quantity integer not null default 0 check (min_quantity >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(notes, '')), 'B')
  ) stored
);

create index parts_search_vector_idx on parts using gin (search_vector);
-- Trigram index backs fuzzy matching so "NEO pinion" still finds
-- "NEO Motor Pinion - 14T" despite the missing word.
create index parts_name_trgm_idx on parts using gin (name gin_trgm_ops);
create index parts_location_id_idx on parts (location_id);
create index parts_category_id_idx on parts (category_id);

create trigger parts_set_updated_at
  before update on parts
  for each row execute function set_updated_at();

-- Part requests ----------------------------------------------------------
-- Requests intentionally store a free-text part name: the point is to ask for
-- something the team does not stock yet, so there is no parts row to
-- reference. fulfilled_part_id links them up once the part arrives.

create table part_requests (
  id uuid primary key default gen_random_uuid(),
  part_name text not null,
  quantity integer not null default 1 check (quantity > 0),
  priority request_priority not null default 'normal',
  status request_status not null default 'requested',
  reason text,
  requested_by text,
  fulfilled_part_id uuid references parts (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index part_requests_status_idx on part_requests (status, created_at desc);

create trigger part_requests_set_updated_at
  before update on part_requests
  for each row execute function set_updated_at();

-- Recently viewed --------------------------------------------------------
-- Backs the "Recently viewed" section on the home page. Rows are append-only
-- and disposable; there is no user column while the app is unauthenticated.

create table part_views (
  id bigserial primary key,
  part_id uuid not null references parts (id) on delete cascade,
  viewed_at timestamptz not null default now()
);

create index part_views_viewed_at_idx on part_views (viewed_at desc);

-- Derived location addresses --------------------------------------------
-- Walks the tree once and produces both the display path
-- ("Huge Shelf · Tier 3 · Box 3") and the owning area for grouping.

create or replace view location_paths as
with recursive tree as (
  select
    l.id,
    l.parent_id,
    l.name,
    l.kind,
    l.id as area_id,
    l.name as area_name,
    l.name::text as path,
    1 as depth
  from locations l
  where l.parent_id is null

  union all

  select
    child.id,
    child.parent_id,
    child.name,
    child.kind,
    parent.area_id,
    parent.area_name,
    parent.path || ' · ' || child.name,
    parent.depth + 1
  from locations child
  join tree parent on child.parent_id = parent.id
)
select id, parent_id, name, kind, area_id, area_name, path, depth
from tree;

-- Parts joined to everything a search result needs in order to render.

create or replace view parts_with_location as
select
  p.id,
  p.name,
  p.quantity,
  p.min_quantity,
  p.notes,
  p.created_at,
  p.updated_at,
  p.category_id,
  c.name as category_name,
  p.location_id,
  lp.path as location_path,
  lp.area_id,
  lp.area_name,
  p.quantity <= p.min_quantity as is_low_stock
from parts p
left join categories c on c.id = p.category_id
left join location_paths lp on lp.id = p.location_id;

-- Search -----------------------------------------------------------------
-- Full-text over name and notes, widened with trigram similarity and plain
-- substring matches against the category and the human-readable address, so
-- "huge shelf" and "10-32" both work as queries.

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
      when coalesce(trim(q), '') = '' then 0::real
      else
        ts_rank(pt.search_vector, websearch_to_tsquery('english', q))
          + similarity(p.name, q)
    end as rank
  from parts_with_location p
  join parts pt on pt.id = p.id
  where
    coalesce(trim(q), '') = ''
    or pt.search_vector @@ websearch_to_tsquery('english', q)
    or p.name ilike '%' || q || '%'
    or coalesce(p.category_name, '') ilike '%' || q || '%'
    or coalesce(p.location_path, '') ilike '%' || q || '%'
    or similarity(p.name, q) > 0.2
  order by rank desc, p.name asc;
$$;

-- Row level security -----------------------------------------------------
-- The team runs without sign-in for now: shared workshop laptops, and finding
-- a part must not require a login. RLS is enabled anyway so that adding
-- Supabase Auth later is a policy change rather than a schema change.
--
-- WARNING: while these policies are in place, anyone holding the publishable
-- anon key can read and write every row.

alter table categories enable row level security;
alter table locations enable row level security;
alter table parts enable row level security;
alter table part_requests enable row level security;
alter table part_views enable row level security;

create policy "Open access to categories" on categories
  for all to anon, authenticated using (true) with check (true);

create policy "Open access to locations" on locations
  for all to anon, authenticated using (true) with check (true);

create policy "Open access to parts" on parts
  for all to anon, authenticated using (true) with check (true);

create policy "Open access to part_requests" on part_requests
  for all to anon, authenticated using (true) with check (true);

create policy "Open access to part_views" on part_views
  for all to anon, authenticated using (true) with check (true);
