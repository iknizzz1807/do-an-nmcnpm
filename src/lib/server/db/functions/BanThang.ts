import { db } from '../client';
import { BanThang, type InsertBanThangParams } from '../schema/BanThang';

export const insertBanThang = async (...banThang: InsertBanThangParams[]) => {
    let returning = await db.insert(BanThang).values(banThang).returning({ id: BanThang.maTD });
    if (returning == null || returning.length == 0)
        throw new Error("Co gi do sai sot trong luc add vo BanThang: Insert khong duoc");
    return returning;
}

export const selectAllBanThang = async() => {
    return db.select().from(BanThang);
}