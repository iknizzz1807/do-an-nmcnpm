import { integer, sqliteTable, text, check } from 'drizzle-orm/sqlite-core';
import { DoiBongTable } from './DoiBong';
import { DSMuaGiaiTable } from './DSMuaGiai';
import type { LichThiDau } from '$lib/typesDatabase';
import type { TypesAreEqual } from '$lib/server/utils';
import { db } from '../client';
import { sql } from 'drizzle-orm';

export const LichThiDauTable = sqliteTable('LichThiDau', {
    maTD: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    doiMot: integer().notNull().references(() => DoiBongTable.maDoi, { onDelete: "cascade" }),
    doiHai: integer().notNull().references(() => DoiBongTable.maDoi, { onDelete: "cascade" }),
    ngayGio: text()
        .notNull()
        .$defaultFn(() => new Date().toJSON()),
    vongThiDau: integer().notNull(),
    maMG: integer().notNull().references(() => DSMuaGiaiTable.maMG, { onDelete: "cascade" }),
    doiThang: integer().references(() => DoiBongTable.maDoi, { onDelete: "cascade" }),
}, (table) : any => [
    check("CHK_LTD_DOIMOT_DOIHAI", sql`${table.doiMot} != ${table.doiHai}`),
    check("CHK_LTD_VONGTHIDAU", sql`${table.vongThiDau} IN (1, 2)`)
]);

export const LichThiDauTableBackup = sqliteTable('LichThiDauBackup', {
    LTDBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maTD: integer().notNull(),
    doiMot: integer().notNull(),
    doiHai: integer().notNull(),
    ngayGio: text().notNull(),
    vongThiDau: integer().notNull(),
    maMG: integer().notNull(),
    doiThang: integer()
})

const createLTDBackupTrigger = async() => {
      // LichThiDau
    await db.transaction(async (tx) => {
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGD_LTD_BACKUP
        AFTER DELETE ON LichThiDau
        BEGIN
        INSERT INTO LichThiDauBackup(modifiedDate, maTD, doiMot, doiHai, ngayGio, vongThiDau, maMG, doiThang)
        VALUES(datetime('now'), OLD.maTD, OLD.doiMot, OLD.doiHai, OLD.ngayGio, OLD.vongThiDau, OLD.maMG, OLD.doiThang);
        END
        `);
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGU_LTD_BACKUP
        AFTER UPDATE ON LichThiDau
        BEGIN
        INSERT INTO LichThiDauBackup(modifiedDate, maTD, doiMot, doiHai, ngayGio, vongThiDau, maMG, doiThang)
        VALUES(datetime('now'), OLD.maTD, OLD.doiMot, OLD.doiHai, OLD.ngayGio, OLD.vongThiDau, OLD.maMG, OLD.doiThang);
        END
        `);
    });
}
createLTDBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future

export type InsertLichThiDauParams = typeof LichThiDauTable.$inferInsert;
export type InsertLichThiDauBackupParams = typeof LichThiDauTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertLichThiDauParams, LichThiDau> = true;
/*
export interface LichThiDau {
    maTD: string;
    doiMot: string;
    doiHai: string;
    ngayGio: Date;
    vongThiDau: number;
    maMG: number;
    doiThang: string;
}
CREATE TABLE IF NOT EXISTS 'LichThiDau' (
    'maTD' TEXT primary key NOT NULL UNIQUE,
    'doiMot' TEXT NOT NULL,
    'doiHai' TEXT NOT NULL,
    'ngayGio' REAL NOT NULL,
    'vongThiDau' INTEGER NOT NULL,
    'maMG' INTEGER NOT NULL,
    'doiThang' TEXT NOT NULL,
FOREIGN KEY('doiMot') REFERENCES 'DoiBong'('maDoi'),
FOREIGN KEY('doiHai') REFERENCES 'DoiBong'('maDoi'),
FOREIGN KEY('maMG') REFERENCES 'DSMuaGiai'('maMG'),
FOREIGN KEY('doiThang') REFERENCES 'DoiBong'('maDoi')
);
*/
