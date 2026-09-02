-- One row per storage area with the two facts the locations page and the
-- home page cards need: how many parts live anywhere inside the area, and a
-- plain-language description of how the area is subdivided ("6 tiers · 24
-- boxes"). Both were hardcoded strings in the UI; deriving them means they
-- stay true as the team reorganises the workshop.

create or replace view storage_area_summary
with (security_invoker = true)
as
select
  area.id,
  area.name,
  area.icon,
  area.tone,
  area.sort_order,
  coalesce(contents.part_count, 0) as part_count,
  coalesce(contents.total_quantity, 0) as total_quantity,
  coalesce(contents.low_stock_count, 0) as low_stock_count,
  structure.description as structure
from locations area
left join lateral (
  -- Parts sitting at any depth inside this area, including on the area row
  -- itself for areas that have not been subdivided yet.
  select
    count(*) as part_count,
    sum(p.quantity) as total_quantity,
    count(*) filter (where p.quantity <= p.min_quantity) as low_stock_count
  from location_paths lp
  join parts p on p.location_id = lp.id
  where lp.area_id = area.id
) contents on true
left join lateral (
  select string_agg(level_label, ' · ' order by depth) as description
  from (
    select
      lp.depth,
      count(*) || ' ' || case
        when lp.kind = 'box' then 'boxes'
        else lp.kind::text || 's'
      end as level_label
    from location_paths lp
    where lp.area_id = area.id
      and lp.depth > 1
    group by lp.depth, lp.kind
  ) levels
) structure on true
where area.parent_id is null;
