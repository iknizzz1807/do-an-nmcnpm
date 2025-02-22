import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { DoiBong } from './DoiBong';
import { DSMuaGiai } from './DSMuaGiai';

export const LichThiDau = sqliteTable('LichThiDau', {
    maTD: text().notNull().unique().primaryKey(),
    doiMot: text().notNull().references(() => DoiBong.maDoi),
    doiHai: text().notNull().references(() => DoiBong.maDoi),
    ngayGio: integer('', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date()),
    vongThiDau: integer().notNull(),
    maMG: integer().notNull().references(() => DSMuaGiai.maMG),
    doiThang: text().notNull().references(() => DoiBong.maDoi),
})

export type InsertLichThiDauParams = typeof LichThiDau.$inferInsert;
/*
export interface LichThiDau {
    maTD: string;
    doiMot: string;
    doiHai: string;
    ngayGio: Date;
    vongThiDau: number;
    maMG: number;
    doiThang: string;
}
CREATE TABLE IF NOT EXISTS 'LichThiDau' (
    'maTD' TEXT primary key NOT NULL UNIQUE,
    'doiMot' TEXT NOT NULL,
    'doiHai' TEXT NOT NULL,
    'ngayGio' REAL NOT NULL,
    'vongThiDau' INTEGER NOT NULL,
    'maMG' INTEGER NOT NULL,
    'doiThang' TEXT NOT NULL,
FOREIGN KEY('doiMot') REFERENCES 'DoiBong'('maDoi'),
FOREIGN KEY('doiHai') REFERENCES 'DoiBong'('maDoi'),
FOREIGN KEY('maMG') REFERENCES 'DSMuaGiai'('maMG'),
FOREIGN KEY('doiThang') REFERENCES 'DoiBong'('maDoi')
);
*/