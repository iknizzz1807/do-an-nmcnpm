import type { BanThang } from '$lib/types';
import { db } from '../client';
import { BanThangTable } from '../schema/BanThang';

export const insertBanThang = async (...banThang: BanThang[]) => {
    let returning = await db.insert(BanThangTable).values(banThang).returning({ id: BanThangTable.maTD });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo BanThang: Insert khong duoc");
    return returning;
}

export const selectAllBanThang = async() => {
    return (await db.select().from(BanThangTable)) satisfies BanThang[];
}