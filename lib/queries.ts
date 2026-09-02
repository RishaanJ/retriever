import { getServerClient } from "./supabase";
import type { Database } from "./database.types";

type Tables = Database["public"]["Tables"];
type Views = Database["public"]["Views"];

/**
 * A part together with its resolved address. This is the shape every list in
 * the app renders, and it comes from `search_parts` rather than the view
 * because the function's return columns are non-nullable.
 */
export type Part = Database["public"]["Functions"]["search_parts"]["Returns"][number];

export type StorageArea = Views["storage_area_summary"]["Row"];
export type LocationNode = Views["location_paths"]["Row"];
export type RecentPart = Views["recently_viewed_parts"]["Row"];
export type Category = Tables["categories"]["Row"];
export type PartRequest = Tables["part_requests"]["Row"];
export type RequestStatus = Database["public"]["Enums"]["request_status"];
export type RequestPriority = Database["public"]["Enums"]["request_priority"];

function unwrap<T>(result: { data: T | null; error: { message: string } | null }, context: string): T {
  if (result.error) {
    throw new Error(`${context}: ${result.error.message}`);
  }
  // PostgREST returns null data only alongside an error for these calls.
  return result.data as T;
}

/**
 * Searches parts by name, notes, category, or storage address. An empty query
 * returns the whole inventory, so the same call backs both the search box and
 * the full inventory table.
 */
export async function searchParts(query = ""): Promise<Part[]> {
  const supabase = getServerClient();
  const result = await supabase.rpc("search_parts", { q: query });
  return unwrap(result, "Failed to search parts");
}

export async function listParts(): Promise<Part[]> {
  return searchParts("");
}

export async function getPart(id: string): Promise<Part | null> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("parts_with_location")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load part: ${error.message}`);
  }
  return (data as Part | null) ?? null;
}

/** The five storage areas with their part counts and structure summary. */
export async function listStorageAreas(): Promise<StorageArea[]> {
  const supabase = getServerClient();
  const result = await supabase
    .from("storage_area_summary")
    .select("*")
    .order("sort_order");
  return unwrap(result, "Failed to load storage areas");
}

/**
 * Every location with its full address, ordered so parents precede children.
 * Use for the location picker on the add-part form.
 */
export async function listLocations(): Promise<LocationNode[]> {
  const supabase = getServerClient();
  const result = await supabase
    .from("location_paths")
    .select("*")
    .order("path");
  return unwrap(result, "Failed to load locations");
}

export async function listCategories(): Promise<Category[]> {
  const supabase = getServerClient();
  const result = await supabase.from("categories").select("*").order("name");
  return unwrap(result, "Failed to load categories");
}

export async function listRequests(status?: RequestStatus): Promise<PartRequest[]> {
  const supabase = getServerClient();
  const query = supabase
    .from("part_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const result = await (status ? query.eq("status", status) : query);
  return unwrap(result, "Failed to load requests");
}

export async function listRecentlyViewed(limit = 3): Promise<RecentPart[]> {
  const supabase = getServerClient();
  const result = await supabase
    .from("recently_viewed_parts")
    .select("*")
    .limit(limit);
  return unwrap(result, "Failed to load recently viewed parts");
}

/** Parts at or below their minimum quantity, for the low-stock notice. */
export async function listLowStockParts(): Promise<Part[]> {
  const parts = await listParts();
  return parts.filter((part) => part.is_low_stock);
}
