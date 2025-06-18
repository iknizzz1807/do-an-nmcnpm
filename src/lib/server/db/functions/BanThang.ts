import type { BanThang } from '$lib/typesDatabase';
import { db } from '../client';
import { and, eq, getTableColumns, gt, lt, lte, sql } from 'drizzle-orm';
import { BanThangTable } from '../schema/BanThang';
import { ThamGiaTDTable } from '../schema/ThamGiaTD';
import { LoaiBTTable } from '../schema/Data/LoaiBT';
import { CauThuTable } from '../schema/CauThu';

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

export const existsBanThangMaTD = async(maTD: number) => {
    return (await db.select().from(BanThangTable).where(eq(BanThangTable.maTD, maTD)).limit(1)).length > 0;
}

export const selectTiSoTranDau = async(maTD: number, maDoi: number) => {
  return (await db.select({ tySo: sql`count(${BanThangTable.thoiDiem})`.mapWith(Number)  })
          .from(BanThangTable)
          .innerJoin(CauThuTable, and(
            eq(CauThuTable.maCT, BanThangTable.maCT),
            eq(CauThuTable.maDoi, maDoi)
        ))
          .innerJoin(LoaiBTTable, eq(LoaiBTTable.maLBT, BanThangTable.maLBT))
          .where(and(
            gt(LoaiBTTable.diemBT, 0), 
            eq(BanThangTable.maTD, maTD)
        ))
          .groupBy(BanThangTable.maTD)).at(0) ?? { tySo: 0 };
}

export const selectTiSoPhanLuoiTranDau = async(maTD: number, maDoi: number) => {
  return (await db.select({ tySo: sql`count(${BanThangTable.thoiDiem})`.mapWith(Number)  })
          .from(BanThangTable)
          .innerJoin(CauThuTable, and(
            eq(CauThuTable.maCT, BanThangTable.maCT),
            eq(CauThuTable.maDoi, maDoi)
        ))
          .innerJoin(LoaiBTTable, eq(LoaiBTTable.maLBT, BanThangTable.maLBT))
          .where(and(
            lt(LoaiBTTable.diemBT, 0), 
            eq(BanThangTable.maTD, maTD)
        ))
          .groupBy(BanThangTable.maTD)).at(0) ?? { tySo: 0 };
}

export const selectBanThang = async(maTD: number) => {
    return (await db.select({
        ...getTableColumns(BanThangTable),
        maDoi: ThamGiaTDTable.maDoi        
    })
    .from(BanThangTable)
    .innerJoin(ThamGiaTDTable, and(eq(ThamGiaTDTable.maCT, BanThangTable.maCT), eq(ThamGiaTDTable.maTD, BanThangTable.maTD)))
    .where(eq(BanThangTable.maTD, maTD))
    .groupBy(BanThangTable.maTD, BanThangTable.thoiDiem)) satisfies BanThang[];
}