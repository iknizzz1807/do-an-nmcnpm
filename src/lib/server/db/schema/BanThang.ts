import { integer, sqliteTable, text, primaryKey, real } from 'drizzle-orm/sqlite-core';
import { LichThiDauTable } from './LichThiDau';
import { CauThuTable } from './CauThu';
import { DoiBongTable } from './DoiBong';
import { type TypesAreEqual } from '$lib/server/utils';
import { type BanThang } from '$lib/types';
import { db } from '../client';
import { sql } from 'drizzle-orm';

export const BanThangTable = sqliteTable('BanThang', {
    maTD: integer().notNull().references(() => LichThiDauTable.maTD),
    maCT: integer().notNull().references(() => CauThuTable.maCT),
    maDoi: integer().notNull().references(() => DoiBongTable.maDoi),
    thoiDiem: real().notNull(),
    loaiBanThang: text().notNull(),
}, (table) => [
    primaryKey({ columns: [table.maTD, table.maCT, table.thoiDiem] }),
])

export const BanThangTableBackup = sqliteTable('BanThangBackup', {
    BTBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maTD: integer().notNull(),
    maCT: integer().notNull(),
    maDoi: integer().notNull(),
    thoiDiem: real().notNull(),
    loaiBanThang: text().notNull(),
})
export type InsertBanThangParams = typeof BanThangTable.$inferInsert;
export type InsertBanThangBackupParams = typeof BanThangTableBackup.$inferInsert;

const check : TypesAreEqual<InsertBanThangParams, BanThang> = true;

/*
export interface BanThang {
    maTD: string;
    maCT: string;
    thoiDiem: number;
    maDoi: string;
    loaiBanThang: string;
}
CREATE TABLE IF NOT EXISTS 'BanThang' (
    'maTD' TEXT NOT NULL UNIQUE,
    'maCT' TEXT NOT NULL,
    'thoiDiem' REAL NOT NULL,
    'maDoi' TEXT NOT NULL,
    'loaiBanThang' TEXT NOT NULL,
PRIMARY KEY('maTD', 'maCT', 'thoiDiem'),
FOREIGN KEY('maTD') REFERENCES 'LichThiDau'('maTD'),
FOREIGN KEY('maCT') REFERENCES 'CauThu'('maCT'),
FOREIGN KEY('maDoi') REFERENCES 'DoiBong'('maDoi')
);
*/