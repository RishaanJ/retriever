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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { HeroColorPanelsVisual } from "@/components/ui/hero-color-panels";
import { AppSidebar } from "@/components/app-sidebar";

const storageAreas = [
  {
    name: "Huge Shelf",
    detail: "6 tiers",
    count: 142,
    icon: Warehouse,
    tone: "green",
  },
  {
    name: "Under Center Table",
    detail: "3 bins",
    count: 68,
    icon: TableProperties,
    tone: "blue",
  },
  {
    name: "Under 3DP Table",
    detail: "3 bins",
    count: 31,
    icon: TableProperties,
    tone: "violet",
  },
  {
    name: "Husky",
    detail: "10 drawers",
    count: 87,
    icon: Wrench,
    tone: "orange",
  },
  {
    name: "Blue Drawers",
    detail: "6 drawers",
    count: 53,
    icon: Archive,
    tone: "yellow",
  },
];

const recentItems = [
  {
    name: "NEO Motor Pinion — 14T",
    category: "Gears",
    location: "6-Tier Shelf · Tier 3 · Box 3",
    quantity: 12,
  },
  {
    name: "10-32 × ¾ in. Button Head",
    category: "Hardware",
    location: "Husky · Drawer 4 · Compartment B",
    quantity: 46,
  },
  {
    name: "Anderson Powerpole Housing",
    category: "Electrical",
    location: "Under Main Table · Left · Bin 2",
    quantity: 24,
  },
];

type PartRequest = {
  id: number;
  name: string;
  quantity: number;
  priority: "Low" | "Normal" | "High";
  status: "Requested" | "Ordered" | "Arrived";
};

const initialRequests: PartRequest[] = [
  {
    id: 1,
    name: "REV Through Bore Encoder",
    quantity: 2,
    priority: "High",
    status: "Requested",
  },
  {
    id: 2,
    name: "Kraken X60 Motor",
    quantity: 4,
    priority: "Normal",
    status: "Ordered",
  },
  {
    id: 3,
    name: "1/2 in. Hex Bearings",
    quantity: 12,
    priority: "Normal",
    status: "Arrived",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [requests, setRequests] = useState<PartRequest[]>(initialRequests);
  const [partName, setPartName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [priority, setPriority] = useState<PartRequest["priority"]>("Normal");
  const [reason, setReason] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query.trim());
  }

  function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = partName.trim();
    if (!trimmedName) return;

    setRequests((current) => [
      {
        id: Date.now(),
        name: trimmedName,
        quantity: Math.max(1, Number(quantity) || 1),
        priority,
        status: "Requested",
      },
      ...current,
    ]);
    setPartName("");
    setQuantity("1");
    setPriority("Normal");
    setReason("");
    setRequestSent(true);
    window.setTimeout(() => setRequestSent(false), 4000);
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
              <span className="notification-dot" />
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
                    <span>3 new</span>
                  </div>
                  <Link href="/settings">Preferences</Link>
                </div>
                <div className="notification-item unread">
                  <span className="notification-icon">
                    <PackagePlus size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <strong>Kraken X60 motors were ordered</strong>
                    <p>Your request for 4 motors is now on the way.</p>
                    <small>12 minutes ago</small>
                  </div>
                </div>
                <div className="notification-item unread">
                  <span className="notification-icon">
                    <MapPin size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <strong>Powerpoles moved</strong>
                    <p>Now under Center Table · Bin 2.</p>
                    <small>1 hour ago</small>
                  </div>
                </div>
                <div className="notification-item">
                  <span className="notification-icon">
                    <CheckCircle2 size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <strong>Hex bearings arrived</strong>
                    <p>12 bearings are ready to be stocked.</p>
                    <small>Yesterday</small>
                  </div>
                </div>
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
                {storageAreas.map((area) => {
                  const Icon = area.icon;
                  return (
                    <Link
                      className="location-row"
                      href={`/locations#${area.name.toLowerCase().replaceAll(" ", "-")}`}
                      key={area.name}
                    >
                      <span className={`location-icon ${area.tone}`}>
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <span className="location-copy">
                        <strong>{area.name}</strong>
                        <small>{area.detail}</small>
                      </span>
                      <span className="part-count">{area.count} parts</span>
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

              <form className="request-form" onSubmit={handleRequest}>
                <div className="field full-field">
                  <label htmlFor="request-name">Part name</label>
                  <input
                    id="request-name"
                    value={partName}
                    onChange={(event) => setPartName(event.target.value)}
                    placeholder="e.g. NEO Vortex motor"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="request-quantity">Quantity</label>
                  <input
                    id="request-quantity"
                    min="1"
                    type="number"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="request-priority">Priority</label>
                  <select
                    id="request-priority"
                    value={priority}
                    onChange={(event) =>
                      setPriority(event.target.value as PartRequest["priority"])
                    }
                  >
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
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="What will the team use it for?"
                    rows={3}
                  />
                </div>

                <button className="send-request" type="submit">
                  <Send size={16} aria-hidden="true" />
                  Send request
                </button>

                <p className="request-success" aria-live="polite">
                  {requestSent && (
                    <>
                      <CheckCircle2 size={16} aria-hidden="true" />
                      Request sent to the team.
                    </>
                  )}
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
                    <strong>{request.name}</strong>
                    <small>Qty. {request.quantity}</small>
                  </span>
                  <span className={`priority priority-${request.priority.toLowerCase()}`}>
                    {request.priority}
                  </span>
                  <span className={`request-status status-${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                </div>
              ))}
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
              {recentItems.map((item) => (
                <Link
                  className="part-row"
                  href={`/inventory?part=${encodeURIComponent(item.name)}`}
                  key={item.name}
                >
                  <span className="part-name">
                    <span className="part-symbol">
                      <Shapes size={18} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>{item.name}</strong>
                      <small>{item.category}</small>
                    </span>
                  </span>
                  <span className="part-location">
                    <MapPin size={15} aria-hidden="true" />
                    {item.location}
                  </span>
                  <span className="quantity">{item.quantity}</span>
                  <ChevronRight className="row-arrow" size={18} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>

          <footer className="status-bar">
            <span>
              <span className="status-dot" />
              Inventory is up to date
            </span>
            <span>
              <Clock3 size={14} aria-hidden="true" />
              Last updated today at 3:42 PM
            </span>
          </footer>
        </div>
      </section>
    </main>
  );
}
