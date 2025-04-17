import { integer, sqliteTable, text, check, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { DoiBongTable } from './DoiBong';
import { MuaGiaiTable } from './MuaGiai';
import type { LichThiDau } from '$lib/typesDatabase';
import type { TypesAreEqual } from '$lib/server/utils';
import { db } from '../client';
import { sql } from 'drizzle-orm';
import { SanNhaTable } from './Data/SanNha';

export const LichThiDauTable = sqliteTable('LichThiDau', {
    maTD: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    doiMot: integer().notNull().references(() => DoiBongTable.maDoi, { onDelete: "cascade" }),
    doiHai: integer().notNull().references(() => DoiBongTable.maDoi, { onDelete: "cascade" }),
    ngayGio: text()
        .notNull()
        .$defaultFn(() => new Date().toJSON()),
    maVTD: integer().notNull(),
    maMG: integer().notNull().references(() => MuaGiaiTable.maMG, { onDelete: "cascade" }),
    maSan: integer().notNull().references(() => SanNhaTable.maSan, { onDelete: "cascade" }),
    doiThang: integer().references(() => DoiBongTable.maDoi, { onDelete: "cascade" }),
}, (table) : any => [
    check("CHK_LTD_DOIMOT_DOIHAI", sql`${table.doiMot} != ${table.doiHai}`),
    uniqueIndex("LichThiDau_maTD").on(table.maTD)
]);

export const LichThiDauTableBackup = sqliteTable('LichThiDauBackup', {
    LTDBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maTD: integer().notNull(),
    doiMot: integer().notNull(),
    doiHai: integer().notNull(),
    ngayGio: text().notNull(),
    maVTD: integer().notNull(),
    maMG: integer().notNull(),
    maSan: integer().notNull(),
    doiThang: integer()
})


export type InsertLichThiDauParams = typeof LichThiDauTable.$inferInsert;
export type InsertLichThiDauBackupParams = typeof LichThiDauTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertLichThiDauParams, LichThiDau> = true;
