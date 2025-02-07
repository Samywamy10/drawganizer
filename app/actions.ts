"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

interface ItemPosition {
  row: number;
  col: number;
}

interface ItemSize {
  width: number;
  depth: number;
  height: number;
}

export async function addItem(
  formData: FormData,
  position?: ItemPosition,
  size?: ItemSize
) {
  console.log("Form data received:", Object.fromEntries(formData.entries()));
  console.log("Position:", position);
  console.log("Size:", size);

  const name = formData.get("name") as string;
  const drawerId = Number(formData.get("drawerId"));
  const startHeight = Number(formData.get("startHeight")) || 1;
  const iconValue = formData.get("icon");
  const colorValue = formData.get("color");

  if (!name || !drawerId) {
    throw new Error("Name and drawer are required");
  }

  try {
    const data = {
      name,
      drawerId,
      drawerStartRow: position?.row ?? 1,
      drawerStartColumn: position?.col ?? 1,
      itemWidth: size?.width ?? 1,
      itemDepth: size?.depth ?? 1,
      itemHeight: size?.height ?? 1,
      startHeight,
      icon:
        typeof iconValue === "string" && iconValue !== "" ? iconValue : null,
      color:
        typeof colorValue === "string" && colorValue !== "" ? colorValue : null,
    };

    console.log("Creating item with data:", data);

    await prisma.item.create({ data });

    // Revalidate the current path to refresh the data
    revalidatePath("/");
  } catch (error) {
    console.error("Error adding item:", error);
    throw new Error("Failed to add item");
  }
}

export async function deleteItem(itemId: number) {
  try {
    await prisma.item.delete({
      where: { id: itemId },
    });

    // Revalidate the current path to refresh the data
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting item:", error);
    throw new Error("Failed to delete item");
  }
}

export async function updateItem(itemId: number, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    if (!name) throw new Error("Name is required");

    const startHeight = Number(formData.get("startHeight"));
    if (isNaN(startHeight)) throw new Error("Invalid start height");

    const itemHeight = Number(formData.get("itemHeight"));
    if (isNaN(itemHeight)) throw new Error("Invalid item height");

    const iconValue = formData.get("icon");
    const colorValue = formData.get("color");

    const data = {
      name,
      startHeight,
      itemHeight,
      icon:
        typeof iconValue === "string" && iconValue !== "" ? iconValue : null,
      color:
        typeof colorValue === "string" && colorValue !== "" ? colorValue : null,
    };

    console.log("Updating item with data:", data);

    await prisma.item.update({
      where: { id: itemId },
      data,
    });

    // Revalidate the current path to refresh the data
    revalidatePath("/");
  } catch (error) {
    console.error("Error updating item:", error);
    throw error instanceof Error ? error : new Error("Failed to update item");
  }
}

export async function addDrawer(formData: FormData) {
  const name = formData.get("name") as string;
  const width = Number(formData.get("width"));
  const depth = Number(formData.get("depth"));
  const height = Number(formData.get("height"));

  if (!name || !width || !depth || !height) {
    throw new Error("Name, width, depth and height are required");
  }

  try {
    await prisma.drawer.create({
      data: {
        name,
        drawerWidth: width,
        drawerDepth: depth,
        drawerHeight: height,
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("Error adding drawer:", error);
    throw new Error("Failed to add drawer");
  }
}

export async function deleteDrawer(drawerId: number) {
  try {
    await prisma.drawer.delete({
      where: { id: drawerId },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting drawer:", error);
    throw new Error("Failed to delete drawer");
  }
}

export async function updateDrawer(drawerId: number, name: string) {
  try {
    await prisma.drawer.update({
      where: { id: drawerId },
      data: { name },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("Error updating drawer:", error);
    throw new Error("Failed to update drawer");
  }
}

export async function getDrawers() {
  try {
    return await prisma.drawer.findMany();
  } catch (error) {
    console.error("Error fetching drawers:", error);
    throw new Error("Failed to fetch drawers");
  }
}

export async function getItems() {
  try {
    return await prisma.item.findMany({
      include: { Drawer: true },
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    throw new Error("Failed to fetch items");
  }
}
