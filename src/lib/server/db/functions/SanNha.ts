import type {  SanNha } from "$lib/types";
import { db } from "../client";
import { SanNhaTable } from "../schema/SanNha";

export const selectAllSanNha = async () => {
  return (await db.select().from(SanNhaTable)) satisfies SanNha[];
};