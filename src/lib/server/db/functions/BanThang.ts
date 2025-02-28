import type { BanThang } from '$lib/types';
import { db } from '../client';
import { BanThangTable, BanThangTableBackup, type InsertBanThangBackupParams } from '../schema/BanThang';

export const insertBanThang = async (...banThang: BanThang[]) => {
    const returning = await db.transaction(async(tx) => {
        const insertedValues = await tx.insert(BanThangTable).values(banThang).returning();
        const backUps = insertedValues.map((value) => {
            return {
                modifiedDate: new Date(),
                ...value
            } satisfies InsertBanThangBackupParams;
        });
        return await tx
            .insert(BanThangTableBackup)
            .values(backUps)
            .returning({ id: BanThangTableBackup.maTD });
    });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo BanThang: Insert khong duoc");
    return returning;
}

export const selectAllBanThang = async() => {
    return (await db.select().from(BanThangTable)) satisfies BanThang[];
}