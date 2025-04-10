import { sql } from "drizzle-orm";
import { db } from "./client";

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


const createDBBackupTrigger = async() => {
  // DoiBong
  await db.transaction(async (tx) => {
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGD_DB_BACKUP
      AFTER DELETE ON DoiBong
      BEGIN
          INSERT INTO DoiBongBackup(modifiedDate, maDoi, tenDoi, maSan)
          VALUES(datetime('now'), OLD.maDoi, OLD.tenDoi, OLD.maSan);
      END
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_DB_BACKUP
      AFTER UPDATE ON DoiBong
      BEGIN
          INSERT INTO DoiBongBackup(modifiedDate, maDoi, tenDoi, maSan)
          VALUES(datetime('now'), OLD.maDoi, OLD.tenDoi, OLD.maSan);
      END
      `);
  });
}
createDBBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future


const createDSMGBackupTrigger = async() => {
  // DSMuaGiai
  await db.transaction(async (tx) => {
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGD_DSMG_BACKUP
      AFTER DELETE ON DSMuaGiai
      BEGIN
          INSERT INTO DSMuaGiaiBackup(modifiedDate, maMG, tenMG, ngayDienRa)
          VALUES(datetime('now'), OLD.maMG, OLD.tenMG, OLD.ngayDienRa);
      END
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_DSMG_BACKUP
      AFTER UPDATE ON DSMuaGiai
      BEGIN
          INSERT INTO DSMuaGiaiBackup(modifiedDate, maMG, tenMG, ngayDienRa)
          VALUES(datetime('now'), OLD.maMG, OLD.tenMG, OLD.ngayDienRa);
      END
      `);
  });
}
createDSMGBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future


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


const createSNBackupTrigger = async() => {
  // SanNha
  await db.transaction(async (tx) => {
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGD_SN_BACKUP
      AFTER DELETE ON SanNha
      BEGIN
          INSERT INTO SanNhaBackup(modifiedDate, maSan, tenSan, diaChi)
          VALUES(datetime('now'), OLD.maSan, OLD.tenSan, OLD.diaChi);
      END
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_SN_BACKUP
      AFTER UPDATE ON SanNha
      BEGIN
          INSERT INTO SanNhaBackup(modifiedDate, maSan, tenSan, diaChi)
          VALUES(datetime('now'), OLD.maSan, OLD.tenSan, OLD.diaChi);
      END
      `);
  });
}
createSNBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future


const createTGDBBackupTrigger = async() => {
  // ThamGiaDB
  await db.transaction(async (tx) => {
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGD_TGDB_BACKUP
      AFTER DELETE ON ThamGiaDB
      BEGIN
      INSERT INTO ThamGiaDBBackup(modifiedDate, maDoi, maCT, maMG)
      VALUES(datetime('now'), OLD.maDoi, OLD.maCT, OLD.maMG);
      END
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_TGDB_BACKUP
      AFTER UPDATE ON ThamGiaDB
      BEGIN
      INSERT INTO ThamGiaDBBackup(modifiedDate, maDoi, maCT, maMG)
      VALUES(datetime('now'), OLD.maDoi, OLD.maCT, OLD.maMG);
      END
      `);
      // // Trigger giới hạn cầu thủ tối đa và cầu thủ nước ngoài tối đa
      // tx.run(sql`
      // CREATE TRIGGER IF NOT EXISTS TRGI_TGDB_CT 
      // AFTER INSERT ON ThamGiaDB 
      // WHEN (
      //     SELECT COUNT(*) FROM ThamGiaDB
      //     WHERE maDoi = NEW.maDoi AND maMG = NEW.maMG
      // ) > 22 OR (
      //     SELECT COUNT(*) FROM ThamGiaDB AS TGDB 
      //     INNER JOIN CauThu AS CT ON CT.maCT = TGDB.maCT 
      //     WHERE TGDB.maDoi = NEW.maDoi AND TGDB.maMG = NEW.maMG AND CT.nuocNgoai = 1
      // ) > 3
      // BEGIN 
      //     SELECT RAISE(ABORT, 'Doi bong chi duoc co toi da 22 cau thu va toi da 3 cau thu nuoc ngoai'); 
      // END;
      // `);
      // tx.run(sql`
      // CREATE TRIGGER IF NOT EXISTS TRGU_TGDB_CT 
      // AFTER UPDATE ON ThamGiaDB 
      // WHEN (
      //     SELECT COUNT(*) FROM ThamGiaDB
      //     WHERE maDoi = NEW.maDoi AND maMG = NEW.maMG
      // ) > 22 OR (
      //     SELECT COUNT(*) FROM ThamGiaDB AS TGDB 
      //     INNER JOIN CauThu AS CT ON CT.maCT = TGDB.maCT 
      //     WHERE TGDB.maDoi = NEW.maDoi AND TGDB.maMG = NEW.maMG AND CT.nuocNgoai = 1
      // ) > 3
      // BEGIN 
      //     SELECT RAISE(ABORT, 'Doi bong chi duoc co toi da 22 cau thu va toi da 3 cau thu nuoc ngoai'); 
      // END;
      // `);
  });
}
createTGDBBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future


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