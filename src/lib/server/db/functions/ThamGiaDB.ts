import type { ThamGiaDB } from "$lib/types";
import { db } from "../client";
import {
  ThamGiaDBTable,
  type InsertThamGiaDBParams,
} from "../schema/ThamGiaDB";

// Return maCT
export const insertThamGiaDB = async (...thamGiaDB: ThamGiaDB[]) => {
  let returning = await db
    .insert(ThamGiaDBTable)
    .values(thamGiaDB)
    .returning({ maCT: ThamGiaDBTable.maCT });
  if (returning === null || returning.length === 0)
    throw new Error(
      "Co gi do sai sot trong luc add vo ThamGiaDB: Insert khong duoc"
    );
  return returning;
};

export const selectAllThamGiaDB = async () => {
  return (await db.select().from(ThamGiaDBTable)) satisfies ThamGiaDB[];
};
