-- Seeds the five real storage areas from PRODUCT.md, their internal
-- structure, and the starter inventory that was previously hardcoded in the
-- UI. Guarded so re-running is a no-op.

do $$
begin

if exists (select 1 from locations) then
  return;
end if;

-- Categories -------------------------------------------------------------

insert into categories (name) values
  ('Gears'),
  ('Hardware'),
  ('Electrical'),
  ('Motors'),
  ('Bearings'),
  ('Sensors'),
  ('Power transmission');

-- Storage areas ----------------------------------------------------------
-- icon values are lucide-react component names already used by the sidebar.

insert into locations (name, kind, icon, tone, sort_order) values
  ('Huge Shelf',         'area', 'Warehouse',       'green',  1),
  ('Under Center Table', 'area', 'TableProperties', 'blue',   2),
  ('Under 3DP Table',    'area', 'TableProperties', 'violet', 3),
  ('Husky',              'area', 'Wrench',          'orange', 4),
  ('Blue Drawers',       'area', 'Archive',         'yellow', 5);

-- Huge Shelf: 6 tiers, 4 boxes each = 24 boxes.

insert into locations (parent_id, name, kind, sort_order)
select area.id, 'Tier ' || t, 'tier', t
from locations area
cross join generate_series(1, 6) t
where area.parent_id is null and area.name = 'Huge Shelf';

insert into locations (parent_id, name, kind, sort_order)
select tier.id, 'Box ' || b, 'box', b
from locations tier
join locations area on area.id = tier.parent_id
cross join generate_series(1, 4) b
where area.name = 'Huge Shelf' and tier.kind = 'tier';

-- The two under-table areas: 3 bins each.

insert into locations (parent_id, name, kind, sort_order)
select area.id, 'Bin ' || b, 'bin', b
from locations area
cross join generate_series(1, 3) b
where area.parent_id is null
  and area.name in ('Under Center Table', 'Under 3DP Table');

-- Husky: 10 drawers, each split into compartments A and B.

insert into locations (parent_id, name, kind, sort_order)
select area.id, 'Drawer ' || d, 'drawer', d
from locations area
cross join generate_series(1, 10) d
where area.parent_id is null and area.name = 'Husky';

insert into locations (parent_id, name, kind, sort_order)
select drawer.id, compartment, 'compartment',
       ascii(compartment) - ascii('A') + 1
from locations drawer
join locations area on area.id = drawer.parent_id
cross join unnest(array['A', 'B']) as compartment
where area.name = 'Husky' and drawer.kind = 'drawer';

-- Blue Drawers: 6 undivided drawers.

insert into locations (parent_id, name, kind, sort_order)
select area.id, 'Drawer ' || d, 'drawer', d
from locations area
cross join generate_series(1, 6) d
where area.parent_id is null and area.name = 'Blue Drawers';

-- Starter inventory ------------------------------------------------------
-- Locations are resolved through the location_paths view, so these read as
-- the same addresses a team member would say out loud.

insert into parts (name, category_id, location_id, quantity, min_quantity, notes)
select v.name, c.id, lp.id, v.quantity, v.min_quantity, v.notes
from (values
  ('NEO Motor Pinion — 14T',      'Gears',              'Huge Shelf · Tier 3 · Box 3',   12,  4, '14 tooth, 8mm bore'),
  ('10-32 × ¾ in. Button Head',   'Hardware',           'Husky · Drawer 4 · B',          46, 20, 'Stainless, hex drive'),
  ('Anderson Powerpole Housing',  'Electrical',         'Under Center Table · Bin 2',    24, 10, 'Red and black shells'),
  ('Kraken X60 Motor',            'Motors',             'Huge Shelf · Tier 2 · Box 1',    6,  4, 'Phoenix Pro licensed'),
  ('1/2 in. Hex Bearing',         'Bearings',           'Blue Drawers · Drawer 2',       38, 12, 'Flanged, sealed'),
  ('REV Through Bore Encoder',    'Sensors',            'Husky · Drawer 7 · A',           3,  5, 'Absolute and quadrature'),
  ('12 AWG Red Wire',             'Electrical',         'Under 3DP Table · Bin 1',       74, 25, 'Sold by the foot'),
  ('#25 Roller Chain',            'Power transmission', 'Huge Shelf · Tier 4 · Box 2',   18,  6, 'Includes master links')
) as v(name, category, path, quantity, min_quantity, notes)
left join categories c on c.name = v.category
left join location_paths lp on lp.path = v.path;

-- Every seeded part must resolve to a real address; a typo above would
-- otherwise silently leave location_id null.
if exists (select 1 from parts where location_id is null) then
  raise exception 'Seed failed: one or more parts did not resolve to a location';
end if;

-- Outstanding requests ---------------------------------------------------

insert into part_requests (part_name, quantity, priority, status, reason, requested_by)
values
  ('REV Through Bore Encoder', 2,  'high',   'requested', 'Swerve module azimuth feedback', 'Design'),
  ('Kraken X60 Motor',         4,  'normal', 'ordered',   'Spares for the drivetrain',      'Drivetrain'),
  ('1/2 in. Hex Bearings',    12,  'normal', 'arrived',   'Restock after build season',     'Build'),
  ('CANivore',                 1,  'low',    'requested', 'Free up CAN bus headroom',       'Electrical');

end $$;
