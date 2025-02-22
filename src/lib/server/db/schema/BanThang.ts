import { integer, sqliteTable, text, primaryKey, real } from 'drizzle-orm/sqlite-core';
import { LichThiDau } from './LichThiDau';
import { CauThu } from './CauThu';
import { DoiBong } from './DoiBong';


export const BanThang = sqliteTable('BanThang', {
    maTD: text().notNull().references(() => LichThiDau.maTD),
    maCT: text().notNull().references(() => CauThu.maCT),
    thoiDiem: real().notNull(),
    maDoi: text().notNull().references(() => DoiBong.maDoi),
    loaiBanThang: text().notNull(),
}, (table) => [
    primaryKey({ columns: [table.maTD, table.maCT, table.thoiDiem] }),
])

export type InsertBanThangParams = typeof BanThang.$inferInsert;
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