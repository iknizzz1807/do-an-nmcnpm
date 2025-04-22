import { integer, sqliteTable, text, primaryKey, real, check, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { LichThiDauTable } from './LichThiDau';
import { CauThuTable } from './CauThu';
import { DoiBongTable } from './DoiBong';
import { type TypesAreEqual } from '$lib/server/utils';
import { type BanThang } from '$lib/typesDatabase';
import { db } from '../client';
import { sql } from 'drizzle-orm';
import { LoaiBTTable } from './Data/LoaiBT';

export const BanThangTable = sqliteTable('BanThang', {
    maTD: integer().notNull().references(() => LichThiDauTable.maTD, { onDelete: "cascade" }),
    thoiDiem: real().notNull(),

    maCT: integer().notNull().references(() => CauThuTable.maCT, { onDelete: "cascade" }),
    maLBT: integer().notNull().references(() => LoaiBTTable.maLBT, { onDelete: "cascade" }),

    deleted: integer({mode: "boolean"}).default(false),
}, (table) => [
    primaryKey({ columns: [table.maTD, table.maCT, table.thoiDiem] }),
    check("CHK_BT_THOIDIEM", sql`${table.thoiDiem} BETWEEN 0 AND 90`),
])

export const BanThangTableBackup = sqliteTable('BanThangBackup', {
    BTBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maTD: integer().notNull(),
    thoiDiem: real().notNull(),
    
    maCT: integer().notNull(),
    maLBT: integer().notNull(),
})


export type InsertBanThangParams = typeof BanThangTable.$inferInsert;
export type InsertBanThangBackupParams = typeof BanThangTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertBanThangParams, BanThang> = true;

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