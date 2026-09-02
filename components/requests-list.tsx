"use client";

import { CheckCircle2, Clock3, Truck } from "lucide-react";
import { useState } from "react";

import type { PartRequest, RequestStatus } from "@/lib/queries";

const STATUS_ICONS: Record<RequestStatus, typeof Clock3> = {
  requested: Clock3,
  ordered: Truck,
  arrived: CheckCircle2,
};

const FILTERS: Array<{ label: string; value: RequestStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Ordered", value: "ordered" },
  { label: "Arrived", value: "arrived" },
];

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function RequestsList({ requests }: { requests: PartRequest[] }) {
  const [filter, setFilter] = useState<RequestStatus | "all">("all");
  const visible = requests.filter(
    (request) => filter === "all" || request.status === filter,
  );

  return (
    <>
      <div className="filter-tabs" role="group" aria-label="Filter requests">
        {FILTERS.map(({ label, value }) => (
          <button
            className={filter === value ? "active" : ""}
            type="button"
            onClick={() => setFilter(value)}
            key={value}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="surface-panel request-page-list">
        {visible.length ? (
          visible.map((request) => {
            const Icon = STATUS_ICONS[request.status];
            return (
              <div className="request-page-row" key={request.id}>
                <span className={`request-stage status-${request.status}`}>
                  <Icon size={17} aria-hidden="true" />
                </span>
                <span className="request-part">
                  <strong>{request.part_name}</strong>
                  <small>
                    Quantity {request.quantity} · {titleCase(request.priority)} priority
                    {request.requested_by ? ` · ${request.requested_by}` : ""}
                  </small>
                </span>
                <span className={`request-status status-${request.status}`}>
                  {titleCase(request.status)}
                </span>
                <button className="secondary-button" type="button">
                  View details
                </button>
              </div>
            );
          })
        ) : (
          <div className="empty-feedback">
            {requests.length === 0
              ? "No requests yet. Ask for a part from the home page."
              : "No requests with that status."}
          </div>
        )}
      </div>
    </>
  );
}
