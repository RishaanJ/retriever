"use client";

import { MapPin, Search, Shapes } from "lucide-react";
import { useMemo, useState } from "react";

import type { Part } from "@/lib/queries";

/**
 * Filtering happens in the browser over the already-loaded inventory so
 * typing stays instant. The database search function backs the home page
 * lookup, where the query arrives without the list already in hand.
 */
export function InventoryTable({ parts }: { parts: Part[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return parts;
    return parts.filter((part) =>
      `${part.name} ${part.category_name ?? ""} ${part.location_path ?? ""}`
        .toLowerCase()
        .includes(needle),
    );
  }, [parts, query]);

  return (
    <>
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
            <button className="part-row" type="button" key={part.id}>
              <span className="part-name">
                <span className="part-symbol">
                  <Shapes size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>{part.name}</strong>
                  <small>{part.category_name ?? "Uncategorised"}</small>
                </span>
              </span>
              <span className="part-location">
                <MapPin size={15} aria-hidden="true" />
                {part.location_path ?? "No location set"}
              </span>
              <span className="quantity">{part.quantity}</span>
              <span aria-hidden="true">›</span>
            </button>
          ))
        ) : (
          <div className="empty-feedback">
            {parts.length === 0
              ? "No parts yet. Add the first one to get started."
              : `No parts match “${query}”. Try another name or request the part.`}
          </div>
        )}
      </div>
    </>
  );
}
