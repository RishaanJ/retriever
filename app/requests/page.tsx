"use client";

import { PageShell } from "@/components/page-shell";
import { CheckCircle2, Clock3, Send, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const requests = [
  ["REV Through Bore Encoder", "2", "High", "Requested"],
  ["Kraken X60 Motor", "4", "Normal", "Ordered"],
  ["1/2 in. Hex Bearings", "12", "Normal", "Arrived"],
  ["CANivore", "1", "Low", "Requested"],
] as const;

const statusIcons = {
  Requested: Clock3,
  Ordered: Truck,
  Arrived: CheckCircle2,
};

export default function RequestsPage() {
  const [filter, setFilter] = useState("All");
  const visible = requests.filter((request) => filter === "All" || request[3] === filter);

  return (
    <PageShell context="Requests" title="Parts the team needs.">
      <div className="page-intro">
        <div>
          <h2>All requests</h2>
          <p>Follow each request from the first ask through arrival at the workshop.</p>
        </div>
        <Link className="primary-button" href="/#request-part">
          <Send size={16} aria-hidden="true" />
          New request
        </Link>
      </div>

      <div className="filter-tabs" role="group" aria-label="Filter requests">
        {["All", "Requested", "Ordered", "Arrived"].map((status) => (
          <button
            className={filter === status ? "active" : ""}
            type="button"
            onClick={() => setFilter(status)}
            key={status}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="surface-panel request-page-list">
        {visible.map((request) => {
          const Icon = statusIcons[request[3]];
          return (
            <div className="request-page-row" key={request[0]}>
              <span className={`request-stage status-${request[3].toLowerCase()}`}>
                <Icon size={17} aria-hidden="true" />
              </span>
              <span className="request-part">
                <strong>{request[0]}</strong>
                <small>Quantity {request[1]} · {request[2]} priority</small>
              </span>
              <span className={`request-status status-${request[3].toLowerCase()}`}>
                {request[3]}
              </span>
              <button className="secondary-button" type="button">View details</button>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
