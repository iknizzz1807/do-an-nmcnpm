import type { DSMuaGiai } from '$lib/types';
import { db } from '../client';
import { eq } from 'drizzle-orm';
import { DSMuaGiaiTable, DSMuaGiaiTableBackup, type InsertDSMuaGiaiBackupParams, type InsertDSMuaGiaiParams } from '../schema/DSMuaGiai';

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