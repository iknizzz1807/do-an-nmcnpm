import type { TypesAreEqual } from '$lib/server/utils';
import type { CauThu } from '$lib/typesDatabase';
import { sql } from 'drizzle-orm';
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { db } from '../client';


// Thay đổi tuổi tối thiểu, tuổi tối đa của cầu thủ.
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
        CREATE TRIGGER IF NOT EXISTS TRGD_CT_BACKUP
        AFTER DELETE ON CauThu
        BEGIN
            INSERT INTO CauThuBackup(modifiedDate, maCT, tenCT, ngaySinh, loaiCT, ghiChu, nuocNgoai)
            VALUES(datetime('now'), OLD.maCT, OLD.tenCT, OLD.ngaySinh, OLD.loaiCT, OLD.ghiChu, OLD.nuocNgoai);
        END
        `);
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGU_CT_BACKUP
        AFTER UPDATE ON CauThu
        BEGIN
            INSERT INTO CauThuBackup(modifiedDate, maCT, tenCT, ngaySinh, loaiCT, ghiChu, nuocNgoai)
            VALUES(datetime('now'), OLD.maCT, OLD.tenCT, OLD.ngaySinh, OLD.loaiCT, OLD.ghiChu, OLD.nuocNgoai);
        END
        `);
        // // Check tuoi
        // tx.run(sql`
        // CREATE TRIGGER IF NOT EXISTS TRGI_CT_AGE
        // AFTER INSERT ON CauThu
        // WHEN NOT EXISTS(
        //     SELECT 1 FROM CauThu
        //     WHERE maCT=NEW.maCT AND date('now') - date(ngaySinh) BETWEEN 16 AND 40
        // )
        // BEGIN
        //     SELECT RAISE(ABORT, 'Cau thu co do tuoi tu 16 den 40');
        // END;
        // `);
        // tx.run(sql`
        // CREATE TRIGGER IF NOT EXISTS TRGU_CT_AGE
        // AFTER UPDATE ON CauThu
        // WHEN NOT EXISTS(
        //     SELECT 1 FROM CauThu
        //     WHERE maCT=NEW.maCT AND date('now') - date(ngaySinh) BETWEEN 16 AND 40
        // )
        // BEGIN
        //     SELECT RAISE(ABORT, 'Cau thu co do tuoi tu 16 den 40');
        // END;
        // `);
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