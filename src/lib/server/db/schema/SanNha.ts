import type { TypesAreEqual } from '$lib/server/utils';
import type { SanNha } from '$lib/typesDatabase';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { db } from '../client';
import { sql } from 'drizzle-orm';

export const SanNhaTable = sqliteTable('SanNha', {
    maSan: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenSan: text().notNull(),
    diaChi: text().notNull()
})

export const SanNhaTableBackup = sqliteTable('SanNhaBackup', {
    SNBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maSan: integer().notNull(),
    tenSan: text().notNull(),
    diaChi: text().notNull(),
})

const createSNBackupTrigger = async() => {
    // SanNha
    await db.transaction(async (tx) => {
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGD_SN_BACKUP
        AFTER DELETE ON SanNha
        BEGIN
            INSERT INTO SanNhaBackup(modifiedDate, maSan, tenSan, diaChi)
            VALUES(datetime('now'), OLD.maSan, OLD.tenSan, OLD.diaChi);
        END
        `);
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGU_SN_BACKUP
        AFTER UPDATE ON SanNha
        BEGIN
            INSERT INTO SanNhaBackup(modifiedDate, maSan, tenSan, diaChi)
            VALUES(datetime('now'), OLD.maSan, OLD.tenSan, OLD.diaChi);
        END
        `);
    });
}
createSNBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future

export type InsertSanNhaParams = typeof SanNhaTable.$inferInsert;
export type InsertSanNhaBackupParams = typeof SanNhaTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertSanNhaParams, SanNha> = true;