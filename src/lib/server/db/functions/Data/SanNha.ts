import type {  SanNha } from "$lib/typesDatabase";
import { eq } from "drizzle-orm";
import { SanNhaTable } from "../../schema/Data/SanNha";
import { db } from "../../client";

export const selectAllSanNha = async () => {
  return (await db.select().from(SanNhaTable)) satisfies SanNha[];
};

export const selectSanNhaMuaGiai = async (maMG: number) => {
  return await db.select().from(SanNhaTable).where(eq(SanNhaTable.maMG, maMG)) satisfies SanNha[];
}

export const insertSanNha = async (...sanNha: SanNha[]) => {
    let returning = await db.insert(SanNhaTable).values(sanNha).returning({ id: SanNhaTable.maSan });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo SanNha: Insert khong duoc");
    return returning;
}

export const updateSanNha = async(sannha: SanNha) => {
  if ((sannha.maSan ?? null) == null)
    return;
  await db.update(SanNhaTable).set({
    tenSan: sannha.tenSan
  }).where(eq(SanNhaTable.maSan, sannha.maSan!!));
}

export const deleteSanNha = async (maSan: number) => {
  await db.delete(SanNhaTable).where(eq(SanNhaTable.maSan, maSan!!));
}