import type { TypesAreEqual } from '$lib/server/utils';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const DiemSoTable = sqliteTable('DiemSo', {
    maDS: integer().unique().primaryKey({ autoIncrement: true }).notNull(),
    tenDS: text().notNull(),
    diemSo: integer().notNull(),
}, (table) => [
])

export const DiemSoTableBackup = sqliteTable('DiemSoBackup', {
    BackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maDS: integer().notNull(),
    tenDS: text().notNull(),
    diemSo: integer().notNull(),
})

export type InsertDiemSoParams = typeof DiemSoTable.$inferInsert;
export type InsertDiemSoBackupParams = typeof DiemSoTableBackup.$inferInsert;

// const checkType : TypesAreEqual<InsertDiemSoParams, DiemSo> = true;