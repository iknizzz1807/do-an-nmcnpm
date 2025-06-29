import type { TypesAreEqual } from '$lib/server/utils';
import type { MuaGiai as MuaGiai } from '$lib/typesDatabase';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { db } from '../client';
import { getTableColumns, sql } from 'drizzle-orm';

export const MuaGiaiTable = sqliteTable('MuaGiai', {
    maMG: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenMG: text().notNull(),
    ngayDienRa: text().notNull(),
    ngayKetThuc: text().notNull(),
    imageURL: text().default(""),
    deleted: integer({mode: "boolean"}).default(false),
}, (table) => [
    uniqueIndex("MuaGiai_maMG").on(table.maMG)
])

export const MuaGiaiTableBackup = sqliteTable('MuaGiaiBackup', {
    BackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: text().notNull(),
    maMG: integer().notNull(),
    tenMG: text().notNull(),
    ngayDienRa: text().notNull(),
    ngayKetThuc: text().notNull(),
    imageURL: text(),
})

export type InsertMuaGiaiParams = typeof MuaGiaiTable.$inferInsert;

const checkType : TypesAreEqual<InsertMuaGiaiParams, MuaGiai> = true;
