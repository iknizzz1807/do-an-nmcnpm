import type { ThamGiaDB } from "$lib/typesDatabase";
import { db } from "../client";
import { and, count, eq } from "drizzle-orm";
import {
  ThamGiaDBTable,
} from "../schema/ThamGiaDB";
import { CauThuTable } from "../schema/CauThu";

// Return maCT

export const countThamGiaDB = async (maMG: number, maDoi: number) => {
  return await db.$count(ThamGiaDBTable, and(eq(ThamGiaDBTable.maMG, maMG), eq(ThamGiaDBTable.maDoi, maDoi)));
}

export const countThamGiaDBNuocNgoai = async (maMG: number, maDoi: number) => {
  return (await db.select({ count: count() }).from(ThamGiaDBTable)
    .innerJoin(CauThuTable, eq(ThamGiaDBTable.maCT, CauThuTable.maCT))
    .where(and(eq(CauThuTable.nuocNgoai, true), eq(ThamGiaDBTable.maDoi, maDoi), eq(ThamGiaDBTable.maMG, maMG))))
    .at(0)?.count ?? 0;
}

export const insertThamGiaDB = async (...thamGiaDB: ThamGiaDB[]) => {
  let returning = await db.insert(ThamGiaDBTable).values(thamGiaDB).returning({ id: ThamGiaDBTable.maCT });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo ThamGiaDB: Insert khong duoc");
    return returning;
};

// Todo: this is not the final version, there is something wrong with this
export const updateThamGiaDB = async(thamGiaDB: ThamGiaDB) => {
  await db.update(ThamGiaDBTable).set({
    maMG: thamGiaDB.maMG,
    maDoi: thamGiaDB.maDoi,
  }).where(eq(ThamGiaDBTable.maCT, thamGiaDB.maCT!!))
}

export const selectAllThamGiaDB = async () => {
  return (await db.select().from(ThamGiaDBTable)) satisfies ThamGiaDB[];
};
