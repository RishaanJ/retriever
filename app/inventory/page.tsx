import { PackagePlus } from "lucide-react";
import Link from "next/link";

import { InventoryTable } from "@/components/inventory-table";
import { PageShell } from "@/components/page-shell";
import { listParts } from "@/lib/queries";

export default async function InventoryPage() {
  const parts = await listParts();

  return (
    <PageShell
      context="Inventory"
      title="Every part, one place."
      actions={
        <Link className="add-button" href="/inventory/new">
          <PackagePlus size={18} aria-hidden="true" />
          Add a part
        </Link>
      }
    >
      <InventoryTable parts={parts} />
    </PageShell>
  );
}
