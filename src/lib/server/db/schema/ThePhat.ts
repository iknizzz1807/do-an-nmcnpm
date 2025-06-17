import { integer, sqliteTable, text, primaryKey, real, check, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { LichThiDauTable } from './LichThiDau';
import { CauThuTable } from './CauThu';
import { DoiBongTable } from './DoiBong';
import { type TypesAreEqual } from '$lib/server/utils';
import { type ThePhat } from '$lib/typesDatabase';
import { db } from '../client';
import { sql } from 'drizzle-orm';
import { LoaiTPTable } from './Data/LoaiTP';

export const ThePhatTable = sqliteTable('ThePhat', {
    maTD: integer().notNull().references(() => LichThiDauTable.maTD, { onDelete: "cascade" }),
    maCT: integer().notNull().references(() => CauThuTable.maCT, { onDelete: "cascade" }),
    thoiDiem: real().notNull(),
    maLTP: integer().notNull().references(() => LoaiTPTable.maLTP, { onDelete: "cascade" }),
    deleted: integer({mode: "boolean"}).default(false),
}, (table) => [
  primaryKey({ columns: [table.maTD, table.maCT, table.thoiDiem] }),
  check("CHK_TP_THOIDIEM", sql`${table.thoiDiem} BETWEEN 0 AND 90`),
])

export const ThePhatTableBackup = sqliteTable('ThePhatBackup', {
  BackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
  modifiedDate: text().notNull(),
  maTD: integer().notNull(),
  maCT: integer().notNull(),
  thoiDiem: real().notNull(),
  maLTP: integer().notNull(),
})



export type InsertThePhatParams = typeof ThePhatTable.$inferInsert;
export type InsertThePhatBackupParams = typeof ThePhatTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertThePhatParams, ThePhat> = true;