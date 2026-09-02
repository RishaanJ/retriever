"use client";

import { AlertCircle, PackagePlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { createPart, type ActionResult } from "@/lib/actions";
import type { Category, LocationNode } from "@/lib/queries";

type Props = {
  categories: Category[];
  locations: LocationNode[];
};

export function NewPartForm({ categories, locations }: Props) {
  const router = useRouter();

  const [state, formAction, pending] = useActionState(
    async (_previous: ActionResult | null, form: FormData) => createPart(form),
    null,
  );

  // On success the part exists but this page cannot show it, so send the user
  // to the list where they can see what they just added. The action already
  // revalidated /inventory, so the new row is there on arrival.
  useEffect(() => {
    if (state?.ok) {
      router.push("/inventory");
    }
  }, [state, router]);

  // Locations arrive ordered by full path; grouping by area turns that flat
  // list into the five areas a team member actually recognises.
  const areas = new Map<string, LocationNode[]>();
  for (const location of locations) {
    const area = location.area_name ?? "Other";
    const group = areas.get(area);
    if (group) {
      group.push(location);
    } else {
      areas.set(area, [location]);
    }
  }

  return (
    <form className="surface-panel simple-form" action={formAction}>
      <div className="field wide">
        <label htmlFor="new-name">Part name</label>
        <input id="new-name" name="name" required placeholder="e.g. NEO Vortex motor" />
      </div>

      <div className="field">
        <label htmlFor="new-category">Category</label>
        <select id="new-category" name="category_id" defaultValue="">
          <option value="">Choose a category</option>
          {categories.map((category) => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="new-quantity">Starting quantity</label>
        <input
          id="new-quantity"
          name="quantity"
          type="number"
          min="0"
          defaultValue="1"
        />
      </div>

      <div className="field wide">
        <label htmlFor="new-location">Storage location</label>
        <select id="new-location" name="location_id" defaultValue="" required>
          <option value="" disabled>
            Choose where it lives
          </option>
          {[...areas].map(([areaName, nodes]) => (
            <optgroup label={areaName} key={areaName}>
              {nodes.map((node) => (
                <option value={node.id ?? ""} key={node.id}>
                  {node.depth === 1
                    ? `${areaName} (whole area)`
                    : // Trim the redundant area prefix; the optgroup shows it.
                      (node.path ?? "").slice(areaName.length + 3)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="new-min-quantity">
          Low-stock threshold <span>Optional</span>
        </label>
        <input
          id="new-min-quantity"
          name="min_quantity"
          type="number"
          min="0"
          defaultValue="0"
        />
      </div>

      <div className="field wide">
        <label htmlFor="new-notes">
          Notes <span>Optional</span>
        </label>
        <textarea
          id="new-notes"
          name="notes"
          rows={3}
          placeholder="Size, variant, or identifying details"
        />
      </div>

      <div className="simple-form-actions">
        <button className="primary-button" type="submit" disabled={pending}>
          <PackagePlus size={16} aria-hidden="true" />
          {pending ? "Adding…" : "Add part"}
        </button>
        <Link className="secondary-button" href="/inventory">
          Cancel
        </Link>
        {state && !state.ok && (
          <span className="inline-error" role="alert">
            <AlertCircle size={16} aria-hidden="true" />
            {state.error}
          </span>
        )}
      </div>
    </form>
  );
}
