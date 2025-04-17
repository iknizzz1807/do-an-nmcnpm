import type { TypesAreEqual } from '$lib/server/utils';
import type { MuaGiai as MuaGiai } from '$lib/typesDatabase';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { db } from '../client';
import { sql } from 'drizzle-orm';

export const MuaGiaiTable = sqliteTable('MuaGiai', {
    maMG: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenMG: text().notNull(),
    ngayDienRa: text().notNull(),
    ngayKetThuc: text().notNull(),
}, (table) => [
    uniqueIndex("MuaGiai_maMG").on(table.maMG)
])

export const MuaGiaiTableBackup = sqliteTable('MuaGiaiBackup', {
    DSMGBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maMG: integer().notNull(),
    tenMG: text().notNull(),
    ngayDienRa: text().notNull(),
})

export type InsertMuaGiaiParams = typeof MuaGiaiTable.$inferInsert;

const checkType : TypesAreEqual<InsertMuaGiaiParams, MuaGiai> = true;
