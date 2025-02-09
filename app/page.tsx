import ItemList from "./ItemList";
import { getItems } from "./actions";

export default async function Home() {
  const items = await getItems();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <ItemList items={items} />
      </div>
    </main>
  );
}
