import { PrismaClient } from "@prisma/client";
import ItemList from "./ItemList";
import ItemForm from "./ItemForm";

const prisma = new PrismaClient();

export default async function Home() {
  // Fetch items and drawers from the database
  const items = await prisma.item.findMany({
    include: { Drawer: true },
  });

  const drawers = await prisma.drawer.findMany();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <ItemList items={items} />
      </div>
    </main>
  );
}
