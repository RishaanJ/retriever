-- part_views is an append-only log, so a part looked up ten times has ten
-- rows. Collapse it to one row per part ordered by its latest view, which is
-- what the "Recently viewed" section on the home page actually wants.

create or replace view recently_viewed_parts
with (security_invoker = true)
as
select
  p.id,
  p.name,
  p.quantity,
  p.min_quantity,
  p.category_id,
  p.category_name,
  p.location_id,
  p.location_path,
  p.area_id,
  p.area_name,
  p.is_low_stock,
  v.last_viewed_at
from (
  select part_id, max(viewed_at) as last_viewed_at
  from part_views
  group by part_id
) v
join parts_with_location p on p.id = v.part_id
order by v.last_viewed_at desc;

-- Recording a view should not require the caller to know about the log
-- table, and trimming keeps the log from growing without bound on a kiosk
-- that is never logged out.
create or replace function record_part_view(part uuid)
returns void
language plpgsql
volatile
as $$
begin
  insert into part_views (part_id) values (part);

  -- Keep only the most recent 500 views; older rows can never surface in the
  -- UI and only slow the aggregate above down.
  delete from part_views
  where id < (
    select id from part_views order by id desc offset 500 limit 1
  );
end;
$$;
