import type { TypesAreEqual } from '$lib/server/utils';
import type { CauThu } from '$lib/types';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const CauThuTable = sqliteTable('CauThu', {
    maCT: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenCT: text().notNull(),
    ngaySinh: text().notNull(),
    loaiCT: integer().notNull(),
    ghiChu: text().notNull(),
    nuocNgoai: integer().notNull()
})

export type InsertCauThuParams = typeof CauThuTable.$inferInsert;

const check : TypesAreEqual<InsertCauThuParams, CauThu> = true;
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