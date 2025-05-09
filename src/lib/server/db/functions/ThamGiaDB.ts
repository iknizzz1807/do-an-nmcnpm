import type { ThamGiaDB } from "$lib/typesDatabase";
import { db } from "../client";
import { and, count, eq } from "drizzle-orm";
import {
  ThamGiaDBTable,
} from "../schema/ThamGiaDB";
import { CauThuTable } from "../schema/CauThu";
import { LoaiCTTable } from "../schema/Data/LoaiCT";

// Return maCT

export const countThamGiaDB = async (maMG: number, maDoi: number) => {

  return await db.$count(CauThuTable, eq(CauThuTable.maDoi, maDoi));
  // return await db.$count(ThamGiaDBTable, and(eq(ThamGiaDBTable.maMG, maMG), eq(ThamGiaDBTable.maDoi, maDoi)));
}

export const countThamGiaDBNuocNgoai = async (maMG: number, maDoi: number) => {
  return (await db.select({ count: count() }).from(CauThuTable)
    .innerJoin(CauThuTable, eq(ThamGiaDBTable.maCT, CauThuTable.maCT))
    .where(and(eq(CauThuTable.maLCT, 2), eq(ThamGiaDBTable.maDoi, maDoi), eq(ThamGiaDBTable.maMG, maMG))))
    .at(0)?.count ?? 0;
  // return (await db.select({ count: count() }).from(ThamGiaDBTable)
  //   .innerJoin(CauThuTable, eq(ThamGiaDBTable.maCT, CauThuTable.maCT))
  //   .where(and(eq(CauThuTable.maLCT, 2), eq(ThamGiaDBTable.maDoi, maDoi), eq(ThamGiaDBTable.maMG, maMG))))
  //   .at(0)?.count ?? 0;
}

export const isThamGiaDBExceedMax = async (maDoi: number, maLCT: number) => {
  const loaiCT = (await db.select().from(LoaiCTTable).where(eq(LoaiCTTable.maLCT, maLCT))).at(0)!!;
  if (loaiCT.soCauThuToiDa <= 0)
    return false;
  return (await db.$count(CauThuTable, 
    and(
      eq(CauThuTable.maDoi, maDoi), 
      eq(CauThuTable.maLCT, maLCT)
    ))) >= loaiCT.soCauThuToiDa;
}

export const insertThamGiaDB = async (...thamGiaDB: ThamGiaDB[]) => {
  let returning = await db.insert(ThamGiaDBTable).values(thamGiaDB).returning({ id: ThamGiaDBTable.maCT });
  if (returning === null || returning.length === 0)
      throw new Error("Co gi do sai sot trong luc add vo ThamGiaDB: Insert khong duoc");
  return returning;
};

export const deleteThamGiaDB = async (thamGiaDB: ThamGiaDB) => {
  await db.delete(ThamGiaDBTable)
    .where(
      and(
        eq(ThamGiaDBTable.maCT, thamGiaDB.maCT), 
        eq(ThamGiaDBTable.maDoi, thamGiaDB.maDoi), 
        eq(ThamGiaDBTable.maMG, thamGiaDB.maMG)
      )
    );
}

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
