"use client";

import { PageShell } from "@/components/page-shell";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <PageShell context="Settings" title="Make Retriever yours.">
      <div className="page-intro">
        <div>
          <h2>Preferences</h2>
          <p>Choose how the interface and inventory notifications behave.</p>
        </div>
      </div>

      <section className="surface-panel settings-panel">
        <div className="settings-row">
          <div>
            <strong>Low-stock notifications</strong>
            <p>Notify you when an item falls below its minimum quantity.</p>
          </div>
          <input type="checkbox" defaultChecked aria-label="Low-stock notifications" />
        </div>
        <div className="settings-row">
          <div>
            <strong>Request updates</strong>
            <p>Notify you when requested parts are ordered or arrive.</p>
          </div>
          <input type="checkbox" defaultChecked aria-label="Request updates" />
        </div>
        <div className="settings-row">
          <div>
            <strong>Compact inventory rows</strong>
            <p>Show more parts at once on laptop screens.</p>
          </div>
          <input type="checkbox" aria-label="Compact inventory rows" />
        </div>
        <div className="settings-actions">
          <button className="primary-button" type="button" onClick={() => setSaved(true)}>
            Save preferences
          </button>
          {saved && (
            <span className="inline-success" role="status">
              <CheckCircle2 size={16} aria-hidden="true" />
              Preferences saved.
            </span>
          )}
        </div>
      </section>
    </PageShell>
  );
}
