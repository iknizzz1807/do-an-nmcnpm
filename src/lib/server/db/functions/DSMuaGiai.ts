import { db } from '../client';
import { DSMuaGiai, type InsertDSMuaGiaiParams } from '../schema/DSMuaGiai';

export const insertDSMuaGiai = async (...muaGiai: InsertDSMuaGiaiParams[]) => {
    let returning = await db.insert(DSMuaGiai).values(muaGiai).returning({ id: DSMuaGiai.maMG });
    if (returning == null || returning.length == 0)
        throw new Error("Co gi do sai sot trong luc add vo DSMuaGiai: Insert khong duoc");
    return returning;
}

export const selectAllDSMuaGiai = async() => {
    return db.select().from(DSMuaGiai);
}