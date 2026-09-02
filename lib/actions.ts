"use server";

import { revalidatePath } from "next/cache";

import { getServerClient } from "./supabase";
import type { Database } from "./database.types";
import type { RequestPriority, RequestStatus } from "./queries";

type LocationKind = Database["public"]["Enums"]["location_kind"];

/**
 * Actions return a result rather than throwing so forms can render an inline
 * message. Only genuinely unexpected failures throw.
 */
export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

const PRIORITIES: RequestPriority[] = ["low", "normal", "high"];
const STATUSES: RequestStatus[] = ["requested", "ordered", "arrived"];
const LOCATION_KINDS: LocationKind[] = [
  "area", "tier", "shelf", "drawer", "bin", "box", "compartment", "section",
];

function text(form: FormData, field: string): string {
  const value = form.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function count(form: FormData, field: string, fallback: number): number {
  const parsed = Number(form.get(field));
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

// Server Functions are reachable by direct POST, not only through the UI, so
// every action below re-validates its own input instead of trusting that the
// form already did. There is no sign-in yet; once there is, the permission
// check belongs here too.

export async function createPart(form: FormData): Promise<ActionResult> {
  const name = text(form, "name");
  if (!name) {
    return { ok: false, error: "A part needs a name." };
  }

  const locationId = text(form, "location_id");
  if (!locationId) {
    return { ok: false, error: "Choose where this part is stored." };
  }

  const supabase = getServerClient();
  const { error } = await supabase.from("parts").insert({
    name,
    location_id: locationId,
    category_id: text(form, "category_id") || null,
    quantity: count(form, "quantity", 0),
    min_quantity: count(form, "min_quantity", 0),
    notes: text(form, "notes") || null,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/inventory");
  revalidatePath("/locations");
  revalidatePath("/");
  return { ok: true };
}

export async function updatePartQuantity(
  id: string,
  quantity: number,
): Promise<ActionResult> {
  if (!Number.isInteger(quantity) || quantity < 0) {
    return { ok: false, error: "Quantity must be zero or more." };
  }

  const supabase = getServerClient();
  const { error } = await supabase
    .from("parts")
    .update({ quantity })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/inventory");
  revalidatePath("/");
  return { ok: true };
}

export async function deletePart(id: string): Promise<ActionResult> {
  const supabase = getServerClient();
  const { error } = await supabase.from("parts").delete().eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/inventory");
  revalidatePath("/locations");
  revalidatePath("/");
  return { ok: true };
}

/**
 * Creates a storage area when `parent_id` is omitted, or a subdivision of an
 * existing location when it is provided.
 */
export async function createLocation(form: FormData): Promise<ActionResult> {
  const name = text(form, "name");
  if (!name) {
    return { ok: false, error: "A location needs a name." };
  }

  const kind = text(form, "kind").toLowerCase() as LocationKind;

  const supabase = getServerClient();
  const { error } = await supabase.from("locations").insert({
    name,
    parent_id: text(form, "parent_id") || null,
    kind: LOCATION_KINDS.includes(kind) ? kind : "section",
  });

  if (error) {
    // The unique indexes on sibling names surface as 23505.
    if (error.code === "23505") {
      return { ok: false, error: `"${name}" already exists in that location.` };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/locations");
  revalidatePath("/");
  return { ok: true };
}

export async function createRequest(form: FormData): Promise<ActionResult> {
  const partName = text(form, "part_name");
  if (!partName) {
    return { ok: false, error: "Name the part you need." };
  }

  const priority = text(form, "priority").toLowerCase() as RequestPriority;

  const supabase = getServerClient();
  const { error } = await supabase.from("part_requests").insert({
    part_name: partName,
    quantity: Math.max(1, count(form, "quantity", 1)),
    priority: PRIORITIES.includes(priority) ? priority : "normal",
    reason: text(form, "reason") || null,
    requested_by: text(form, "requested_by") || null,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/requests");
  revalidatePath("/");
  return { ok: true };
}

export async function updateRequestStatus(
  id: string,
  status: RequestStatus,
): Promise<ActionResult> {
  if (!STATUSES.includes(status)) {
    return { ok: false, error: "Unknown request status." };
  }

  const supabase = getServerClient();
  const { error } = await supabase
    .from("part_requests")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/requests");
  revalidatePath("/");
  return { ok: true };
}

/**
 * Records that someone looked up a part, feeding the "Recently viewed" list.
 * Failures are swallowed: this is a convenience signal and must never break
 * the page that triggered it.
 */
export async function recordPartView(partId: string): Promise<void> {
  const supabase = getServerClient();
  const { error } = await supabase.rpc("record_part_view", { part: partId });

  if (error) {
    console.error("Failed to record part view:", error.message);
  }
}
