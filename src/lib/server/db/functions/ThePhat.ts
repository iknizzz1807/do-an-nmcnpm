import type { ThePhat } from '$lib/typesDatabase';
import { db } from '../client';
import { and, eq } from 'drizzle-orm';
import { ThePhatTable } from '../schema/ThePhat';

export const insertThePhat = async (...thePhat: ThePhat[]) => {
    let returning = await db.insert(ThePhatTable).values(thePhat).returning({ id: ThePhatTable.maTP });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo ThePhat: Insert khong duoc");
    return returning;
}

export const updateThePhat = async(thePhat: ThePhat) => {
    if ((thePhat.maTP ?? null) === null)
        throw new Error("Không có mã bàn thắng sao update");
    await db.update(ThePhatTable).set({
        maCT: thePhat.maCT,
        maDoi: thePhat.maDoi,
        thoiDiem: thePhat.thoiDiem,
        loaiThe: thePhat.loaiThe
    }).where(eq(ThePhatTable.maTP, thePhat.maTP!!));
}

export const deleteThePhat = async(maTP : number) => {
    await db.delete(ThePhatTable)
        .where(eq(ThePhatTable.maTP, maTP));
}

export const selectAllThePhat = async() => {
    return (await db.select().from(ThePhatTable)) satisfies ThePhat[];
}

export const selectThePhat = async(maTD: number) => {
    return (await db.select().from(ThePhatTable).where(eq(ThePhatTable.maTD, maTD))) satisfies ThePhat[];
}