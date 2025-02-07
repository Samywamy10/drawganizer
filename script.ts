import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const drawer = await prisma.drawer.create({
    data: {
      name: "Drawer 1",
      drawerWidth: 24,
      drawerDepth: 12,
      drawerHeight: 12,
    },
  });
  const user = await prisma.item.create({
    data: {
      name: "Screws",
      drawerId: drawer.id,
      drawerStartRow: 1,
      drawerStartColumn: 1,
      itemWidth: 1,
      itemDepth: 1,
      itemHeight: 1,
    },
  });
  console.log(user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
