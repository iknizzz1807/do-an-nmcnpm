import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { DoiBongTable } from './DoiBong';
import { DSMuaGiaiTable } from './DSMuaGiai';
import type { LichThiDau } from '$lib/types';
import type { TypesAreEqual } from '$lib/server/utils';

export const LichThiDauTable = sqliteTable('LichThiDau', {
    maTD: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    doiMot: integer().notNull().references(() => DoiBongTable.maDoi),
    doiHai: integer().notNull().references(() => DoiBongTable.maDoi),
    ngayGio: text()
        .notNull()
        .$defaultFn(() => new Date().toJSON()),
    vongThiDau: integer().notNull(),
    maMG: integer().notNull().references(() => DSMuaGiaiTable.maMG),
    doiThang: integer().references(() => DoiBongTable.maDoi),
})

export type InsertLichThiDauParams = typeof LichThiDauTable.$inferInsert;

const check : TypesAreEqual<InsertLichThiDauParams, LichThiDau> = true;
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
