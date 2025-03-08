import { integer, sqliteTable, text, primaryKey, real, check } from 'drizzle-orm/sqlite-core';
import { LichThiDauTable } from './LichThiDau';
import { CauThuTable } from './CauThu';
import { DoiBongTable } from './DoiBong';
import { type TypesAreEqual } from '$lib/server/utils';
import { type ThePhat } from '$lib/types';
import { db } from '../client';
import { sql } from 'drizzle-orm';

export const ThePhatTable = sqliteTable('ThePhat', {
    maTD: integer().notNull().references(() => LichThiDauTable.maTD),
    maCT: integer().notNull().references(() => CauThuTable.maCT),
    maDoi: integer().notNull().references(() => DoiBongTable.maDoi),
    thoiDiem: real().notNull(),
    loaiThe: text().notNull(),
}, (table) => [
    primaryKey({ columns: [table.maTD, table.maCT, table.thoiDiem] }),
    check("CHK_TP_THOIDIEM", sql`${table.thoiDiem} BETWEEN 0 AND 90`)
])

export const ThePhatTableBackup = sqliteTable('ThePhatBackup', {
  TPBackupID: integer().notNull().unique().primaryKey({ autoIncrement: true }),
  modifiedDate: integer({mode: "timestamp"}).notNull(),
  maTD: integer().notNull(),
  maCT: integer().notNull(),
  maDoi: integer().notNull(),
  thoiDiem: real().notNull(),
  loaiThe: text().notNull(),
})

const createTPBackupTrigger = async() => {
  // ThePhat
  await db.transaction(async (tx) => {
      // Trigger tạo backup
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGD_TP_BACKUP
      AFTER DELETE ON ThePhat
      BEGIN
      INSERT INTO ThePhatBackup(modifiedDate, maTD, maCT, maDoi, thoiDiem, loaiThe)
      VALUES(datetime('now'), OLD.maTD, OLD.maCT, OLD.maDoi, OLD.thoiDiem, OLD.loaiThe);
      END
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_TP_BACKUP
      AFTER UPDATE ON ThePhat
      BEGIN
      INSERT INTO ThePhatBackup(modifiedDate, maTD, maCT, maDoi, thoiDiem, loaiThe)
      VALUES(datetime('now'), OLD.maTD, OLD.maCT, OLD.maDoi, OLD.thoiDiem, OLD.loaiThe);
      END
      `);
      // Trigger check Cầu thủ bị phạt có thuộc đội bị phạt không
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGI_TP_CTDOI
      AFTER INSERT ON ThePhat
      WHEN NOT EXISTS(SELECT 1 FROM ThamGiaDB AS TGDB 
                  WHERE NEW.maCT=TGDB.maCT AND NEW.maDoi=TGDB.maDoi)
      BEGIN
          SELECT RAISE(ABORT, 'Cau thu ghi bi phat phai thuoc doi do');
      END;
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_TP_CTDOI
      AFTER UPDATE ON ThePhat
      WHEN NOT EXISTS(SELECT 1 FROM ThamGiaDB AS TGDB 
                  WHERE NEW.maCT=TGDB.maCT AND NEW.maDoi=TGDB.maDoi)
      BEGIN
          SELECT RAISE(ABORT, 'Cau thu ghi bi phat phai thuoc doi do');
      END;
      `);
      // Trigger cho đội bị phạt phải thuộc đội trong lịch thi đâu
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGI_TP_DOILTD
      AFTER INSERT ON ThePhat
      WHEN NOT EXISTS(SELECT 1 FROM LichThiDau AS LTD
          WHERE LTD.maTD=NEW.maTD AND (LTD.doiMot=NEW.maDoi OR LTD.doiHai=NEW.maDoi))
      BEGIN
          SELECT RAISE(ABORT, 'Doi bi phat phai thuoc mot trong hai doi cua lich thi dau');
      END;
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_TP_DOILTD
      AFTER UPDATE ON ThePhat
      WHEN NOT EXISTS(SELECT 1 FROM LichThiDau AS LTD
          WHERE LTD.maTD=NEW.maTD AND (LTD.doiMot=NEW.maDoi OR LTD.doiHai=NEW.maDoi))
      BEGIN
          SELECT RAISE(ABORT, 'Doi bi phat phai thuoc mot trong hai doi cua lich thi dau');
      END;
      `);
  });
}
createTPBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future


export type InsertThePhatParams = typeof ThePhatTable.$inferInsert;
export type InsertThePhatBackupParams = typeof ThePhatTableBackup.$inferInsert;

const checkType : TypesAreEqual<InsertThePhatParams, ThePhat> = true;