-- Clears the placeholder inventory that came from the original UI mockup now
-- that parts can be added through the app for real.
--
-- Deliberately scoped to the eight seeded names rather than truncating the
-- table, so this stays safe if it ever runs after real parts exist. The
-- storage areas, their subdivisions, and the categories are kept: those
-- describe the actual workshop, not preview content.

delete from parts
where name in (
  'NEO Motor Pinion — 14T',
  '10-32 × ¾ in. Button Head',
  'Anderson Powerpole Housing',
  'Kraken X60 Motor',
  '1/2 in. Hex Bearing',
  'REV Through Bore Encoder',
  '12 AWG Red Wire',
  '#25 Roller Chain'
);
