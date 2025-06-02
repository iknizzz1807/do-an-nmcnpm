import type {  LoaiCT } from "$lib/typesDatabase";
import { eq } from "drizzle-orm";
import { LoaiCTTable } from "../../schema/Data/LoaiCT";
import { db } from "../../client";

export const selectAllLoaiCT = async () => {
  return (await db.select().from(LoaiCTTable)) satisfies LoaiCT[];
};

export const selectLoaiCTMaLCT = async (maLCT: number) => {
  return ((await db.select().from(LoaiCTTable)
    .where(eq(LoaiCTTable.maLCT, maLCT)).limit(1)).at(0) ?? null) satisfies (LoaiCT | null);
};


export const insertLoaiCT = async (...LoaiCT: LoaiCT[]) => {
    let returning = await db.insert(LoaiCTTable).values(LoaiCT).returning({ id: LoaiCTTable.maLCT });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo LoaiCT: Insert khong duoc");
    return returning;
}

export const updateLoaiCT = async(LoaiCT: LoaiCT) => {
  if ((LoaiCT.maLCT ?? null) == null)
    return;
  await db.update(LoaiCTTable).set({
    tenLCT: LoaiCT.tenLCT,
    soCauThuToiDa: LoaiCT.soCauThuToiDa
  }).where(eq(LoaiCTTable.maLCT, LoaiCT.maLCT!!));
}

export const deleteLoaiCT = async (maLCT: number) => {
  await db.delete(LoaiCTTable).where(eq(LoaiCTTable.maLCT, maLCT));
}