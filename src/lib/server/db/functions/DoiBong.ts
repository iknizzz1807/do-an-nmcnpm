import { ilike, eq, or, and, getTableColumns } from "drizzle-orm";
import { db } from "../client";
import { DoiBongTable } from "../schema/DoiBong";
import type { DoiBong } from "$lib/typesDatabase";
import { BanThangTable } from "../schema/BanThang";
import { LichThiDauTable } from "../schema/LichThiDau";
import { ThamGiaDBTable } from "../schema/ThamGiaDB";
import { ThePhatTable } from "../schema/ThePhat";
import { SanNhaTable } from "../schema/Data/SanNha";

export const insertDoiBong = async (...doiBong: DoiBong[]) => {
  let returning = await db.insert(DoiBongTable).values(doiBong).returning({ id: DoiBongTable.maDoi });
  if (returning === null || returning.length === 0)
      throw new Error("Co gi do sai sot trong luc add vo DoiBong: Insert khong duoc");
  return returning;
};

export const updateDoiBong = async(doiBong: DoiBong) => {
  if ((doiBong.maDoi ?? null) == null) {
    throw new Error("Không có mã đội bóng sao update bruh");
  }
  await db.update(DoiBongTable).set({
    tenDoi: doiBong.tenDoi,
    maSan: doiBong.maSan,
    imageURL: doiBong.imageURL,
  }).where(eq(DoiBongTable.maDoi, doiBong.maDoi!!));
}

export const deleteDoiBong = async(maDoi: number) => {
  // const ltd = await db.select({ maTD: LichThiDauTable.maTD }).from(LichThiDauTable)
  //     .where(or(eq(LichThiDauTable.doiMot, maDoi), eq(LichThiDauTable.doiHai, maDoi)));
  // for (const lich of ltd) {
  //   await db.delete(BanThangTable).where(eq(BanThangTable.maTD, lich.maTD));
  //   await db.delete(ThePhatTable).where(eq(ThePhatTable.maTD, lich.maTD));
  //   await db.delete(LichThiDauTable).where(eq(LichThiDauTable.maTD, lich.maTD));
  // }
  // await db.delete(ThamGiaDBTable).where(eq(ThamGiaDBTable.maDoi, maDoi));
  await db.delete(DoiBongTable).where(eq(DoiBongTable.maDoi, maDoi));
}

export const selectDoiBongMaDoi = async (maDoi: number) : Promise<DoiBong | null> => {
  return ((await db
    .select()
    .from(DoiBongTable)
    .where(eq(DoiBongTable.maDoi, maDoi))
    .limit(1)).at(0) ?? null) satisfies (DoiBong | null);
}

export const existsDoiBongMuaGiai = async (maMG: number) => {
  return (await db.select().from(DoiBongTable).where(eq(DoiBongTable.maMG, maMG)).limit(1)).length > 0;
};

export const selectDoiBongMuaGiai = async (maMG: number) => {
  return (await db.select().from(DoiBongTable).where(eq(DoiBongTable.maMG, maMG))) satisfies DoiBong[];
};

export const selectAllDoiBong = async () => {
  return (await db.select().from(DoiBongTable)) satisfies DoiBong[];
};

export const selectAllDoiBongWithTenSan = async () => {
  return (await db.select({
    ...getTableColumns(DoiBongTable),
    tenSan: SanNhaTable.tenSan,
  })
    .from(DoiBongTable)
    .innerJoin(SanNhaTable, eq(SanNhaTable.maSan, DoiBongTable.maSan))) satisfies DoiBong[];
};

export const selectKetQuaTranDauGanDay = async (maDoi: number) => {
  return await db.select(getTableColumns(LichThiDauTable)).from(DoiBongTable)
    .innerJoin(LichThiDauTable, or(eq(LichThiDauTable.doiMot, maDoi), eq(LichThiDauTable.doiHai, maDoi)))
    .where(and(eq(DoiBongTable.maDoi, maDoi)))
    .groupBy(LichThiDauTable.maTD)
    .orderBy(LichThiDauTable.ngayGioThucTe)
    .limit(5);
}

export const selectDoiBongTen = async (tenDoi: string) => {
  return (await db
    .select()
    .from(DoiBongTable)
    .where(ilike(DoiBongTable.tenDoi, "%" + tenDoi + "%"))) satisfies DoiBong[];
};

export const selectDoiBongTenTrung = async (tenDoi: string) => {
  const returning = await db
    .select({ maDoi: DoiBongTable.maDoi })
    .from(DoiBongTable)
    .where(eq(DoiBongTable.tenDoi, tenDoi));

  return Number(returning.at(0));
  // return (
  //   await db
  //     .select({ maDoi: DoiBongTable.maDoi })
  //     .from(DoiBongTable)
  //     .where(eq(DoiBongTable.tenDoi, tenDoi))
  // ).at(0);
};
