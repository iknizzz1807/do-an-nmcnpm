import type { TypesAreEqual } from '$lib/server/utils';
import type { LoaiBT } from '$lib/typesDatabase';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const LoaiBTTable = sqliteTable('LoaiBT', {
    maLBT: integer().unique().primaryKey({ autoIncrement: true }).notNull(),
    tenLBT: text().notNull()
}, (table) => [
])

export const LoaiBTTableBackup = sqliteTable('LoaiBTBackup', {
    SNBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maLBT: integer().notNull(),
    tenLBT: text().notNull()
})


export type InsertLoaiBTParams = typeof LoaiBTTable.$inferInsert;
export type InsertLoaiBTBackupParams = typeof LoaiBTTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertLoaiBTParams, LoaiBT> = true;