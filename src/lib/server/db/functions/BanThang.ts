import type { BanThang } from '$lib/types';
import { db } from '../client';
import { eq } from 'drizzle-orm';
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

        if (insertedValues.length == 0)
            throw new Error("Đã có lỗi xảy ra: Hình như là xảy ra conflict khi insert. HOW?");
        
        return await tx
            .insert(BanThangTableBackup)
            .values(backUps)
            .returning({ id: BanThangTableBackup.maTD });
    });
    if (returning === null || returning.length === 0)
        throw new Error("Co gi do sai sot trong luc add vo BanThang: Insert khong duoc");
    return returning;
}

export const updateBanThang = async(banThang: BanThang) => {
    return await db.transaction(async (tx) => {
        const updated = await tx.update(BanThangTable).set({
            maCT: banThang.maCT,
            maDoi: banThang.maDoi,
            thoiDiem: banThang.thoiDiem,
            loaiBanThang: banThang.loaiBanThang
        }).where(eq(BanThangTable.maTD, banThang.maTD)).returning();
        await tx
            .insert(BanThangTableBackup)
            .values(updated.map((value) => {
                return {
                    modifiedDate: new Date(),
                    ...value
                } satisfies InsertBanThangBackupParams;
            }));
        return updated;
    });
}

export const selectAllBanThang = async() => {
    return (await db.select().from(BanThangTable)) satisfies BanThang[];
}