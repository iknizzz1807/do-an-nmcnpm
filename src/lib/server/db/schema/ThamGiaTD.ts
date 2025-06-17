import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { DoiBongTable } from './DoiBong';
import { CauThuTable } from './CauThu';
import { MuaGiaiTable } from './MuaGiai';
import type { TypesAreEqual } from '$lib/server/utils';
import { sql } from 'drizzle-orm';
import { db } from '../client';
import { LichThiDauTable } from './LichThiDau';
import type { ThamGiaTD } from '$lib/typesDatabase';
import { ViTriTable } from './Data/ViTri';

// Số lượng cầu thủ tối thiểu, tối đa của đội, số cầu thủ nước ngoài tối đa.
export const ThamGiaTDTable = sqliteTable('ThamGiaTD', {
    maTD: integer().notNull().references(() => LichThiDauTable.maTD, { onDelete: "cascade" }),
    maCT: integer().notNull().references(() => CauThuTable.maCT, { onDelete: "cascade" }),
    maDoi: integer().notNull().references(() => DoiBongTable.maDoi, { onDelete: "cascade" }),
    maVT: integer().references(() => ViTriTable.maVT, { onDelete: "set null" }),
}, (table) => [
    primaryKey({ columns: [table.maTD, table.maCT] }),
])

export const ThamGiaTDTableBackup = sqliteTable('ThamGiaTDBackup', {
    BackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: text().notNull(),
    maTD: integer().notNull(),
    maCT: integer().notNull(),
    maDoi: integer().notNull(),
    maVT: integer(),
})


export type InsertThamGiaTDParams = typeof ThamGiaTDTable.$inferInsert;
export type InsertThamGiaTDBackupParams = typeof ThamGiaTDTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertThamGiaTDParams, ThamGiaTD> = true;