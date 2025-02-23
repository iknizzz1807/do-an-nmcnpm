import { ilike } from 'drizzle-orm';
import { db } from '../client';
import { DoiBongTable } from '../schema/DoiBong';
import type { DoiBong } from '$lib/types';

export const insertDoiBong = async (...doiBong: DoiBong[]) => {
    let returning = await db.insert(DoiBongTable).values(doiBong).returning({ id: DoiBongTable.maDoi });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo DoiBong: Insert khong duoc");
    return returning;
}

export const selectAllDoiBong = async() => {
    return await db.select().from(DoiBongTable) satisfies DoiBong[];
}

export const selectDoiBongTen = async(tenDoi: string) => {
    return await db.select().from(DoiBongTable).where(ilike(DoiBongTable.tenDoi, '%'+ tenDoi + '%')) satisfies DoiBong[];
}