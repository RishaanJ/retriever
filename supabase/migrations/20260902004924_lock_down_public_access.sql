-- Removes all public access to the database ahead of the first public deploy.
--
-- The anon key is published to every visitor's browser by design, and the
-- previous policies granted it INSERT, UPDATE, and DELETE on every table:
-- anyone who opened the deployed site could have extracted the key and wiped
-- the inventory.
--
-- Nothing in the app reads the database from the browser -- every query and
-- mutation already runs inside a Server Component or Server Action -- so
-- dropping these policies costs no functionality. RLS stays enabled with no
-- policies at all, which denies anon and authenticated outright while
-- service_role continues to bypass RLS for the server's own connections.
--
-- Adding sign-in later means adding policies here rather than undoing this.

drop policy if exists "Open access to categories" on categories;
drop policy if exists "Open access to locations" on locations;
drop policy if exists "Open access to parts" on parts;
drop policy if exists "Open access to part_requests" on part_requests;
drop policy if exists "Open access to part_views" on part_views;

-- Also withdraw the table-level grants PostgREST relies on, so the public
-- roles cannot reach these relations even if a policy is added by accident.
revoke all on categories from anon, authenticated;
revoke all on locations from anon, authenticated;
revoke all on parts from anon, authenticated;
revoke all on part_requests from anon, authenticated;
revoke all on part_views from anon, authenticated;

revoke all on location_paths from anon, authenticated;
revoke all on parts_with_location from anon, authenticated;
revoke all on storage_area_summary from anon, authenticated;
revoke all on recently_viewed_parts from anon, authenticated;

revoke execute on function search_parts(text) from anon, authenticated;
revoke execute on function record_part_view(uuid) from anon, authenticated;
