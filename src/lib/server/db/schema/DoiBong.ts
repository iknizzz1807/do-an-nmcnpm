import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';


export const DoiBong = sqliteTable('DoiBong', {
    maDoi: text().notNull().unique().primaryKey(),
    tenDoi: text().notNull(),
    sanNha: text().notNull(),
})

export type InsertDoiBongParams = typeof DoiBong.$inferInsert;

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