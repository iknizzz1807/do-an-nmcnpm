import type { ThePhat } from '$lib/typesDatabase';
import { db } from '../client';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { ThePhatTable } from '../schema/ThePhat';
import { ThamGiaTDTable } from '../schema/ThamGiaTD';

export const insertThePhat = async (...thePhat: ThePhat[]) => {
    await db.insert(ThePhatTable).values(thePhat);
    // if (returning === null || returning.length === 0)
    //     throw new Error("Co gi do sai sot trong luc add vo ThePhat: Insert khong duoc");
    // return returning;
}

export const updateThePhat = async(oldThePhat: ThePhat, thePhat: ThePhat) => {
    await db.update(ThePhatTable).set({
        maTD: thePhat.maTD,
        maCT: thePhat.maCT,
        thoiDiem: thePhat.thoiDiem,
        maLTP: thePhat.maLTP
    }).where(and(eq(ThePhatTable.maTD, oldThePhat.maTD!!), 
            eq(ThePhatTable.maCT, oldThePhat.maCT), 
            eq(ThePhatTable.thoiDiem, oldThePhat.thoiDiem)));
}

export const deleteThePhat = async(thePhat : ThePhat) => {
    await db.delete(ThePhatTable)
        .where(and(eq(ThePhatTable.maTD, thePhat.maTD), 
            eq(ThePhatTable.maCT, thePhat.maCT), 
            eq(ThePhatTable.thoiDiem, thePhat.thoiDiem)));
}

export const selectAllThePhat = async() => {
    return (await db.select().from(ThePhatTable)) satisfies ThePhat[];
}

export const selectThePhat = async(maTD: number) => {
    return (await db.select({
        ...getTableColumns(ThePhatTable),
        maDoi: ThamGiaTDTable.maDoi,
    })
    .from(ThePhatTable)
    .innerJoin(ThamGiaTDTable, eq(ThamGiaTDTable.maTD, ThePhatTable.maTD))
    .where(eq(ThePhatTable.maTD, maTD))
    .groupBy(ThePhatTable.maTD, ThePhatTable.maCT)) satisfies ThePhat[];
}