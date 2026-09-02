"use client";

import { PageShell } from "@/components/page-shell";
import { MapPin, PackagePlus, Search, Shapes } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const parts = [
  ["NEO Motor Pinion — 14T", "Gears", "Huge Shelf · Tier 3 · Box 3", 12],
  ["10-32 × ¾ in. Button Head", "Hardware", "Husky · Drawer 4 · B", 46],
  ["Anderson Powerpole Housing", "Electrical", "Under Center Table · Bin 2", 24],
  ["Kraken X60 Motor", "Motors", "Huge Shelf · Tier 2 · Box 1", 6],
  ["1/2 in. Hex Bearing", "Bearings", "Blue Drawers · Drawer 2", 38],
  ["REV Through Bore Encoder", "Sensors", "Husky · Drawer 7 · A", 3],
  ["12 AWG Red Wire", "Electrical", "Under 3DP Table · Bin 1", 74],
  ["#25 Roller Chain", "Power transmission", "Huge Shelf · Tier 4 · Box 2", 18],
] as const;

export default function InventoryPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      parts.filter((part) =>
        `${part[0]} ${part[1]} ${part[2]}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <PageShell
      context="Inventory"
      title="Every part, one place."
      actions={
        <Link className="add-button" href="/inventory/new">
          <PackagePlus size={18} aria-hidden="true" />
          Add a part
        </Link>
      }
    >
      <div className="page-intro">
        <div>
          <h2>All inventory</h2>
          <p>Search every stocked part and jump directly to its physical location.</p>
        </div>
        <div className="page-toolbar">
          <label className="toolbar-search">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Filter inventory</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter parts or locations"
            />
          </label>
        </div>
      </div>

      <div className="surface-panel inventory-page-table">
        <div className="table-head">
          <span>Part</span>
          <span>Location</span>
          <span>Available</span>
          <span />
        </div>
        {filtered.length ? (
          filtered.map((part) => (
            <button className="part-row" type="button" key={part[0]}>
              <span className="part-name">
                <span className="part-symbol">
                  <Shapes size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>{part[0]}</strong>
                  <small>{part[1]}</small>
                </span>
              </span>
              <span className="part-location">
                <MapPin size={15} aria-hidden="true" />
                {part[2]}
              </span>
              <span className="quantity">{part[3]}</span>
              <span aria-hidden="true">›</span>
            </button>
          ))
        ) : (
          <div className="empty-feedback">
            No parts match “{query}”. Try another name or request the part.
          </div>
        )}
      </div>
    </PageShell>
  );
}
