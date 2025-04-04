import type { TypesAreEqual } from '$lib/server/utils';
import type { CauThu } from '$lib/typesDatabase';
import { sql } from 'drizzle-orm';
import { check, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { db } from '../client';


// Thay đổi tuổi tối thiểu, tuổi tối đa của cầu thủ.
export const CauThuTable = sqliteTable('CauThu', {
    maCT: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenCT: text().notNull(),
    ngaySinh: text().notNull(),
    loaiCT: integer().notNull(),
    ghiChu: text().notNull(),
    nuocNgoai: integer({ mode: "boolean" }).notNull()
}, (table) => [
    uniqueIndex("CauThu_maCT").on(table.maCT)
])

export const CauThuTableBackup = sqliteTable('CauThuBackup', {
    CTBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maCT: integer().notNull(),
    tenCT: text().notNull(),
    ngaySinh: text().notNull(),
    loaiCT: integer().notNull(),
    ghiChu: text().notNull(),
    nuocNgoai: integer().notNull()
})

export type InsertCauThuParams = typeof CauThuTable.$inferInsert;
export type InsertCauThuBackupParams = typeof CauThuTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertCauThuParams, CauThu> = true;
/*
export interface CauThu {
    maCT: string;
    tenCT: string;
    ngaySinh: Date;
    loaiCT: number;
    ghiChu: string;
}
CREATE TABLE IF NOT EXISTS 'CauThu' (
'maCT' TEXT primary key NOT NULL UNIQUE,
'tenCT' TEXT NOT NULL,
'ngaySinh' TEXT NOT NULL,
'loaiCT' INTEGER NOT NULL,
'ghiChu' TEXT NOT NULL
);
*/