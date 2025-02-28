import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { DoiBongTable } from './DoiBong';
import { CauThuTable } from './CauThu';
import { DSMuaGiaiTable } from './DSMuaGiai';
import type { ThamGiaDB } from '$lib/types';
import type { TypesAreEqual } from '$lib/server/utils';

export const ThamGiaDBTable = sqliteTable('ThamGiaDB', {
    maDoi: integer().notNull().references(() => DoiBongTable.maDoi),
    maCT: integer().notNull().references(() => CauThuTable.maCT),
    maMG: integer().notNull().references(() => DSMuaGiaiTable.maMG)
}, (table) => [
    primaryKey({ columns: [table.maDoi, table.maCT, table.maMG] }),
])

export const ThamGiaDBTableBackup = sqliteTable('ThamGiaDBBackup', {
    TGBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maDoi: integer().notNull(),
    maCT: integer().notNull(),
    maMG: integer().notNull()
})

export type InsertThamGiaDBParams = typeof ThamGiaDBTable.$inferInsert;
export type InsertThamGiaDBBackupParams = typeof ThamGiaDBTableBackup.$inferInsert;

const check : TypesAreEqual<InsertThamGiaDBParams, ThamGiaDB> = true;
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