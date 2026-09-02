import { NewPartForm } from "@/components/new-part-form";
import { PageShell } from "@/components/page-shell";
import { listCategories, listLocations } from "@/lib/queries";

export default async function NewPartPage() {
  const [categories, locations] = await Promise.all([
    listCategories(),
    listLocations(),
  ]);

  return (
    <PageShell context="Inventory" title="Add a new part.">
      <div className="page-intro">
        <div>
          <h2>Part details</h2>
          <p>Create the part and give it a location your teammates can follow.</p>
        </div>
      </div>

      <NewPartForm categories={categories} locations={locations} />
    </PageShell>
  );
}
