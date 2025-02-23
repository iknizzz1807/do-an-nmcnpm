import { ilike } from 'drizzle-orm';
import { db } from '../client';
import { DoiBong, type InsertDoiBongParams } from '../schema/DoiBong';

export const insertDoiBong = async (...doiBong: InsertDoiBongParams[]) => {
    let returning = await db.insert(DoiBong).values(doiBong).returning({ id: DoiBong.maDoi });
    if (returning == null || returning.length == 0)
        throw new Error("Co gi do sai sot trong luc add vo DoiBong: Insert khong duoc");
    return returning;
}

export const selectAllDoiBong = async() => {
    return db.select().from(DoiBong);
}

export const selectDoiBongTen = async(tenDoi: string) => {
    return db.select().from(DoiBong).where(ilike(DoiBong.tenDoi, '%'+ tenDoi + '%'));
}