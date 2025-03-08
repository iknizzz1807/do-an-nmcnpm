import type { ThePhat } from '$lib/types';
import { db } from '../client';
import { eq, and } from 'drizzle-orm';
import { ThePhatTable } from '../schema/ThePhat';

export const insertThePhat = async (...ThePhat: ThePhat[]) => {
    let returning = await db.insert(ThePhatTable).values(ThePhat).returning({ id: ThePhatTable.maTD });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo ThePhat: Insert khong duoc");
    return returning;
}

export const updateThePhat = async(ThePhat: ThePhat) => {
    await db.update(ThePhatTable).set({
        maCT: ThePhat.maCT,
        maDoi: ThePhat.maDoi,
        thoiDiem: ThePhat.thoiDiem,
        loaiThe: ThePhat.loaiThe
    }).where(eq(ThePhatTable.maTD, ThePhat.maTD));
}


export const checkThePhatExists = async (ThePhat: ThePhat) => {
    return (await db.select().from(ThePhatTable)
        .where(and(eq(ThePhatTable.maTD, ThePhat.maTD), 
            eq(ThePhatTable.maDoi, ThePhat.maDoi),
            eq(ThePhatTable.thoiDiem, ThePhat.thoiDiem)))
        .limit(1)).length > 0;
}

export const selectThePhat = async(maTD: number) => {
    return (await db.select().from(ThePhatTable).where(eq(ThePhatTable.maTD, maTD))) satisfies ThePhat[];
}

export const deleteThePhat = async(ThePhat: ThePhat) => {
    await db.delete(ThePhatTable)
        .where(and(
                eq(ThePhatTable.maTD, ThePhat.maTD), 
                eq(ThePhatTable.maCT, ThePhat.maCT), 
                eq(ThePhatTable.thoiDiem, ThePhat.thoiDiem)));
}


export const selectAllThePhat = async() => {
    return (await db.select().from(ThePhatTable)) satisfies ThePhat[];
}