import type {  LoaiBT } from "$lib/typesDatabase";
import { eq } from "drizzle-orm";
import { LoaiBTTable } from "../../schema/Data/LoaiBT";
import { db } from "../../client";

export const selectAllLoaiBT = async () => {
  return (await db.select().from(LoaiBTTable)) satisfies LoaiBT[];
};

export const insertLoaiBT = async (...LoaiBT: LoaiBT[]) => {
    let returning = await db.insert(LoaiBTTable).values(LoaiBT).returning({ id: LoaiBTTable.maLBT });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo LoaiBT: Insert khong duoc");
    return returning;
}

export const updateLoaiBT = async(LoaiBT: LoaiBT) => {
  if ((LoaiBT.maLBT ?? null) == null)
    return;
  await db.update(LoaiBTTable).set({
    tenLBT: LoaiBT.tenLBT,
    diemBT: LoaiBT.diemBT
  }).where(eq(LoaiBTTable.maLBT, LoaiBT.maLBT!!));
}

export const deleteLoaiBT = async (maLBT: number) => {
  await db.delete(LoaiBTTable).where(eq(LoaiBTTable.maLBT, maLBT));
}