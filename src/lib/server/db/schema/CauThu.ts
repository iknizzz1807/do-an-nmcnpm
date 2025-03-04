import type { TypesAreEqual } from '$lib/server/utils';
import type { CauThu } from '$lib/types';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { db } from '../client';

export const CauThuTable = sqliteTable('CauThu', {
    maCT: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    tenCT: text().notNull(),
    ngaySinh: text().notNull(),
    loaiCT: integer().notNull(),
    ghiChu: text().notNull(),
    nuocNgoai: integer({ mode: "boolean" }).notNull()
})

export const CauThuTableBackup = sqliteTable('CauThuBackup', {
    CTBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maCT: integer().notNull(),
    tenCT: text().notNull(),
    ngaySinh: text().notNull(),
    loaiCT: integer().notNull(),
    ghiChu: text().notNull(),
    nuocNgoai: integer().notNull()
})

const createCTBackupTrigger = async() => {
    // CauThu
    await db.transaction(async (tx) => {
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRG_CT_INSERT_BACKUP
        AFTER INSERT ON CauThu
        BEGIN
            INSERT INTO CauThuBackup(modifiedDate, maCT, tenCT, ngaySinh, loaiCT, ghiChu, nuocNgoai)
            VALUES(datetime('now'), NEW.maCT, NEW.tenCT, NEW.ngaySinh, NEW.loaiCT, NEW.ghiChu, NEW.nuocNgoai);
        END
        `);
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRG_CT_UPDATE_BACKUP
        AFTER UPDATE ON CauThu
        BEGIN
            INSERT INTO CauThuBackup(modifiedDate, maCT, tenCT, ngaySinh, loaiCT, ghiChu, nuocNgoai)
            VALUES(datetime('now'), OLD.maCT, OLD.tenCT, OLD.ngaySinh, OLD.loaiCT, OLD.ghiChu, OLD.nuocNgoai);
        END
        `);
    });
}
createCTBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future

export type InsertCauThuParams = typeof CauThuTable.$inferInsert;
export type InsertCauThuBackupParams = typeof CauThuTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertCauThuParams, CauThu> = true;
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