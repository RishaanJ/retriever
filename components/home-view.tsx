"use client";

import {
  Archive,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  PackagePlus,
  Search,
  Send,
  Shapes,
  TableProperties,
  Warehouse,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useActionState, useEffect, useRef, useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { HeroColorPanelsVisual } from "@/components/ui/hero-color-panels";
import { createRequest, type ActionResult } from "@/lib/actions";
import type { Part, PartRequest, RecentPart, StorageArea } from "@/lib/queries";

// Storage areas carry a lucide component name in the database so the workshop
// map stays editable without a code change.
const AREA_ICONS: Record<string, LucideIcon> = {
  Warehouse,
  TableProperties,
  Wrench,
  Archive,
  MapPin,
};

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

type Props = {
  areas: StorageArea[];
  requests: PartRequest[];
  recentParts: RecentPart[];
  lowStock: Part[];
};

export function HomeView({ areas, requests, recentParts, lowStock }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const [state, requestAction, sending] = useActionState(
    async (_previous: ActionResult | null, form: FormData) => createRequest(form),
    null,
  );

  // The recent requests below come from the server, so a successful submit has
  // to re-render the page to show the new row.
  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query.trim());
  }

  return (
    <main className="app-shell">
      <AppSidebar />

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="greeting">Rotationaries workspace</p>
            <h1>Find what you need.</h1>
          </div>
          <div className="topbar-actions">
            <button
              className="icon-button"
              type="button"
              aria-label="Notifications"
              aria-expanded={showNotifications}
              onClick={() => setShowNotifications((open) => !open)}
            >
              <Bell size={19} aria-hidden="true" />
              {lowStock.length > 0 && <span className="notification-dot" />}
            </button>
            <Link className="request-button" href="/requests">
              <Send size={17} aria-hidden="true" />
              Request a part
            </Link>
            <Link className="add-button" href="/inventory/new">
              <PackagePlus size={18} aria-hidden="true" />
              Add a part
            </Link>
            {showNotifications && (
              <aside className="notifications-panel" aria-label="Notifications">
                <div className="notifications-head">
                  <div>
                    <strong>Notifications</strong>
                    <span>{lowStock.length} low</span>
                  </div>
                  <Link href="/settings">Preferences</Link>
                </div>
                {lowStock.length ? (
                  lowStock.slice(0, 3).map((part) => (
                    <div className="notification-item unread" key={part.id}>
                      <span className="notification-icon">
                        <PackagePlus size={16} aria-hidden="true" />
                      </span>
                      <div>
                        <strong>{part.name} is running low</strong>
                        <p>
                          {part.quantity} left of a {part.min_quantity} minimum.
                        </p>
                        <small>{part.location_path}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="notification-item">
                    <span className="notification-icon">
                      <CheckCircle2 size={16} aria-hidden="true" />
                    </span>
                    <div>
                      <strong>Everything is stocked</strong>
                      <p>No parts are below their minimum quantity.</p>
                    </div>
                  </div>
                )}
                <Link className="notifications-footer" href="/requests">
                  View request activity
                  <ChevronRight size={15} aria-hidden="true" />
                </Link>
              </aside>
            )}
          </div>
        </header>

        <div className="content">
          <section className="search-section" aria-labelledby="search-heading">
            <HeroColorPanelsVisual className="cult-color-panels" />
            <Image
              className="search-watermark"
              src="/rdog.png"
              alt=""
              width={360}
              height={360}
              priority
            />
            <div className="search-copy">
              <p className="search-kicker">Retriever search</p>
              <h2 id="search-heading">Where is that part?</h2>
              <p>Describe it however you remember it. We’ll point you to the exact shelf, drawer, and bin.</p>
            </div>
            <form className="search-form" onSubmit={handleSearch}>
              <Search size={22} aria-hidden="true" />
              <label className="sr-only" htmlFor="part-search">
                Search inventory
              </label>
              <input
                id="part-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder='Try “NEO pinion” or “10-32 bolts”'
              />
              <button type="submit">Search</button>
            </form>
            <div className="search-hint" aria-live="polite">
              {submittedQuery ? (
                <>
                  Showing a preview search for <strong>“{submittedQuery}”</strong>
                </>
              ) : (
                <>
                  <kbd>⌘</kbd> <kbd>K</kbd>
                  <span>to search from anywhere</span>
                </>
              )}
            </div>
            <div className="quick-searches" aria-label="Quick searches">
              <span>Try:</span>
              <button type="button" onClick={() => setQuery("NEO motors")}>NEO motors</button>
              <button type="button" onClick={() => setQuery("10-32 bolts")}>10-32 bolts</button>
              <button type="button" onClick={() => setQuery("Powerpole")}>Powerpole</button>
            </div>
          </section>

          <div className="dashboard-columns">
            <section className="locations-section" id="locations" aria-labelledby="locations-heading">
              <div className="section-heading">
                <div>
                  <h2 id="locations-heading">Browse by location</h2>
                  <p>The five places your team stores parts.</p>
                </div>
                <Link href="/locations">
                  Manage
                  <ChevronRight size={16} aria-hidden="true" />
                </Link>
              </div>

              <div className="locations-list">
                {areas.map((area) => {
                  const Icon = AREA_ICONS[area.icon ?? ""] ?? MapPin;
                  const name = area.name ?? "Unnamed area";
                  return (
                    <Link
                      className="location-row"
                      href={`/locations#${name.toLowerCase().replaceAll(" ", "-")}`}
                      key={area.id}
                    >
                      <span className={`location-icon ${area.tone ?? "green"}`}>
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <span className="location-copy">
                        <strong>{name}</strong>
                        <small>{area.structure ?? "Not configured"}</small>
                      </span>
                      <span className="part-count">{area.part_count} parts</span>
                      <ChevronRight className="row-arrow" size={18} aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="request-section" id="request-part" aria-labelledby="request-heading">
              <div className="section-heading">
                <div>
                  <h2 id="request-heading">Request a part</h2>
                  <p>Can’t find something the team needs? Send a request.</p>
                </div>
              </div>

              <form className="request-form" action={requestAction} ref={formRef}>
                <div className="field full-field">
                  <label htmlFor="request-name">Part name</label>
                  <input
                    id="request-name"
                    name="part_name"
                    placeholder="e.g. NEO Vortex motor"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="request-quantity">Quantity</label>
                  <input
                    id="request-quantity"
                    name="quantity"
                    min="1"
                    type="number"
                    defaultValue="1"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="request-priority">Priority</label>
                  <select id="request-priority" name="priority" defaultValue="Normal">
                    <option>Low</option>
                    <option>Normal</option>
                    <option>High</option>
                  </select>
                </div>

                <div className="field full-field">
                  <label htmlFor="request-reason">
                    Reason <span>Optional</span>
                  </label>
                  <textarea
                    id="request-reason"
                    name="reason"
                    placeholder="What will the team use it for?"
                    rows={3}
                  />
                </div>

                <button className="send-request" type="submit" disabled={sending}>
                  <Send size={16} aria-hidden="true" />
                  {sending ? "Sending…" : "Send request"}
                </button>

                <p className="request-success" aria-live="polite">
                  {state?.ok && (
                    <>
                      <CheckCircle2 size={16} aria-hidden="true" />
                      Request sent to the team.
                    </>
                  )}
                  {state && !state.ok && <>{state.error}</>}
                </p>
              </form>
            </section>
          </div>

          <section className="requests-section" aria-labelledby="requests-heading">
            <div className="section-heading">
              <div>
                <h2 id="requests-heading">Recent requests</h2>
                <p>Track what the team still needs and what’s on the way.</p>
              </div>
              <Link href="/requests">
                View all requests
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="requests-list">
              {requests.slice(0, 4).map((request) => (
                <div className="request-row" key={request.id}>
                  <span className="request-part">
                    <strong>{request.part_name}</strong>
                    <small>Qty. {request.quantity}</small>
                  </span>
                  <span className={`priority priority-${request.priority}`}>
                    {titleCase(request.priority)}
                  </span>
                  <span className={`request-status status-${request.status}`}>
                    {titleCase(request.status)}
                  </span>
                </div>
              ))}
              {requests.length === 0 && (
                <div className="empty-feedback">No requests yet.</div>
              )}
            </div>
          </section>

          <section className="recent-section" id="inventory" aria-labelledby="recent-heading">
            <div className="section-heading">
              <div>
                <h2 id="recent-heading">Recently viewed</h2>
                <p>Jump back into the parts you were looking at.</p>
              </div>
              <Link href="/inventory">
                View all inventory
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="recent-table">
              <div className="table-head" aria-hidden="true">
                <span>Part</span>
                <span>Location</span>
                <span>Available</span>
                <span />
              </div>
              {recentParts.map((item) => (
                <Link
                  className="part-row"
                  href={`/inventory?part=${encodeURIComponent(item.name ?? "")}`}
                  key={item.id}
                >
                  <span className="part-name">
                    <span className="part-symbol">
                      <Shapes size={18} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>{item.name}</strong>
                      <small>{item.category_name ?? "Uncategorised"}</small>
                    </span>
                  </span>
                  <span className="part-location">
                    <MapPin size={15} aria-hidden="true" />
                    {item.location_path}
                  </span>
                  <span className="quantity">{item.quantity}</span>
                  <ChevronRight className="row-arrow" size={18} aria-hidden="true" />
                </Link>
              ))}
              {recentParts.length === 0 && (
                <div className="empty-feedback">
                  Parts you open will show up here.
                </div>
              )}
            </div>
          </section>

          <footer className="status-bar">
            <span>
              <span className="status-dot" />
              {lowStock.length
                ? `${lowStock.length} part${lowStock.length === 1 ? "" : "s"} running low`
                : "Inventory is up to date"}
            </span>
            <span>
              <Clock3 size={14} aria-hidden="true" />
              {requests.length} open request{requests.length === 1 ? "" : "s"}
            </span>
          </footer>
        </div>
      </section>
    </main>
  );
}
