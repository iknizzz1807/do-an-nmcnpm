import type {  VongTD } from "$lib/typesDatabase";
import { eq } from "drizzle-orm";
import { VongTDTable } from "../../schema/Data/VongTD";
import { db } from "../../client";

export const selectAllVongTD = async () => {
  return (await db.select().from(VongTDTable)) satisfies VongTD[];
};

export const insertVongTD = async (...VongTD: VongTD[]) => {
    let returning = await db.insert(VongTDTable).values(VongTD).returning({ id: VongTDTable.maVTD });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo VongTD: Insert khong duoc");
    return returning;
}

export const updateVongTD = async(VongTD: VongTD) => {
  if ((VongTD.maVTD ?? null) == null)
    return;
  await db.update(VongTDTable).set({
    tenVTD: VongTD.tenVTD
  }).where(eq(VongTDTable.maVTD, VongTD.maVTD!!));
}


export const deleteVongTD = async (maVTD: number) => {
  await db.delete(VongTDTable).where(eq(VongTDTable.maVTD, maVTD!!));
}