import type {  SanNha } from "$lib/typesDatabase";
import { eq } from "drizzle-orm";
import { db } from "../client";
import { SanNhaTable } from "../schema/SanNha";

export const selectAllSanNha = async () => {
  return (await db.select().from(SanNhaTable)) satisfies SanNha[];
};

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

