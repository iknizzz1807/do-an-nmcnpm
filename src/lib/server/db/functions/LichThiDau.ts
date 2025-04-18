import { eq, and, getTableColumns } from 'drizzle-orm';
import { db } from '../client';
import { LichThiDauTable } from '../schema/LichThiDau';
import type { LichThiDau } from '$lib/typesDatabase';
import { DoiBongTable } from '../schema/DoiBong';
import { DSMuaGiaiTable } from '../schema/DSMuaGiai';
import { alias } from 'drizzle-orm/sqlite-core';
import { BanThangTable } from '../schema/BanThang';
import { ThePhatTable } from '../schema/ThePhat';

export const insertLichThiDau = async (...lichThiDau: LichThiDau[]) => {
    let returning = await db.insert(LichThiDauTable).values(lichThiDau).returning({ id: LichThiDauTable.maTD });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo LichThiDau: Insert khong duoc");
    return returning;
}

export const updateLichThiDau = async(lichThiDau: LichThiDau) => {
  if ((lichThiDau.maTD ?? null) == null)
    return;
  await db.update(LichThiDauTable).set({
    doiMot: lichThiDau.doiMot,
    doiHai: lichThiDau.doiHai,
    vongThiDau: lichThiDau.vongThiDau,
    maMG: lichThiDau.maMG,
    doiThang: lichThiDau.doiThang,
    ngayGio: lichThiDau.ngayGio
  }).where(eq(LichThiDauTable.maTD, lichThiDau.maTD!!))
}

export const deleteLichThiDau = async (maTD: number) => {
  // await db.delete(BanThangTable).where(eq(BanThangTable.maTD, maTD));
  // await db.delete(ThePhatTable).where(eq(ThePhatTable.maTD, maTD));
  await db.delete(LichThiDauTable).where(eq(LichThiDauTable.maTD, maTD));
}

export const selectAllLichThiDau = async() => {
    return await db.select().from(LichThiDauTable) satisfies LichThiDau[];
}

export const selectLichThiDauMaTD = async(maTD: number) => {
  return (await db.select()
    .from(LichThiDauTable)
    .where(eq(LichThiDauTable.maTD, maTD)).limit(1))
    .at(0) satisfies LichThiDau | undefined;
}

export const selectAllLichThiDauWithName = async(maMG: number) => {
  const doiMot = alias(DoiBongTable, "doiMot");
  const doiHai = alias(DoiBongTable, "doiHai");
  const doiThang = alias(DoiBongTable, "doiThang");
  return await 
    db.select({
      ...getTableColumns(LichThiDauTable),
      tenDoiMot: doiMot.tenDoi,
      tenDoiHai: doiHai.tenDoi,
      tenMG: DSMuaGiaiTable.tenMG,
      tenDoiThang: doiThang.tenDoi,
    }).from(LichThiDauTable)
      .innerJoin(doiMot, eq(LichThiDauTable.doiMot, doiMot.maDoi)) 
      .innerJoin(doiHai, eq(LichThiDauTable.doiHai, doiHai.maDoi)) 
      .innerJoin(doiThang, eq(LichThiDauTable.doiHai, doiHai.maDoi)) 
      .innerJoin(DSMuaGiaiTable, eq(LichThiDauTable.maMG, DSMuaGiaiTable.maMG))
      .where(eq(LichThiDauTable.maMG, maMG))
      .groupBy(LichThiDauTable.maTD) satisfies LichThiDau[];
}

export const selectLichThiDauVong = async (vongThiDau: number, maMG: number) => {
    return await db
        .select()
        .from(LichThiDauTable)
        .where(and(eq(LichThiDauTable.maMG, maMG), eq(LichThiDauTable.vongThiDau, vongThiDau))) satisfies LichThiDau[];
}