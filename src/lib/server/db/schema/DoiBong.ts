import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { db } from '../client';
import type { DoiBong } from '$lib/typesDatabase';
import type { TypesAreEqual } from '$lib/server/utils';
import { sql } from 'drizzle-orm';
import { SanNhaTable } from './Data/SanNha';
import { MuaGiaiTable } from './MuaGiai';

export const DoiBongTable = sqliteTable('DoiBong', {
    maDoi: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenDoi: text().notNull(),
    maSan: integer().notNull().references(() => SanNhaTable.maSan, { onDelete: "cascade" }),
    maMG: integer().notNull().references(() => MuaGiaiTable.maMG, { onDelete: "cascade" }),
    imageURL: text(),
    deleted: integer({mode: "boolean"}).default(false),
}, (table) => [
    uniqueIndex("DoiBong_maDoi").on(table.maDoi)
])

export const DoiBongTableBackup = sqliteTable('DoiBongBackup', {
    BackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maDoi: integer().notNull(),
    tenDoi: text().notNull(),
    maSan: integer().notNull(),
    maMG: integer().notNull(),
    imageURL: text(),
})


export type InsertDoiBongParams = typeof DoiBongTable.$inferInsert;
export type InsertDoiBongBackupParams = typeof DoiBongTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertDoiBongParams, DoiBong> = true;
/*
export interface DoiBong {
    maDoi: string;
    tenDoi: string;
    sanNha: string;
}
CREATE TABLE IF NOT EXISTS 'DoiBong' (
    'maDoi' TEXT primary key NOT NULL UNIQUE,
    'tenDoi' TEXT NOT NULL,
    'sanNha' TEXT NOT NULL
);
*/
