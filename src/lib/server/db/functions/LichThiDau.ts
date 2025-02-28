import { eq, and } from 'drizzle-orm';
import { db } from '../client';
import { LichThiDauTable, LichThiDauTableBackup, type InsertLichThiDauBackupParams } from '../schema/LichThiDau';
import type { LichThiDau } from '$lib/types';

export const insertLichThiDau = async (...lichThiDau: LichThiDau[]) => {
    const returning = await db.transaction(async(tx) => {
        const insertedValues = await tx.insert(LichThiDauTable).values(lichThiDau).returning();

        const backUps = insertedValues.map((value) => {
            return {
                modifiedDate: new Date(),
                ...value
            } satisfies InsertLichThiDauBackupParams;
        }); // Insert vo backup

        return await tx
            .insert(LichThiDauTableBackup) // Backup
            .values(backUps)
            .returning({ id: LichThiDauTableBackup.maMG });
    });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo LichThiDau: Insert khong duoc");
    return returning;
}

export const selectAllLichThiDau = async() => {
    return await db.select().from(LichThiDauTable) satisfies LichThiDau[];
}

export const selectLichThiDauVong = async (vongThiDau: number, maMG: number) => {
    return await db
        .select()
        .from(LichThiDauTable)
        .where(and(eq(LichThiDauTable.maMG, maMG), eq(LichThiDauTable.vongThiDau, vongThiDau))) satisfies LichThiDau[];
}