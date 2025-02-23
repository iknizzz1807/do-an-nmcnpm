import { db } from '../client';
import { LichThiDau, type InsertLichThiDauParams } from '../schema/LichThiDau';

export const insertLichThiDau = async (...lichThiDau: InsertLichThiDauParams[]) => {
    let returning = await db.insert(LichThiDau).values(lichThiDau).returning({ id: LichThiDau.maTD });
    if (returning == null || returning.length == 0)
        throw new Error("Co gi do sai sot trong luc add vo LichThiDau: Insert khong duoc");
    return returning;
}

export const selectAllLichThiDau = async() => {
    return db.select().from(LichThiDau);
}