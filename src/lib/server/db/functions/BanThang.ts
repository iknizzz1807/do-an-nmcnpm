import type { BanThang } from '$lib/typesDatabase';
import { db } from '../client';
import { and, eq } from 'drizzle-orm';
import { BanThangTable } from '../schema/BanThang';

export const insertBanThang = async (...banThang: BanThang[]) => {
    let returning = await db.insert(BanThangTable).values(banThang).returning();
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo BanThang: Insert khong duoc");
    return returning;
}

export const updateBanThang = async(oldBanThang : BanThang, banThang: BanThang) => {
    console.log(oldBanThang);
    console.log(banThang);
    await db.update(BanThangTable).set({
        maTD: banThang.maTD,
        maCT: banThang.maCT,
        maDoi: banThang.maDoi,
        thoiDiem: banThang.thoiDiem,
        loaiBanThang: banThang.loaiBanThang
    }).where(and(eq(BanThangTable.maTD, oldBanThang.maTD!!), 
            eq(BanThangTable.maCT, oldBanThang.maCT),
            eq(BanThangTable.thoiDiem, oldBanThang.thoiDiem)));
}

export const deleteBanThang = async(banThang : BanThang) => {
    await db.delete(BanThangTable)
        .where(and(eq(BanThangTable.maTD, banThang.maTD), 
            eq(BanThangTable.maCT, banThang.maCT), 
            eq(BanThangTable.thoiDiem, banThang.thoiDiem)));
}

export const selectAllBanThang = async() => {
    return (await db.select().from(BanThangTable)) satisfies BanThang[];
}

export const selectBanThang = async(maTD: number) => {
    return (await db.select().from(BanThangTable).where(eq(BanThangTable.maTD, maTD))) satisfies BanThang[];
}