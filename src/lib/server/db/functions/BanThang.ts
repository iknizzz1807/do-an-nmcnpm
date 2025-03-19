import type { BanThang } from '$lib/types';
import { db } from '../client';
import { and, eq } from 'drizzle-orm';
import { BanThangTable } from '../schema/BanThang';

export const insertBanThang = async (...banThang: BanThang[]) => {
    let returning = await db.insert(BanThangTable).values(banThang).returning({ id: BanThangTable.maBT });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo BanThang: Insert khong duoc");
    return returning;
}

export const updateBanThang = async(banThang: BanThang) => {
    if ((banThang.maBT ?? null) === null)
        throw new Error("Không có mã bàn thắng sao update");
    await db.update(BanThangTable).set({
        maCT: banThang.maCT,
        maDoi: banThang.maDoi,
        thoiDiem: banThang.thoiDiem,
        loaiBanThang: banThang.loaiBanThang
    }).where(eq(BanThangTable.maBT, banThang.maBT!!));
}

export const deleteBanThang = async(banThang: BanThang) => {
    if ((banThang.maBT ?? null) === null)
        throw new Error("Không có mã bàn thắng sao update");
    await db.delete(BanThangTable)
        .where(eq(BanThangTable.maBT, banThang.maBT!!));
}

export const selectAllBanThang = async() => {
    return (await db.select().from(BanThangTable)) satisfies BanThang[];
}

export const selectBanThang = async(maTD: number) => {
    return (await db.select().from(BanThangTable).where(eq(BanThangTable.maTD, maTD))) satisfies BanThang[];
}