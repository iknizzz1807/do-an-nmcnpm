
import type { TypesAreEqual } from '$lib/server/utils';
import { integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { MuaGiaiTable } from '../MuaGiai';

export const TieuChiXepHangTable = sqliteTable('TieuChiXepHang', {
    maTC: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenTC: text().notNull(),
    uuTien: real().notNull(),
}, (table) => [
    // uniqueIndex("TieuChiXepHang_maTC").on(table.maTC)
])

export const TieuChiXepHangTableBackup = sqliteTable('TieuChiXepHangBackup', {
    BackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: text().notNull(),
    maTC: integer().notNull(),
    tenTC: text().notNull(),
    uuTien: real().notNull(),
})


export type InsertTieuChiXepHangParams = typeof TieuChiXepHangTable.$inferInsert;
export type InsertTieuChiXepHangBackupParams = typeof TieuChiXepHangTableBackup.$inferInsert;
