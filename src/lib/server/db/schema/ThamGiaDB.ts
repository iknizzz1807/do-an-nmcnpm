import { integer, sqliteTable, text, primaryKey, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { DoiBongTable } from './DoiBong';
import { CauThuTable } from './CauThu';
import { DSMuaGiaiTable } from './DSMuaGiai';
import type { ThamGiaDB } from '$lib/typesDatabase';
import type { TypesAreEqual } from '$lib/server/utils';
import { sql } from 'drizzle-orm';
import { db } from '../client';

// Số lượng cầu thủ tối thiểu, tối đa của đội, số cầu thủ nước ngoài tối đa.
export const ThamGiaDBTable = sqliteTable('ThamGiaDB', {
    maDoi: integer().notNull().references(() => DoiBongTable.maDoi, { onDelete: "cascade" }),
    maCT: integer().notNull().references(() => CauThuTable.maCT, { onDelete: "cascade" }),
    maMG: integer().notNull().references(() => DSMuaGiaiTable.maMG, { onDelete: "cascade" })
}, (table) => [
    primaryKey({ columns: [table.maCT, table.maMG] }),
    index("ThamGiaDB_maCT_maMG").on(table.maCT, table.maMG)
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

const checkType : TypesAreEqual<InsertThamGiaDBParams, ThamGiaDB> = true;
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