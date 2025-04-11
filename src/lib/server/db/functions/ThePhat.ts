import type { ThePhat } from '$lib/typesDatabase';
import { db } from '../client';
import { and, eq } from 'drizzle-orm';
import { ThePhatTable } from '../schema/ThePhat';

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
        maDoi: thePhat.maDoi,
        thoiDiem: thePhat.thoiDiem,
        loaiThe: thePhat.loaiThe
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
    return (await db.select().from(ThePhatTable).where(eq(ThePhatTable.maTD, maTD))) satisfies ThePhat[];
}