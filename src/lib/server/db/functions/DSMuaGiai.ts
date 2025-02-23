import type { DSMuaGiai } from '$lib/types';
import { db } from '../client';
import { DSMuaGiaiTable, type InsertDSMuaGiaiParams } from '../schema/DSMuaGiai';

export const insertDSMuaGiai = async (...muaGiai: DSMuaGiai[]) => {
    let returning = await db.insert(DSMuaGiaiTable).values(muaGiai).returning({ id: DSMuaGiaiTable.maMG });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo DSMuaGiai: Insert khong duoc");
    return returning;
}

export const selectAllDSMuaGiai = async() => {
    return await db.select().from(DSMuaGiaiTable) satisfies DSMuaGiai[];
}