import { AppSidebar } from "@/components/app-sidebar";
import type { ReactNode } from "react";

type PageShellProps = {
  context: string;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
};

export function PageShell({
  context,
  title,
  children,
  actions,
}: PageShellProps) {
  return (
    <main className="app-shell">
      <AppSidebar />
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="greeting">{context}</p>
            <h1>{title}</h1>
          </div>
          {actions ? <div className="topbar-actions">{actions}</div> : null}
        </header>
        <div className="page-content">{children}</div>
      </section>
    </main>
  );
}
