import type { BanThang } from '$lib/types';
import { db } from '../client';
import { and, eq } from 'drizzle-orm';
import { BanThangTable } from '../schema/BanThang';

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

export const deleteBanThang = async(banThang: BanThang) => {
    await db.delete(BanThangTable)
        .where(and(
                eq(BanThangTable.maTD, banThang.maTD), 
                eq(BanThangTable.maCT, banThang.maCT), 
                eq(BanThangTable.thoiDiem, banThang.thoiDiem)));
}

export const selectAllBanThang = async() => {
    return (await db.select().from(BanThangTable)) satisfies BanThang[];
}

export const checkBanThangExists = async (banThang: BanThang) => {
    return (await db.select().from(BanThangTable)
        .where(and(eq(BanThangTable.maTD, banThang.maTD), 
            eq(BanThangTable.maDoi, banThang.maDoi),
            eq(BanThangTable.thoiDiem, banThang.thoiDiem)))
        .limit(1)).length > 0;
}

export const selectBanThang = async(maTD: number) => {
    return (await db.select().from(BanThangTable).where(eq(BanThangTable.maTD, maTD))) satisfies BanThang[];
}