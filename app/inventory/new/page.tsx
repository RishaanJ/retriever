"use client";

import { PageShell } from "@/components/page-shell";
import { CheckCircle2, PackagePlus } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function NewPartPage() {
  const [saved, setSaved] = useState(false);

  function savePart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <PageShell context="Inventory" title="Add a new part.">
      <div className="page-intro">
        <div>
          <h2>Part details</h2>
          <p>Create the part and give it a location your teammates can follow.</p>
        </div>
      </div>

      <form className="surface-panel simple-form" onSubmit={savePart}>
        <div className="field wide">
          <label htmlFor="new-name">Part name</label>
          <input id="new-name" required placeholder="e.g. NEO Vortex motor" />
        </div>
        <div className="field">
          <label htmlFor="new-category">Category</label>
          <select id="new-category" defaultValue="">
            <option value="" disabled>Choose a category</option>
            <option>Electrical</option>
            <option>Hardware</option>
            <option>Motors</option>
            <option>Power transmission</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="new-quantity">Starting quantity</label>
          <input id="new-quantity" type="number" min="0" defaultValue="1" />
        </div>
        <div className="field">
          <label htmlFor="new-location">Storage area</label>
          <select id="new-location" defaultValue="">
            <option value="" disabled>Choose an area</option>
            <option>Huge Shelf</option>
            <option>Under Center Table</option>
            <option>Under 3DP Table</option>
            <option>Husky</option>
            <option>Blue Drawers</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="new-address">Specific address</label>
          <input id="new-address" placeholder="Tier 3 · Box 3" />
        </div>
        <div className="field wide">
          <label htmlFor="new-notes">Notes <span>Optional</span></label>
          <textarea id="new-notes" rows={3} placeholder="Size, variant, or identifying details" />
        </div>
        <div className="simple-form-actions">
          <button className="primary-button" type="submit">
            <PackagePlus size={16} aria-hidden="true" />
            Add part
          </button>
          <Link className="secondary-button" href="/inventory">Cancel</Link>
          {saved && (
            <span className="inline-success" role="status">
              <CheckCircle2 size={16} aria-hidden="true" />
              Part added to this preview.
            </span>
          )}
        </div>
      </form>
    </PageShell>
  );
}
