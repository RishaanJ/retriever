"use client";

import { PageShell } from "@/components/page-shell";
import {
  Archive,
  ChevronDown,
  MapPin,
  Plus,
  TableProperties,
  Warehouse,
  Wrench,
} from "lucide-react";
import { FormEvent, useState } from "react";

const startingLocations = [
  { name: "Huge Shelf", structure: "6 tiers · 24 boxes", parts: 142, icon: Warehouse },
  { name: "Under Center Table", structure: "3 bins", parts: 68, icon: TableProperties },
  { name: "Under 3DP Table", structure: "3 bins", parts: 31, icon: TableProperties },
  { name: "Husky", structure: "10 drawers", parts: 87, icon: Wrench },
  { name: "Blue Drawers", structure: "6 drawers", parts: 53, icon: Archive },
];

export default function LocationsPage() {
  const [locations, setLocations] = useState(startingLocations);
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);

  function addLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    setLocations((current) => [
      ...current,
      { name: name.trim(), structure: "Not configured", parts: 0, icon: MapPin },
    ]);
    setName("");
    setShowForm(false);
  }

  return (
    <PageShell context="Locations" title="Map the workshop.">
      <div className="page-intro">
        <div>
          <h2>Manage locations</h2>
          <p>Define the storage areas, tiers, drawers, and bins used in directions.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => setShowForm(true)}>
          <Plus size={16} aria-hidden="true" />
          Add location
        </button>
      </div>

      {showForm && (
        <form className="surface-panel add-location-form" onSubmit={addLocation}>
          <div className="field">
            <label htmlFor="location-name">Location name</label>
            <input
              id="location-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Battery cabinet"
              required
              autoFocus
            />
          </div>
          <button className="primary-button" type="submit">Create location</button>
          <button className="secondary-button" type="button" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </form>
      )}

      <div className="locations-manage-list">
        {locations.map((location) => {
          const Icon = location.icon;
          const anchor = location.name.toLowerCase().replaceAll(" ", "-");
          return (
            <details className="surface-panel location-manage-row" id={anchor} key={location.name}>
              <summary>
                <span className="location-icon green">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="location-copy">
                  <strong>{location.name}</strong>
                  <small>{location.structure}</small>
                </span>
                <span className="part-count">{location.parts} parts</span>
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
              <div className="location-detail">
                <p>
                  Addresses inside this area will appear in search results as a
                  human-readable path.
                </p>
                <div className="location-path-preview">
                  {location.name} <span>→</span> Section <span>→</span> Container
                </div>
                <button className="secondary-button" type="button">Edit structure</button>
              </div>
            </details>
          );
        })}
      </div>
    </PageShell>
  );
}
