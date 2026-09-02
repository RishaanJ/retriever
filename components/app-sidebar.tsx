"use client";

import {
  CircleHelp,
  LayoutDashboard,
  MapPin,
  Settings,
  Shapes,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/locations", label: "Locations", icon: MapPin },
  { href: "/inventory", label: "All inventory", icon: Shapes },
];

const secondaryItems = [
  { href: "/help", label: "Help", icon: CircleHelp },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link className="brand" href="/" aria-label="Retriever dashboard">
        <span className="brand-mark">
          <Image src="/rdog.png" alt="" width={30} height={30} />
        </span>
        <span className="brand-copy">
          <strong>Retriever</strong>
        </span>
      </Link>

      <nav className="primary-nav" aria-label="Primary navigation">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              className={`nav-item${active ? " active" : ""}`}
              href={item.href}
              key={item.href}
            >
              <Icon size={19} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-spacer" />

      <nav className="secondary-nav" aria-label="Support navigation">
        {secondaryItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              className={`nav-item${active ? " active" : ""}`}
              href={item.href}
              key={item.href}
            >
              <Icon size={19} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
