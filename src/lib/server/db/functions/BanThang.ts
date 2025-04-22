import type { BanThang } from '$lib/typesDatabase';
import { db } from '../client';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { BanThangTable } from '../schema/BanThang';
import { ThamGiaTDTable } from '../schema/ThamGiaTD';

export const insertBanThang = async (...banThang: BanThang[]) => {
    let returning = await db.insert(BanThangTable).values(banThang).returning();
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo BanThang: Insert khong duoc");
    return returning;
}

export const updateBanThang = async(oldBanThang : BanThang, banThang: BanThang) => {
    await db.update(BanThangTable).set({
        maTD: banThang.maTD,
        maCT: banThang.maCT,
        thoiDiem: banThang.thoiDiem,
        maLBT: banThang.maLBT
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
    return (await db.select({
        ...getTableColumns(BanThangTable),
        maDoi: ThamGiaTDTable.maDoi        
    })
    .from(BanThangTable)
    .innerJoin(ThamGiaTDTable, and(eq(ThamGiaTDTable.maCT, BanThangTable.maCT), eq(ThamGiaTDTable.maTD, BanThangTable.maTD)))
    .where(eq(BanThangTable.maTD, maTD))
    .groupBy(BanThangTable.maTD, BanThangTable.maCT)) satisfies BanThang[];
}