import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const CauThu = sqliteTable('CauThu', {
    maCT: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenCT: text().notNull(),
    ngaySinh: integer('', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date()),
    loaiCT: integer().notNull(),
    ghiChu: text().notNull(),
    nuocNgoai: integer().notNull()
})

export type InsertCauThuParams = typeof CauThu.$inferInsert;

/*
export interface CauThu {
    maCT: string;
    tenCT: string;
    ngaySinh: Date;
    loaiCT: number;
    ghiChu: string;
}
CREATE TABLE IF NOT EXISTS 'CauThu' (
'maCT' TEXT primary key NOT NULL UNIQUE,
'tenCT' TEXT NOT NULL,
'ngaySinh' TEXT NOT NULL,
'loaiCT' INTEGER NOT NULL,
'ghiChu' TEXT NOT NULL
);
*/