import { Send } from "lucide-react";
import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { RequestsList } from "@/components/requests-list";
import { listRequests } from "@/lib/queries";

export default async function RequestsPage() {
  const requests = await listRequests();

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

      <RequestsList requests={requests} />
    </PageShell>
  );
}
