import { Prisma } from "@prisma/client";

export type ItemWithDrawer = Prisma.ItemGetPayload<{
  include: { Drawer: true };
}>;
