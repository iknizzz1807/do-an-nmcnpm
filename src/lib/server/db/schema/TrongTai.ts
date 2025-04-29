import type { TypesAreEqual } from '$lib/server/utils';
import type { TrongTai } from '$lib/typesDatabase';
import { check, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { MuaGiaiTable } from './MuaGiai';


// Thay đổi tuổi tối thiểu, tuổi tối đa của cầu thủ.
export const TrongTaiTable = sqliteTable('TrongTai', {
    maTT: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenTT: text().notNull(),
    ngaySinh: text().notNull(),
    maMG: integer().notNull().references(() => MuaGiaiTable.maMG, { onDelete: "cascade" }),
    deleted: integer({mode: "boolean"}).default(false),
}, (table) => [
    uniqueIndex("TrongTai_maTT").on(table.maTT)
])

export const TrongTaiTableBackup = sqliteTable('TrongTaiBackup', {
    BackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maTT: integer().notNull(),
    tenTT: text().notNull(),
    ngaySinh: text().notNull(),
    maMG: integer().notNull(),
})

export type InsertTrongTaiParams = typeof TrongTaiTable.$inferInsert;
export type InsertTrongTaiBackupParams = typeof TrongTaiTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertTrongTaiParams, TrongTai> = true;
