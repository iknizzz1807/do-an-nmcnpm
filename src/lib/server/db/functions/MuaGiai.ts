import type { MuaGiai } from '$lib/typesDatabase';
import { db } from '../client';
import { eq } from 'drizzle-orm';
import { MuaGiaiTable } from '../schema/MuaGiai';

export const insertMuaGiai = async (...muaGiai: MuaGiai[]) => {
    let returning = await db.insert(MuaGiaiTable).values(muaGiai).returning({ id: MuaGiaiTable.maMG });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo MuaGiai: Insert khong duoc");
    return returning;
}

export const updateMuaGiai = async(muaGiai: MuaGiai) => {
  if ((muaGiai.maMG ?? null) == null)
    return;
  await db.update(MuaGiaiTable).set({
    tenMG: muaGiai.tenMG
  }).where(eq(MuaGiaiTable.maMG, muaGiai.maMG!!));
}

export const selectAllMuaGiai = async() => {
    return await db.select().from(MuaGiaiTable) satisfies MuaGiai[];
}

export const selectMuaGiaiMaMG = async(maMG: number) => {
    return (await db.select().from(MuaGiaiTable).where(eq(MuaGiaiTable.maMG, maMG)).limit(1)).at(0);
}

export const deleteMuaGiai = async (maMG: number) => {
  // const tranDaus = await db.select({maTD: LichThiDauTable.maTD}).from(LichThiDauTable).where(eq(LichThiDauTable.maMG, maMG));
  // for (const tranDau of tranDaus) {
  //   await db.delete(BanThangTable).where(eq(BanThangTable.maTD, tranDau.maTD));
  //   await db.delete(ThePhatTable).where(eq(ThePhatTable.maTD, tranDau.maTD));
  //   await db.delete(LichThiDauTable).where(eq(LichThiDauTable.maTD, tranDau.maTD));
  // }
  // await db.delete(ThamGiaDBTable).where(eq(ThamGiaDBTable.maMG, maMG));
  await db.delete(MuaGiaiTable).where(eq(MuaGiaiTable.maMG, maMG));
}