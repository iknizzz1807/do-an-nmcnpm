import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { db } from '../client';
import type { DoiBong } from '$lib/types';
import type { TypesAreEqual } from '$lib/server/utils';
import { sql } from 'drizzle-orm';

export const DoiBongTable = sqliteTable('DoiBong', {
    maDoi: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenDoi: text().notNull(),
    sanNha: text().notNull(),
})
export const DoiBongTableBackup = sqliteTable('DoiBongBackup', {
    DBBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maDoi: integer().notNull(),
    tenDoi: text().notNull(),
    sanNha: text().notNull(),
})

const createDBBackupTrigger = async() => {
    // DoiBong
    await db.transaction(async (tx) => {
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRG_DB_INSERT_BACKUP
        AFTER INSERT ON DoiBong
        BEGIN
            INSERT INTO DoiBongBackup(modifiedDate, maDoi, tenDoi, sanNha)
            VALUES(datetime('now'), NEW.maDoi, NEW.tenDoi, NEW.sanNha);
        END
        `);
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRG_DB_UPDATE_BACKUP
        AFTER UPDATE ON DoiBong
        BEGIN
            INSERT INTO DoiBongBackup(modifiedDate, maDoi, tenDoi, sanNha)
            VALUES(datetime('now'), OLD.maDoi, OLD.tenDoi, OLD.sanNha);
        END
        `);
    });
}
createDBBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future

export type InsertDoiBongParams = typeof DoiBongTable.$inferInsert;
export type InsertDoiBongBackupParams = typeof DoiBongTableBackup.$inferInsert;

const check : TypesAreEqual<InsertDoiBongParams, DoiBong> = true;
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
