import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { db } from '../client';
import type { DoiBong } from '$lib/typesDatabase';
import type { TypesAreEqual } from '$lib/server/utils';
import { sql } from 'drizzle-orm';
import { SanNhaTable } from './SanNha';

export const DoiBongTable = sqliteTable('DoiBong', {
    maDoi: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenDoi: text().notNull(),
    maSan: integer().notNull().references(() => SanNhaTable.maSan, { onDelete: "cascade" }),
})
export const DoiBongTableBackup = sqliteTable('DoiBongBackup', {
    DBBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maDoi: integer().notNull(),
    tenDoi: text().notNull(),
    maSan: integer().notNull(),
})

const createDBBackupTrigger = async() => {
    // DoiBong
    await db.transaction(async (tx) => {
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGD_DB_BACKUP
        AFTER DELETE ON DoiBong
        BEGIN
            INSERT INTO DoiBongBackup(modifiedDate, maDoi, tenDoi, maSan)
            VALUES(datetime('now'), OLD.maDoi, OLD.tenDoi, OLD.maSan);
        END
        `);
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGU_DB_BACKUP
        AFTER UPDATE ON DoiBong
        BEGIN
            INSERT INTO DoiBongBackup(modifiedDate, maDoi, tenDoi, maSan)
            VALUES(datetime('now'), OLD.maDoi, OLD.tenDoi, OLD.maSan);
        END
        `);
    });
}
createDBBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future

export type InsertDoiBongParams = typeof DoiBongTable.$inferInsert;
export type InsertDoiBongBackupParams = typeof DoiBongTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertDoiBongParams, DoiBong> = true;
/*
export interface DoiBong {
    maDoi: string;
    tenDoi: string;
    sanNha: string;
}
CREATE TABLE IF NOT EXISTS 'DoiBong' (
    'maDoi' TEXT primary key NOT NULL UNIQUE,
    'tenDoi' TEXT NOT NULL,
    'sanNha' TEXT NOT NULL
);
*/
