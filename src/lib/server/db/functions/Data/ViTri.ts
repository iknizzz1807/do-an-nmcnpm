import type {  ViTri } from "$lib/typesDatabase";
import { eq } from "drizzle-orm";
import { ViTriTable } from "../../schema/Data/ViTri";
import { db } from "../../client";

export const selectAllViTri = async () => {
  return (await db.select().from(ViTriTable)) satisfies ViTri[];
};

export const insertViTri = async (...ViTri: ViTri[]) => {
    let returning = await db.insert(ViTriTable).values(ViTri).returning({ id: ViTriTable.maVT });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo ViTri: Insert khong duoc");
    return returning;
}

export const updateViTri = async(ViTri: ViTri) => {
  if ((ViTri.maVT ?? null) == null)
    return;
  await db.update(ViTriTable).set({
    tenVT: ViTri.tenVT
  }).where(eq(ViTriTable.maVT, ViTri.maVT!!));
}


export const deleteViTri = async (maVT: number) => {
  await db.delete(ViTriTable).where(eq(ViTriTable.maVT, maVT!!));
}