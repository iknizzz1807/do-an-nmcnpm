import type { DSMuaGiai } from '$lib/types';
import { db } from '../client';
import { eq } from 'drizzle-orm';
import { DSMuaGiaiTable } from '../schema/DSMuaGiai';
import { BanThangTable } from '../schema/BanThang';
import { LichThiDauTable } from '../schema/LichThiDau';
import { ThePhatTable } from '../schema/ThePhat';
import { ThamGiaDBTable } from '../schema/ThamGiaDB';

export const insertDSMuaGiai = async (...muaGiai: DSMuaGiai[]) => {
    let returning = await db.insert(DSMuaGiaiTable).values(muaGiai).returning({ id: DSMuaGiaiTable.maMG });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo DSMuaGiai: Insert khong duoc");
    return returning;
}

export const updateDSMuaGiai = async(muaGiai: DSMuaGiai) => {
  if ((muaGiai.maMG ?? null) == null)
    return;
  await db.update(DSMuaGiaiTable).set({
    tenMG: muaGiai.tenMG
  }).where(eq(DSMuaGiaiTable.maMG, muaGiai.maMG!!));
}

export const selectAllDSMuaGiai = async() => {
    return await db.select().from(DSMuaGiaiTable) satisfies DSMuaGiai[];
}

export const deleteDSMuaGiai = async (maMG: number) => {
  const tranDaus = await db.select({maTD: LichThiDauTable.maTD}).from(LichThiDauTable).where(eq(LichThiDauTable.maMG, maMG));
  for (const tranDau of tranDaus) {
    await db.delete(BanThangTable).where(eq(BanThangTable.maTD, tranDau.maTD));
    await db.delete(ThePhatTable).where(eq(ThePhatTable.maTD, tranDau.maTD));
    await db.delete(LichThiDauTable).where(eq(LichThiDauTable.maTD, tranDau.maTD));
  }
  await db.delete(ThamGiaDBTable).where(eq(ThamGiaDBTable.maMG, maMG));
  await db.delete(DSMuaGiaiTable).where(eq(DSMuaGiaiTable.maMG, maMG));
}