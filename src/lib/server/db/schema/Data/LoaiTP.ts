import type { TypesAreEqual } from '$lib/server/utils';
import type { LoaiTP } from '$lib/typesDatabase';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const LoaiTPTable = sqliteTable('LoaiTP', {
    maLTP: integer().unique().primaryKey({ autoIncrement: true }).notNull(),
    tenLTP: text().notNull(), 
    soThePhatToiDa: integer().notNull(),
}, (table) => [
])

export const LoaiTPTableBackup = sqliteTable('LoaiTPBackup', {
    BackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maLTP: integer().notNull(),
    tenLTP: text().notNull(),
    soThePhatToiDa: integer().notNull(),
})


export type InsertLoaiTPParams = typeof LoaiTPTable.$inferInsert;
export type InsertLoaiTPBackupParams = typeof LoaiTPTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertLoaiTPParams, LoaiTP> = true;