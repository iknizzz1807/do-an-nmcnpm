import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { DoiBongTable } from './DoiBong';
import { CauThuTable } from './CauThu';
import { DSMuaGiaiTable } from './DSMuaGiai';
import type { ThamGiaDB } from '$lib/types';
import type { TypesAreEqual } from '$lib/server/utils';
import { sql } from 'drizzle-orm';
import { db } from '../client';

export const ThamGiaDBTable = sqliteTable('ThamGiaDB', {
    maDoi: integer().notNull().references(() => DoiBongTable.maDoi),
    maCT: integer().notNull().references(() => CauThuTable.maCT),
    maMG: integer().notNull().references(() => DSMuaGiaiTable.maMG)
}, (table) => [
    primaryKey({ columns: [table.maCT, table.maMG] }),
])

export const ThamGiaDBTableBackup = sqliteTable('ThamGiaDBBackup', {
    TGBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maDoi: integer().notNull(),
    maCT: integer().notNull(),
    maMG: integer().notNull()
})

const createTGDBBackupTrigger = async() => {
    // ThamGiaDB
    await db.transaction(async (tx) => {
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRG_TGDB_INSERT_BACKUP
        AFTER INSERT ON ThamGiaDB
        BEGIN
        INSERT INTO ThamGiaDBBackup(modifiedDate, maDoi, maCT, maMG)
        VALUES(datetime('now'), NEW.maDoi, NEW.maCT, NEW.maMG);
        END
        `);
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRG_TGDB_UPDATE_BACKUP
        AFTER UPDATE ON ThamGiaDB
        BEGIN
        INSERT INTO ThamGiaDBBackup(modifiedDate, maDoi, maCT, maMG)
        VALUES(datetime('now'), OLD.maDoi, OLD.maCT, OLD.maMG);
        END
        `);
        // Trigger giới hạn cầu thủ tối đa và cầu thủ nước ngoài tối đa
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGI_TGDB_CT 
        AFTER INSERT ON ThamGiaDB 
        WHEN (
            SELECT COUNT(*) FROM ThamGiaDB
            WHERE maDoi = NEW.maDoi AND maMG = NEW.maMG
        ) > 22 OR (
            SELECT COUNT(*) FROM ThamGiaDB AS TGDB 
            INNER JOIN CauThu AS CT ON CT.maCT = TGDB.maCT 
            WHERE TGDB.maDoi = NEW.maDoi AND TGDB.maMG = NEW.maMG AND CT.nuocNgoai = 1
        ) > 3
        BEGIN 
            SELECT RAISE(ABORT, 'Doi bong chi duoc co toi da 22 cau thu va toi da 3 cau thu nuoc ngoai'); 
        END;
        `);
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGU_TGDB_CT 
        AFTER UPDATE ON ThamGiaDB 
        WHEN (
            SELECT COUNT(*) FROM ThamGiaDB
            WHERE maDoi = NEW.maDoi AND maMG = NEW.maMG
        ) > 22 OR (
            SELECT COUNT(*) FROM ThamGiaDB AS TGDB 
            INNER JOIN CauThu AS CT ON CT.maCT = TGDB.maCT 
            WHERE TGDB.maDoi = NEW.maDoi AND TGDB.maMG = NEW.maMG AND CT.nuocNgoai = 1
        ) > 3
        BEGIN 
            SELECT RAISE(ABORT, 'Doi bong chi duoc co toi da 22 cau thu va toi da 3 cau thu nuoc ngoai'); 
        END;
        `);
    });
}
createTGDBBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future

export type InsertThamGiaDBParams = typeof ThamGiaDBTable.$inferInsert;
export type InsertThamGiaDBBackupParams = typeof ThamGiaDBTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertThamGiaDBParams, ThamGiaDB> = true;
/*
export interface ThamGiaDB {
    maDoi: string;
    maCT: string;
    maMG: number;
}
CREATE TABLE IF NOT EXISTS 'ThamGiaDB' (
    'maDoi' TEXT NOT NULL,
    'maCT' TEXT NOT NULL,
    'maMG' INTEGER NOT NULL,
PRIMARY KEY('maDoi', 'maCT', 'maMG'),
FOREIGN KEY('maDoi') REFERENCES 'DoiBong'('maDoi'),
FOREIGN KEY('maCT') REFERENCES 'CauThu'('maCT'),
FOREIGN KEY('maMG') REFERENCES 'DSMuaGiai'('maMG')
);
*/