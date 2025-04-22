import type { TypesAreEqual } from '$lib/server/utils';
import type { CauThu } from '$lib/typesDatabase';
import { sql } from 'drizzle-orm';
import { check, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { db } from '../client';
import { LoaiCTTable } from './Data/LoaiCT';
import { DoiBongTable } from './DoiBong';


// Thay đổi tuổi tối thiểu, tuổi tối đa của cầu thủ.
export const CauThuTable = sqliteTable('CauThu', {
    maCT: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenCT: text().notNull(),
    ngaySinh: text().notNull(),
    ghiChu: text().notNull(),
    soAo: integer().notNull(),
    maLCT: integer().notNull().references(() => LoaiCTTable.maLCT, { onDelete: "cascade" }),
    maDoi: integer().notNull().references(() => DoiBongTable.maDoi, { onDelete: "cascade" }),
    deleted: integer({mode: "boolean"}).default(false),
}, (table) => [
    uniqueIndex("CauThu_maCT").on(table.maCT)
])

export const CauThuTableBackup = sqliteTable('CauThuBackup', {
    CTBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maCT: integer().notNull(),
    tenCT: text().notNull(),
    ngaySinh: text().notNull(),
    ghiChu: text().notNull(),
    soAo: integer().notNull(),
    maLCT: integer().notNull(),
    maDoi: integer().notNull(),
})

export type InsertCauThuParams = typeof CauThuTable.$inferInsert;
export type InsertCauThuBackupParams = typeof CauThuTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertCauThuParams, CauThu> = true;
