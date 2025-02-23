import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const DSMuaGiai = sqliteTable('DSMuaGiai', {
    maMG: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenMG: text().notNull(),
})

export type InsertDSMuaGiaiParams = typeof DSMuaGiai.$inferInsert;

/*
export interface DSMuaGiai {
    maMG: number;
    tenMG: string;
}

CREATE TABLE IF NOT EXISTS 'DSMuaGiai' (
'maMG' INTEGER primary key NOT NULL UNIQUE,
'tenMG' TEXT NOT NULL
);
*/