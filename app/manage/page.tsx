import { PrismaClient } from "@prisma/client";
import { DrawerManager } from "../components/DrawerManager";

const prisma = new PrismaClient();

export default async function ManagePage() {
  const drawers = await prisma.drawer.findMany();
  console.log(drawers);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <DrawerManager drawers={drawers} />
      </div>
    </main>
  );
}
