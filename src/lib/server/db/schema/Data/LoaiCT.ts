import type { TypesAreEqual } from '$lib/server/utils';
import type { LoaiCT } from '$lib/typesDatabase';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const LoaiCTTable = sqliteTable('LoaiCT', {
    maLCT: integer().unique().primaryKey({ autoIncrement: true }).notNull(),
    tenLCT: text().notNull(),
    soCauThuToiDa: integer().notNull()
}, (table) => [
])

export const LoaiCTTableBackup = sqliteTable('LoaiCTBackup', {
    SNBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maLCT: integer().notNull(),
    tenLCT: text().notNull(),
    soCauThuToiDa: integer().notNull()
})


export type InsertLoaiCTParams = typeof LoaiCTTable.$inferInsert;
export type InsertLoaiCTBackupParams = typeof LoaiCTTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertLoaiCTParams, LoaiCT> = true;