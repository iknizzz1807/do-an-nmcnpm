import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { DoiBongTable } from './DoiBong';
import { CauThuTable } from './CauThu';
import { DSMuaGiaiTable } from './DSMuaGiai';
import type { TypesAreEqual } from '$lib/server/utils';
import { sql } from 'drizzle-orm';
import { db } from '../client';
import { LichThiDauTable } from './LichThiDau';
import type { ThamGiaTD } from '$lib/typesDatabase';

// Số lượng cầu thủ tối thiểu, tối đa của đội, số cầu thủ nước ngoài tối đa.
export const ThamGiaTDTable = sqliteTable('ThamGiaTD', {
    maTD: integer().notNull().references(() => LichThiDauTable.maTD, { onDelete: "cascade" }),
    maCT: integer().notNull().references(() => CauThuTable.maCT, { onDelete: "cascade" }),
    maDoi: integer().notNull().references(() => DoiBongTable.maDoi, { onDelete: "cascade" }),
    viTri: text().notNull(),
}, (table) => [
    primaryKey({ columns: [table.maTD, table.maCT] }),
])

export const ThamGiaTDTableBackup = sqliteTable('ThamGiaTDBackup', {
    TGBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
    modifiedDate: integer({mode: "timestamp"}).notNull(),
    maTD: integer().notNull(),
    maCT: integer().notNull(),
    maDoi: integer().notNull(),
    viTri: text().notNull(),
})

const createTGTDBackupTrigger = async() => {
    // ThamGiaTD
    await db.transaction(async (tx) => {
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGD_TGTD_BACKUP
        AFTER DELETE ON ThamGiaTD
        BEGIN
        INSERT INTO ThamGiaTDBackup(modifiedDate, maTD, maCT, maDoi, viTri)
        VALUES(datetime('now'), OLD.maTD, OLD.maCT, OLD.maDoi, OLD.viTri);
        END
        `);
        tx.run(sql`
        CREATE TRIGGER IF NOT EXISTS TRGU_TGTD_BACKUP
        AFTER UPDATE ON ThamGiaTD
        BEGIN
        INSERT INTO ThamGiaTDBackup(modifiedDate, maTD, maCT, maDoi, viTri)
        VALUES(datetime('now'), OLD.maTD, OLD.maCT, OLD.maDoi, OLD.viTri);
        END
        `);
    });
}
createTGTDBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future

export type InsertThamGiaTDParams = typeof ThamGiaTDTable.$inferInsert;
export type InsertThamGiaTDBackupParams = typeof ThamGiaTDTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertThamGiaTDParams, ThamGiaTD> = true;