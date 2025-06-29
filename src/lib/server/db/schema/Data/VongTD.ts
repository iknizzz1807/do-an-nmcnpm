import type { TypesAreEqual } from '$lib/server/utils';
import type { VongTD } from '$lib/typesDatabase';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const VongTDTable = sqliteTable('VongTD', {
    maVTD: integer().unique().primaryKey({ autoIncrement: true }).notNull(),
    tenVTD: text().notNull(),
}, (table) => [
])

export const VongTDTableBackup = sqliteTable('VongTDBackup', {
    BackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: text().notNull(),
    maVTD: integer().notNull(),
    tenVTD: text().notNull()
})


export type InsertVongTDParams = typeof VongTDTable.$inferInsert;
export type InsertVongTDBackupParams = typeof VongTDTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertVongTDParams, VongTD> = true;