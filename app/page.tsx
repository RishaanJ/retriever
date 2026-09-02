import { HomeView } from "@/components/home-view";
import {
  listLowStockParts,
  listRecentlyViewed,
  listRequests,
  listStorageAreas,
} from "@/lib/queries";

export default async function Home() {
  const [areas, requests, recentParts, lowStock] = await Promise.all([
    listStorageAreas(),
    listRequests(),
    listRecentlyViewed(3),
    listLowStockParts(),
  ]);

  return (
    <HomeView
      areas={areas}
      requests={requests}
      recentParts={recentParts}
      lowStock={lowStock}
    />
  );
}
