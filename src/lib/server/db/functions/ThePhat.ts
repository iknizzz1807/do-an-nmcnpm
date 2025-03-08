import type { ThePhat } from '$lib/types';
import { db } from '../client';
import { eq } from 'drizzle-orm';
import { ThePhatTable, ThePhatTableBackup, type InsertThePhatBackupParams } from '../schema/ThePhat';

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

export const selectAllThePhat = async() => {
    return (await db.select().from(ThePhatTable)) satisfies ThePhat[];
}