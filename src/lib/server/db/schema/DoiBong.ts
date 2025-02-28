import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { db } from '../client';
import type { DoiBong } from '$lib/types';
import type { TypesAreEqual } from '$lib/server/utils';

export const DoiBongTable = sqliteTable('DoiBong', {
    maDoi: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenDoi: text().notNull(),
    sanNha: text().notNull(),
})
export const DoiBongTableBackup = sqliteTable('DoiBongBackup', {
    DBBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maDoi: integer().notNull(),
    tenDoi: text().notNull(),
    sanNha: text().notNull(),
})

export type InsertDoiBongParams = typeof DoiBongTable.$inferInsert;
export type InsertDoiBongBackupParams = typeof DoiBongTableBackup.$inferInsert;

const check : TypesAreEqual<InsertDoiBongParams, DoiBong> = true;
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
