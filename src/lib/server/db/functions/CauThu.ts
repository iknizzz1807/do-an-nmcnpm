import { eq, and, ilike } from 'drizzle-orm';
import { db } from '../client';
import { CauThu, type InsertCauThuParams } from '../schema/CauThu';
import { ThamGiaDB } from '../schema/ThamGiaDB';

export const insertCauThu = async (...cauThu: InsertCauThuParams[]) => {
    let returning = await db.insert(CauThu).values(cauThu).returning({ id: CauThu.maCT });
    if (returning == null || returning.length == 0)
        throw new Error("Co gi do sai sot trong luc add vo CauThu: Insert khong duoc");
    return returning;
}

export const selectAllCauThu = async() => {
    return db.select().from(CauThu);
}

export const selectCauThuTen = async(tenCT: string) => {
    return db.select().from(CauThu).where(ilike(CauThu.maCT, tenCT));
}

export const selectCauThuDoiBong = async (maMG: number, maDoi: number) => {
    return db
        .select()
        .from(CauThu)
        .innerJoin(ThamGiaDB, and(eq(ThamGiaDB.maCT, CauThu.maCT), eq(ThamGiaDB.maMG, maMG), eq(ThamGiaDB.maDoi, maMG)));
}