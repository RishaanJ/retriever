import { PageShell } from "@/components/page-shell";
import { BookOpen, LifeBuoy, Search } from "lucide-react";

export default function HelpPage() {
  return (
    <PageShell context="Help" title="How can we help?">
      <div className="page-intro">
        <div>
          <h2>Retriever guide</h2>
          <p>Quick answers for finding, adding, moving, and requesting parts.</p>
        </div>
      </div>

      <div className="help-grid">
        <section className="surface-panel help-feature">
          <Search size={22} aria-hidden="true" />
          <div>
            <h3>Finding a part</h3>
            <p>
              Search by its exact name, category, nickname, or a description.
              Retriever returns the complete physical address.
            </p>
          </div>
        </section>
        <section className="surface-panel help-feature">
          <BookOpen size={22} aria-hidden="true" />
          <div>
            <h3>Keeping inventory accurate</h3>
            <p>
              Update quantity when parts are used and move the item whenever its
              permanent storage location changes.
            </p>
          </div>
        </section>
        <section className="surface-panel help-feature">
          <LifeBuoy size={22} aria-hidden="true" />
          <div>
            <h3>Need more help?</h3>
            <p>Ask an inventory manager or mentor before creating a duplicate part.</p>
          </div>
        </section>
      </div>

      <div className="faq-list">
        <details className="surface-panel">
          <summary>What if the part is not where Retriever says it is?</summary>
          <p>Check nearby containers, then flag it to an inventory manager so the address can be corrected.</p>
        </details>
        <details className="surface-panel">
          <summary>When should I request a part?</summary>
          <p>Request it when the team does not own it or available stock is too low for the project.</p>
        </details>
        <details className="surface-panel">
          <summary>Can one part be stored in multiple places?</summary>
          <p>Yes. Each stock entry can point to a separate location with its own quantity.</p>
        </details>
      </div>
    </PageShell>
  );
}
