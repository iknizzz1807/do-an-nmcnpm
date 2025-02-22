import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { DoiBong } from './DoiBong';
import { CauThu } from './CauThu';
import { DSMuaGiai } from './DSMuaGiai';


export const ThamGiaDB = sqliteTable('ThamGiaDB', {
    maDoi: text().notNull().references(() => DoiBong.maDoi),
    maCT: text().notNull().references(() => CauThu.maCT),
    maMG: integer().notNull().references(() => DSMuaGiai.maMG)
}, (table) => [
    primaryKey({ columns: [table.maDoi, table.maCT, table.maMG] }),
])

export type InsertThamGiaDBParams = typeof ThamGiaDB.$inferInsert;
/*
export interface ThamGiaDB {
    maDoi: string;
    maCT: string;
    maMG: number;
}
CREATE TABLE IF NOT EXISTS 'ThamGiaDB' (
    'maDoi' TEXT NOT NULL,
    'maCT' TEXT NOT NULL,
    'maMG' INTEGER NOT NULL,
PRIMARY KEY('maDoi', 'maCT', 'maMG'),
FOREIGN KEY('maDoi') REFERENCES 'DoiBong'('maDoi'),
FOREIGN KEY('maCT') REFERENCES 'CauThu'('maCT'),
FOREIGN KEY('maMG') REFERENCES 'DSMuaGiai'('maMG')
);
*/