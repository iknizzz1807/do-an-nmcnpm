import type { TypesAreEqual } from '$lib/server/utils';
import type { SanNha } from '$lib/typesDatabase';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { MuaGiaiTable } from '../MuaGiai';

export const SanNhaTable = sqliteTable('SanNha', {
    maSan: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenSan: text().notNull(),
    diaChi: text().notNull(),
    maMG: integer().notNull().references(() => MuaGiaiTable.maMG, { onDelete: "cascade" }),
}, (table) => [
    // uniqueIndex("SanNha_maSan").on(table.maSan)
])

export const SanNhaTableBackup = sqliteTable('SanNhaBackup', {
    SNBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maSan: integer().notNull(),
    tenSan: text().notNull(),
    diaChi: text().notNull(),
    maMG: integer().notNull()
})


export type InsertSanNhaParams = typeof SanNhaTable.$inferInsert;
export type InsertSanNhaBackupParams = typeof SanNhaTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertSanNhaParams, SanNha> = true;