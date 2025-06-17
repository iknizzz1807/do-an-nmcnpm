import type {  TrongTai } from "$lib/typesDatabase";
import { eq } from "drizzle-orm";
import { TrongTaiTable } from "../../schema/TrongTai";
import { db } from "../../client";

export const selectAllTrongTai = async () => {
  return (await db.select().from(TrongTaiTable)) satisfies TrongTai[];
};

export const selectTrongTaiMaTT = async (maTT: number) => {
  return (await db.select().from(TrongTaiTable).where(eq(TrongTaiTable.maTT, maTT)).limit(1)).at(0) ?? null;
};

export const selectTrongTaiMaMG = async (maMG: number) => {
  return await db.select().from(TrongTaiTable).where(eq(TrongTaiTable.maMG, maMG));
};

export const insertTrongTai = async (...TrongTai: TrongTai[]) => {
    let returning = await db.insert(TrongTaiTable).values(TrongTai).returning({ id: TrongTaiTable.maTT });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo TrongTai: Insert khong duoc");
    return returning;
}

export const updateTrongTai = async(TrongTai: TrongTai) => {
  if ((TrongTai.maTT ?? null) == null)
    return;
  await db.update(TrongTaiTable).set({
    tenTT: TrongTai.tenTT,
    ngaySinh: TrongTai.ngaySinh,
  }).where(eq(TrongTaiTable.maTT, TrongTai.maTT!!));
}


export const deleteTrongTai = async (maTT: number) => {
  await db.delete(TrongTaiTable).where(eq(TrongTaiTable.maTT, maTT!!));
}