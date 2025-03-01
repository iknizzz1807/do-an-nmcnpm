import type { BanThang } from '$lib/types';
import { db } from '../client';
import { eq } from 'drizzle-orm';
import { BanThangTable, BanThangTableBackup, type InsertBanThangBackupParams } from '../schema/BanThang';

export const insertBanThang = async (...banThang: BanThang[]) => {
    let returning = await db.insert(BanThangTable).values(banThang).returning({ id: BanThangTable.maTD });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo BanThang: Insert khong duoc");
    return returning;
}

export const updateBanThang = async(banThang: BanThang) => {
    await db.update(BanThangTable).set({
        maCT: banThang.maCT,
        maDoi: banThang.maDoi,
        thoiDiem: banThang.thoiDiem,
        loaiBanThang: banThang.loaiBanThang
    }).where(eq(BanThangTable.maTD, banThang.maTD));
}

export const selectAllBanThang = async() => {
    return (await db.select().from(BanThangTable)) satisfies BanThang[];
}