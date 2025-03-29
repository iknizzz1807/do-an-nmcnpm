import type { TypesAreEqual } from '$lib/server/utils';
import type { DSMuaGiai } from '$lib/typesDatabase';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { db } from '../client';
import { sql } from 'drizzle-orm';

export const DSMuaGiaiTable = sqliteTable('DSMuaGiai', {
    maMG: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenMG: text().notNull(),
    ngayDienRa: text().notNull(),
})

export const DSMuaGiaiTableBackup = sqliteTable('DSMuaGiaiBackup', {
    DSMGBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maMG: integer().notNull(),
    tenMG: text().notNull(),
    ngayDienRa: text().notNull(),
})

const createDSMGBackupTrigger = async() => {
    // DSMuaGiai
    await db.transaction(async (tx) => {
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGD_DSMG_BACKUP
        AFTER DELETE ON DSMuaGiai
        BEGIN
            INSERT INTO DSMuaGiaiBackup(modifiedDate, maMG, tenMG, ngayDienRa)
            VALUES(datetime('now'), OLD.maMG, OLD.tenMG, OLD.ngayDienRa);
        END
        `);
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGU_DSMG_BACKUP
        AFTER UPDATE ON DSMuaGiai
        BEGIN
            INSERT INTO DSMuaGiaiBackup(modifiedDate, maMG, tenMG, ngayDienRa)
            VALUES(datetime('now'), OLD.maMG, OLD.tenMG, OLD.ngayDienRa);
        END
        `);
    });
}
createDSMGBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future

export type InsertDSMuaGiaiParams = typeof DSMuaGiaiTable.$inferInsert;

const checkType : TypesAreEqual<InsertDSMuaGiaiParams, DSMuaGiai> = true;
/*
export interface DSMuaGiai {
    maMG: number;
    tenMG: string;
}

CREATE TABLE IF NOT EXISTS 'DSMuaGiai' (
'maMG' INTEGER primary key NOT NULL UNIQUE,
'tenMG' TEXT NOT NULL
);
*/