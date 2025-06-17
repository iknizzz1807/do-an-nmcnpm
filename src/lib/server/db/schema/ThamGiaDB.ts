import { integer, sqliteTable, text, primaryKey, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { DoiBongTable } from './DoiBong';
import { CauThuTable } from './CauThu';
import { MuaGiaiTable } from './MuaGiai';
import type { ThamGiaDB } from '$lib/typesDatabase';
import type { TypesAreEqual } from '$lib/server/utils';
import { sql } from 'drizzle-orm';
import { db } from '../client';

// Số lượng cầu thủ tối thiểu, tối đa của đội, số cầu thủ nước ngoài tối đa.
export const ThamGiaDBTable = sqliteTable('ThamGiaDB', {
    maDoi: integer().notNull().references(() => DoiBongTable.maDoi, { onDelete: "cascade" }),
    maCT: integer().notNull().references(() => CauThuTable.maCT, { onDelete: "cascade" }),
    maMG: integer().notNull().references(() => MuaGiaiTable.maMG, { onDelete: "cascade" })
}, (table) => [
    primaryKey({ columns: [table.maCT, table.maMG] }),
    index("ThamGiaDB_maCT_maMG").on(table.maCT, table.maMG)
])

export const ThamGiaDBTableBackup = sqliteTable('ThamGiaDBBackup', {
    BackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: text().notNull(),
    maDoi: integer().notNull(),
    maCT: integer().notNull(),
    maMG: integer().notNull()
})


export type InsertThamGiaDBParams = typeof ThamGiaDBTable.$inferInsert;
export type InsertThamGiaDBBackupParams = typeof ThamGiaDBTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertThamGiaDBParams, ThamGiaDB> = true;