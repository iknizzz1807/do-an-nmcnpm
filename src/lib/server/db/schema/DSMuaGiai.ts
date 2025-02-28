import type { TypesAreEqual } from '$lib/server/utils';
import type { DSMuaGiai } from '$lib/types';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const DSMuaGiaiTable = sqliteTable('DSMuaGiai', {
    maMG: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenMG: text().notNull(),
})

export const DSMuaGiaiTableBackup = sqliteTable('DSMuaGiaiBackup', {
    DSMGBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maMG: integer().notNull(),
    tenMG: text().notNull(),
})
export type InsertDSMuaGiaiParams = typeof DSMuaGiaiTable.$inferInsert;
export type InsertDSMuaGiaiBackupParams = typeof DSMuaGiaiTableBackup.$inferInsert;

const check : TypesAreEqual<InsertDSMuaGiaiParams, DSMuaGiai> = true;
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