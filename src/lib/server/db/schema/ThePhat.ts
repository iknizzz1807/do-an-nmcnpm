import { integer, sqliteTable, text, primaryKey, real, check, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { LichThiDauTable } from './LichThiDau';
import { CauThuTable } from './CauThu';
import { DoiBongTable } from './DoiBong';
import { type TypesAreEqual } from '$lib/server/utils';
import { type ThePhat } from '$lib/typesDatabase';
import { db } from '../client';
import { sql } from 'drizzle-orm';

export const ThePhatTable = sqliteTable('ThePhat', {
    maTD: integer().notNull().references(() => LichThiDauTable.maTD, { onDelete: "cascade" }),
    maCT: integer().notNull().references(() => CauThuTable.maCT, { onDelete: "cascade" }),
    maDoi: integer().notNull().references(() => DoiBongTable.maDoi, { onDelete: "cascade" }),
    thoiDiem: real().notNull(),
    loaiThe: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.maTD, table.maCT, table.thoiDiem] }),
  check("CHK_TP_THOIDIEM", sql`${table.thoiDiem} BETWEEN 0 AND 90`),
])

export const ThePhatTableBackup = sqliteTable('ThePhatBackup', {
  TPBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
  modifiedDate: integer({mode: "timestamp"}).notNull(),
  maTD: integer().notNull(),
  maCT: integer().notNull(),
  maDoi: integer().notNull(),
  thoiDiem: real().notNull(),
  loaiThe: text().notNull(),
})



export type InsertThePhatParams = typeof ThePhatTable.$inferInsert;
export type InsertThePhatBackupParams = typeof ThePhatTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertThePhatParams, ThePhat> = true;