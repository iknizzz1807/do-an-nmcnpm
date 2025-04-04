import type { TypesAreEqual } from '$lib/server/utils';
import type { DSMuaGiai } from '$lib/typesDatabase';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { db } from '../client';
import { sql } from 'drizzle-orm';

export const DSMuaGiaiTable = sqliteTable('DSMuaGiai', {
    maMG: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenMG: text().notNull(),
    ngayDienRa: text().notNull(),
}, (table) => [
    uniqueIndex("DSMuaGiai_maMG").on(table.maMG)
])

export const DSMuaGiaiTableBackup = sqliteTable('DSMuaGiaiBackup', {
    DSMGBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maMG: integer().notNull(),
    tenMG: text().notNull(),
    ngayDienRa: text().notNull(),
})

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