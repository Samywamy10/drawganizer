import { DrawerManager } from "../components/DrawerManager";
import { getDrawers } from "../actions";

export default async function ManagePage() {
  const drawers = await getDrawers();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <DrawerManager drawers={drawers} />
      </div>
    </main>
  );
}
