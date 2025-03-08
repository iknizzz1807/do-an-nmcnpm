import { integer, sqliteTable, text, primaryKey, real, check } from 'drizzle-orm/sqlite-core';
import { LichThiDauTable } from './LichThiDau';
import { CauThuTable } from './CauThu';
import { DoiBongTable } from './DoiBong';
import { type TypesAreEqual } from '$lib/server/utils';
import { type BanThang } from '$lib/types';
import { db } from '../client';
import { sql } from 'drizzle-orm';

export const BanThangTable = sqliteTable('BanThang', {
    maTD: integer().notNull().references(() => LichThiDauTable.maTD),
    maCT: integer().notNull().references(() => CauThuTable.maCT),
    maDoi: integer().notNull().references(() => DoiBongTable.maDoi),
    thoiDiem: real().notNull(),
    loaiBanThang: text().notNull(),
}, (table) => [
    primaryKey({ columns: [table.maTD, table.maCT, table.thoiDiem] }),
    check("CHK_BT_THOIDIEM", sql`${table.thoiDiem} BETWEEN 0 AND 90`),
    check("CHK_BT_LOAIBT", sql`${table.loaiBanThang} IN ('A', 'B', 'C')`)
])

export const BanThangTableBackup = sqliteTable('BanThangBackup', {
    BTBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maTD: integer().notNull(),
    maCT: integer().notNull(),
    maDoi: integer().notNull(),
    thoiDiem: real().notNull(),
    loaiBanThang: text().notNull(),
})

const createBTBackupTrigger = async() => {
    // BanThang
    await db.transaction(async (tx) => {
        // Trigger tạo backup
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGD_BT_BACKUP
        AFTER DELETE ON BanThang
        BEGIN
        INSERT INTO BanThangBackup(modifiedDate, maTD, maCT, maDoi, thoiDiem, loaiBanThang)
        VALUES(datetime('now'), OLD.maTD, OLD.maCT, OLD.maDoi, OLD.thoiDiem, OLD.loaiBanThang);
        END
        `);
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGU_BT_BACKUP
        AFTER UPDATE ON BanThang
        BEGIN
        INSERT INTO BanThangBackup(modifiedDate, maTD, maCT, maDoi, thoiDiem, loaiBanThang)
        VALUES(datetime('now'), OLD.maTD, OLD.maCT, OLD.maDoi, OLD.thoiDiem, OLD.loaiBanThang);
        END
        `);
        // Trigger check Cầu thủ ghi bàn có thuộc đội ghi bàn không
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGI_BT_CTDOI
        AFTER INSERT ON BanThang
        WHEN NOT EXISTS(SELECT 1 FROM ThamGiaDB AS TGDB 
                    WHERE NEW.maCT=TGDB.maCT AND NEW.maDoi=TGDB.maDoi)
        BEGIN
            SELECT RAISE(ABORT, 'Cau thu ghi ban thang phai thuoc doi do');
        END;
        `);
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGU_BT_CTDOI
        AFTER UPDATE ON BanThang
        WHEN NOT EXISTS(SELECT 1 FROM ThamGiaDB AS TGDB 
                    WHERE NEW.maCT=TGDB.maCT AND NEW.maDoi=TGDB.maDoi)
        BEGIN
            SELECT RAISE(ABORT, 'Cau thu ghi ban thang phai thuoc doi do');
        END;
        `);
        // Trigger cho đội ghi bàn thắng phải thuộc đội trong lịch thi đâu
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGI_BT_DOILTD
        AFTER INSERT ON BanThang
        WHEN NOT EXISTS(SELECT 1 FROM LichThiDau AS LTD
            WHERE LTD.maTD=NEW.maTD AND (LTD.doiMot=NEW.maDoi OR LTD.doiHai=NEW.maDoi))
        BEGIN
            SELECT RAISE(ABORT, 'Doi ghi ban phai thuoc mot trong hai doi cua lich thi dau');
        END;
        `);
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGU_BT_DOILTD
        AFTER UPDATE ON BanThang
        WHEN NOT EXISTS(SELECT 1 FROM LichThiDau AS LTD
            WHERE LTD.maTD=NEW.maTD AND (LTD.doiMot=NEW.maDoi OR LTD.doiHai=NEW.maDoi))
        BEGIN
            SELECT RAISE(ABORT, 'Doi ghi ban phai thuoc mot trong hai doi cua lich thi dau');
        END;
        `);
    });
}
createBTBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future

export type InsertBanThangParams = typeof BanThangTable.$inferInsert;
export type InsertBanThangBackupParams = typeof BanThangTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertBanThangParams, BanThang> = true;

/*
export interface BanThang {
    maTD: string;
    maCT: string;
    thoiDiem: number;
    maDoi: string;
    loaiBanThang: string;
}
CREATE TABLE IF NOT EXISTS 'BanThang' (
    'maTD' TEXT NOT NULL UNIQUE,
    'maCT' TEXT NOT NULL,
    'thoiDiem' REAL NOT NULL,
    'maDoi' TEXT NOT NULL,
    'loaiBanThang' TEXT NOT NULL,
PRIMARY KEY('maTD', 'maCT', 'thoiDiem'),
FOREIGN KEY('maTD') REFERENCES 'LichThiDau'('maTD'),
FOREIGN KEY('maCT') REFERENCES 'CauThu'('maCT'),
FOREIGN KEY('maDoi') REFERENCES 'DoiBong'('maDoi')
);
*/