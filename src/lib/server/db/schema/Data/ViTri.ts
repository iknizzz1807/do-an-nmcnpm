import type { TypesAreEqual } from '$lib/server/utils';
import type { ViTri } from '$lib/typesDatabase';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const ViTriTable = sqliteTable('ViTri', {
    maVT: integer().unique().primaryKey({ autoIncrement: true }).notNull(),
    tenVT: text().notNull()
}, (table) => [
])

export const ViTriTableBackup = sqliteTable('ViTriBackup', {
    BackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: text().notNull(),
    maVT: integer().notNull(),
    tenVT: text().notNull()
})


export type InsertViTriParams = typeof ViTriTable.$inferInsert;
export type InsertViTriBackupParams = typeof ViTriTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertViTriParams, ViTri> = true;