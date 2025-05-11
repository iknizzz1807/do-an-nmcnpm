import type { ThamGiaDB } from "$lib/typesDatabase";
import { db } from "../client";
import { and, count, eq } from "drizzle-orm";
import {
  ThamGiaDBTable,
} from "../schema/ThamGiaDB";
import { CauThuTable } from "../schema/CauThu";
import { LoaiCTTable } from "../schema/Data/LoaiCT";

// Return maCT
export const countThamGiaDB = async (maDoi: number) => {
  return await db.$count(CauThuTable, eq(CauThuTable.maDoi, maDoi));
  // return await db.$count(ThamGiaDBTable, and(eq(ThamGiaDBTable.maMG, maMG), eq(ThamGiaDBTable.maDoi, maDoi)));
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