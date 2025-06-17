import { integer, sqliteTable, text, check, uniqueIndex, real } from 'drizzle-orm/sqlite-core';
import { DoiBongTable } from './DoiBong';
import { MuaGiaiTable } from './MuaGiai';
import type { LichThiDau } from '$lib/typesDatabase';
import type { TypesAreEqual } from '$lib/server/utils';
import { db } from '../client';
import { sql } from 'drizzle-orm';
import { SanNhaTable } from './Data/SanNha';
import { VongTDTable } from './Data/VongTD';
import { TrongTaiTable } from './TrongTai';
import type { LichThiDauBackup } from '$lib/typesBackup';

export const LichThiDauTable = sqliteTable('LichThiDau', {
    maTD: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    maMG: integer().notNull().references(() => MuaGiaiTable.maMG, { onDelete: "cascade" }),
    maVTD: integer().references(() => VongTDTable.maVTD, { onDelete: "set null" }),
    maSan: integer().references(() => SanNhaTable.maSan, { onDelete: "set null" }),

    doiMot: integer().notNull().references(() => DoiBongTable.maDoi, { onDelete: "cascade" }),
    doiHai: integer().notNull().references(() => DoiBongTable.maDoi, { onDelete: "cascade" }),
    doiThang: integer().references(() => DoiBongTable.maDoi, { onDelete: "cascade" }),
    
    ngayGioDuKien: text().$defaultFn(() => new Date().toJSON()).notNull(),
    ngayGioThucTe: text().$defaultFn(() => new Date().toJSON()).notNull(),

    thoiGianDaThiDau: real().notNull(),
    maTT: integer().references(() => TrongTaiTable.maTT, { onDelete: "set null" }),

    deleted: integer({mode: "boolean"}).default(false),
}, (table) : any => [
    check("CHK_LTD_DOIMOT_DOIHAI", sql`${table.doiMot} != ${table.doiHai}`),
    uniqueIndex("LichThiDau_maTD").on(table.maTD)
]);

export const LichThiDauTableBackup = sqliteTable('LichThiDauBackup', {
    BackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: text().notNull(),
    maTD: integer().notNull(),
    maMG: integer().notNull(),
    maVTD: integer(),
    maSan: integer(),

    doiMot: integer().notNull(),
    doiHai: integer().notNull(),
    doiThang: integer(),
   
    ngayGioDuKien: text(),
    ngayGioThucTe: text(),

    thoiGianDaThiDau: real().notNull(),

    maTT: integer(),
})


export type InsertLichThiDauParams = typeof LichThiDauTable.$inferInsert;
export type InsertLichThiDauBackupParams = typeof LichThiDauTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertLichThiDauParams, LichThiDau> = true;
const checkTypeBackUp : TypesAreEqual<InsertLichThiDauBackupParams, LichThiDauBackup> = true;
