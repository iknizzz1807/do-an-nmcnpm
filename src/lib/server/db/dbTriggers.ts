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
      INSERT INTO BanThangBackup(modifiedDate, maTD, thoiDiem, maCT, maLBT)
      VALUES(datetime('now'), OLD.maTD, OLD.thoiDiem, OLD.maCT, OLD.maLBT);
      END
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_BT_BACKUP
      AFTER UPDATE ON BanThang
      BEGIN
      INSERT INTO BanThangBackup(modifiedDate, maTD, thoiDiem, maCT, maLBT)
      VALUES(datetime('now'), OLD.maTD, OLD.thoiDiem, OLD.maCT, OLD.maLBT);
      END
      `);
      // Trigger check Cầu thủ ghi bàn có thuộc đội ghi bàn không
      // tx.run(sql`
      // CREATE TRIGGER IF NOT EXISTS TRGI_BT_CTDOI
      // AFTER INSERT ON BanThang
      // WHEN NOT EXISTS(SELECT 1 FROM ThamGiaDB AS TGDB 
      //             WHERE NEW.maCT=TGDB.maCT AND NEW.maDoi=TGDB.maDoi)
      // BEGIN
      //     SELECT RAISE(ABORT, 'Cau thu ghi ban thang phai thuoc doi do');
      // END;
      // `);
      // tx.run(sql`
      // CREATE TRIGGER IF NOT EXISTS TRGU_BT_CTDOI
      // AFTER UPDATE ON BanThang
      // WHEN NOT EXISTS(SELECT 1 FROM ThamGiaDB AS TGDB 
      //             WHERE NEW.maCT=TGDB.maCT AND NEW.maDoi=TGDB.maDoi)
      // BEGIN
      //     SELECT RAISE(ABORT, 'Cau thu ghi ban thang phai thuoc doi do');
      // END;
      // `);
      // // Trigger cho đội ghi bàn thắng phải thuộc đội trong lịch thi đâu
      // tx.run(sql`
      // CREATE TRIGGER IF NOT EXISTS TRGI_BT_DOILTD
      // AFTER INSERT ON BanThang
      // WHEN NOT EXISTS(SELECT 1 FROM LichThiDau AS LTD
      //     WHERE LTD.maTD=NEW.maTD AND (LTD.doiMot=NEW.maDoi OR LTD.doiHai=NEW.maDoi))
      // BEGIN
      //     SELECT RAISE(ABORT, 'Doi ghi ban phai thuoc mot trong hai doi cua lich thi dau');
      // END;
      // `);
      // tx.run(sql`
      // CREATE TRIGGER IF NOT EXISTS TRGU_BT_DOILTD
      // AFTER UPDATE ON BanThang
      // WHEN NOT EXISTS(SELECT 1 FROM LichThiDau AS LTD
      //     WHERE LTD.maTD=NEW.maTD AND (LTD.doiMot=NEW.maDoi OR LTD.doiHai=NEW.maDoi))
      // BEGIN
      //     SELECT RAISE(ABORT, 'Doi ghi ban phai thuoc mot trong hai doi cua lich thi dau');
      // END;
      // `);
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
          INSERT INTO CauThuBackup(modifiedDate, maCT, tenCT, ngaySinh, ghiChu, soAo, maLCT, maDoi, imageURL)
          VALUES(datetime('now'), OLD.maCT, OLD.tenCT, OLD.ngaySinh, OLD.ghiChu, OLD.soAo, OLD.maLCT, OLD.maDoi, OLD.imageURL);
      END
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_CT_BACKUP
      AFTER UPDATE ON CauThu
      BEGIN
          INSERT INTO CauThuBackup(modifiedDate, maCT, tenCT, ngaySinh, ghiChu, soAo, maLCT, maDoi, imageURL)
          VALUES(datetime('now'), OLD.maCT, OLD.tenCT, OLD.ngaySinh, OLD.ghiChu, OLD.soAo, OLD.maLCT, OLD.maDoi, OLD.imageURL);
      END
      `);
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
        INSERT INTO DoiBongBackup(modifiedDate, maDoi, tenDoi, maSan, maMG, imageURL)
        VALUES(datetime('now'), OLD.maDoi, OLD.tenDoi, OLD.maSan, OLD.maMG, OLD.imageURL);
      END
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_DB_BACKUP
      AFTER UPDATE ON DoiBong
      BEGIN
        INSERT INTO DoiBongBackup(modifiedDate, maDoi, tenDoi, maSan, maMG, imageURL)
        VALUES(datetime('now'), OLD.maDoi, OLD.tenDoi, OLD.maSan, OLD.maMG, OLD.imageURL);
      END
      `);
  });
}
createDBBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future


const createMGBackupTrigger = async() => {
  // MuaGiai
  await db.transaction(async (tx) => {
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGD_MG_BACKUP
      AFTER DELETE ON MuaGiai
      BEGIN
          INSERT INTO MuaGiaiBackup(modifiedDate, maMG, tenMG, ngayDienRa, ngayKetThuc, imageURL)
          VALUES(datetime('now'), OLD.maMG, OLD.tenMG, OLD.ngayDienRa, OLD.ngayKetThuc, OLD.imageURL);
      END
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_MG_BACKUP
      AFTER UPDATE ON MuaGiai
      BEGIN
          INSERT INTO MuaGiaiBackup(modifiedDate, maMG, tenMG, ngayDienRa, ngayKetThuc, imageURL)
          VALUES(datetime('now'), OLD.maMG, OLD.tenMG, OLD.ngayDienRa, OLD.ngayKetThuc, OLD.imageURL);
      END
      `);
  });
}
createMGBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future


const createLTDBackupTrigger = async() => {
  // LichThiDau
  await db.transaction(async (tx) => {
    tx.run(sql`
    CREATE TRIGGER IF NOT EXISTS TRGD_LTD_BACKUP
    AFTER DELETE ON LichThiDau
    BEGIN
      INSERT INTO LichThiDauBackup(modifiedDate, maTD, maMG, maVTD, maSan, doiMot, doiHai, doiThang, ngayGioDuKien, ngayGioThucTe, ThoiGianDaThiDau, maTT)
      VALUES(datetime('now'), OLD.maTD, OLD.maMG, OLD.maVTD, OLD.maSan, OLD.doiMot, OLD.doiHai, OLD.doiThang, OLD.ngayGioDuKien, OLD.ngayGioThucTe, OLD.ThoiGianDaThiDau, OLD.maTT);
    END
    `);
    tx.run(sql`
    CREATE TRIGGER IF NOT EXISTS TRGU_LTD_BACKUP
    AFTER UPDATE ON LichThiDau
    BEGIN
      INSERT INTO LichThiDauBackup(modifiedDate, maTD, maMG, maVTD, maSan, doiMot, doiHai, doiThang, ngayGioDuKien, ngayGioThucTe, ThoiGianDaThiDau, maTT)
      VALUES(datetime('now'), OLD.maTD, OLD.maMG, OLD.maVTD, OLD.maSan, OLD.doiMot, OLD.doiHai, OLD.doiThang, OLD.ngayGioDuKien, OLD.ngayGioThucTe, OLD.ThoiGianDaThiDau, OLD.maTT);
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
        INSERT INTO SanNhaBackup(modifiedDate, maSan, tenSan, diaChi, maMG)
        VALUES(datetime('now'), OLD.maSan, OLD.tenSan, OLD.diaChi, OLD.maMG);
      END
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_SN_BACKUP
      AFTER UPDATE ON SanNha
      BEGIN
        INSERT INTO SanNhaBackup(modifiedDate, maSan, tenSan, diaChi, maMG)
        VALUES(datetime('now'), OLD.maSan, OLD.tenSan, OLD.diaChi, OLD.maMG);
      END
    `);
  });
}
createSNBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future


// const createTGDBBackupTrigger = async() => {
//   // ThamGiaDB
//   await db.transaction(async (tx) => {
//       tx.run(sql`
//       CREATE TRIGGER IF NOT EXISTS TRGD_TGDB_BACKUP
//       AFTER DELETE ON ThamGiaDB
//       BEGIN
//       INSERT INTO ThamGiaDBBackup(modifiedDate, maDoi, maCT, maMG)
//       VALUES(datetime('now'), OLD.maDoi, OLD.maCT, OLD.maMG);
//       END
//       `);
//       tx.run(sql`
//       CREATE TRIGGER IF NOT EXISTS TRGU_TGDB_BACKUP
//       AFTER UPDATE ON ThamGiaDB
//       BEGIN
//       INSERT INTO ThamGiaDBBackup(modifiedDate, maDoi, maCT, maMG)
//       VALUES(datetime('now'), OLD.maDoi, OLD.maCT, OLD.maMG);
//       END
//       `);
//       // // Trigger giới hạn cầu thủ tối đa và cầu thủ nước ngoài tối đa
//       // tx.run(sql`
//       // CREATE TRIGGER IF NOT EXISTS TRGI_TGDB_CT 
//       // AFTER INSERT ON ThamGiaDB 
//       // WHEN (
//       //     SELECT COUNT(*) FROM ThamGiaDB
//       //     WHERE maDoi = NEW.maDoi AND maMG = NEW.maMG
//       // ) > 22 OR (
//       //     SELECT COUNT(*) FROM ThamGiaDB AS TGDB 
//       //     INNER JOIN CauThu AS CT ON CT.maCT = TGDB.maCT 
//       //     WHERE TGDB.maDoi = NEW.maDoi AND TGDB.maMG = NEW.maMG AND CT.nuocNgoai = 1
//       // ) > 3
//       // BEGIN 
//       //     SELECT RAISE(ABORT, 'Doi bong chi duoc co toi da 22 cau thu va toi da 3 cau thu nuoc ngoai'); 
//       // END;
//       // `);
//       // tx.run(sql`
//       // CREATE TRIGGER IF NOT EXISTS TRGU_TGDB_CT 
//       // AFTER UPDATE ON ThamGiaDB 
//       // WHEN (
//       //     SELECT COUNT(*) FROM ThamGiaDB
//       //     WHERE maDoi = NEW.maDoi AND maMG = NEW.maMG
//       // ) > 22 OR (
//       //     SELECT COUNT(*) FROM ThamGiaDB AS TGDB 
//       //     INNER JOIN CauThu AS CT ON CT.maCT = TGDB.maCT 
//       //     WHERE TGDB.maDoi = NEW.maDoi AND TGDB.maMG = NEW.maMG AND CT.nuocNgoai = 1
//       // ) > 3
//       // BEGIN 
//       //     SELECT RAISE(ABORT, 'Doi bong chi duoc co toi da 22 cau thu va toi da 3 cau thu nuoc ngoai'); 
//       // END;
//       // `);
//   });
// }
// createTGDBBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future


const createTGTDBackupTrigger = async() => {
  // ThamGiaTD
  await db.transaction(async (tx) => {
    tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGD_TGTD_BACKUP
      AFTER DELETE ON ThamGiaTD
      BEGIN
        INSERT INTO ThamGiaTDBackup(modifiedDate, maTD, maCT, maDoi, maVT)
        VALUES(datetime('now'), OLD.maTD, OLD.maCT, OLD.maDoi, OLD.maVT);
      END
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_TGTD_BACKUP
      AFTER UPDATE ON ThamGiaTD
      BEGIN
        INSERT INTO ThamGiaTDBackup(modifiedDate, maTD, maCT, maDoi, maVT)
        VALUES(datetime('now'), OLD.maTD, OLD.maCT, OLD.maDoi, OLD.maVT);
      END
    `);
  });
}
createTGTDBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future

// const createTPBackupTrigger = async() => {
//   // ThePhat
//   await db.transaction(async (tx) => {
//       // Trigger tạo backup
//       tx.run(sql`
//       CREATE TRIGGER IF NOT EXISTS TRGD_TP_BACKUP
//       AFTER DELETE ON ThePhat
//       BEGIN
//       INSERT INTO ThePhatBackup(modifiedDate, maTD, maCT, thoiDiem, maLTP)
//       VALUES(datetime('now'), OLD.maTD, OLD.maCT, OLD.thoiDiem, OLD.maLTP);
//       END
//       `);
//       tx.run(sql`
//       CREATE TRIGGER IF NOT EXISTS TRGU_TP_BACKUP
//       AFTER UPDATE ON ThePhat
//       BEGIN
//       INSERT INTO ThePhatBackup(modifiedDate, maTD, maCT, thoiDiem, maLTP)
//       VALUES(datetime('now'), OLD.maTD, OLD.maCT, OLD.thoiDiem, OLD.maLTP);
//       END
//       `);
//       // Trigger check Cầu thủ bị phạt có thuộc đội bị phạt không
//     //   tx.run(sql`
//     //   CREATE TRIGGER IF NOT EXISTS TRGI_TP_CTDOI
//     //   AFTER INSERT ON ThePhat
//     //   WHEN NOT EXISTS(SELECT 1 FROM ThamGiaDB AS TGDB 
//     //               WHERE NEW.maCT=TGDB.maCT AND NEW.maDoi=TGDB.maDoi)
//     //   BEGIN
//     //       SELECT RAISE(ABORT, 'Cau thu ghi bi phat phai thuoc doi do');
//     //   END;
//     //   `);
//     //   tx.run(sql`
//     //   CREATE TRIGGER IF NOT EXISTS TRGU_TP_CTDOI
//     //   AFTER UPDATE ON ThePhat
//     //   WHEN NOT EXISTS(SELECT 1 FROM ThamGiaDB AS TGDB 
//     //               WHERE NEW.maCT=TGDB.maCT AND NEW.maDoi=TGDB.maDoi)
//     //   BEGIN
//     //       SELECT RAISE(ABORT, 'Cau thu ghi bi phat phai thuoc doi do');
//     //   END;
//     //   `);
//       // Trigger cho đội bị phạt phải thuộc đội trong lịch thi đâu
//     //   tx.run(sql`
//     //   CREATE TRIGGER IF NOT EXISTS TRGI_TP_DOILTD
//     //   AFTER INSERT ON ThePhat
//     //   WHEN NOT EXISTS(SELECT 1 FROM LichThiDau AS LTD
//     //       WHERE LTD.maTD=NEW.maTD AND (LTD.doiMot=NEW.maDoi OR LTD.doiHai=NEW.maDoi))
//     //   BEGIN
//     //       SELECT RAISE(ABORT, 'Doi bi phat phai thuoc mot trong hai doi cua lich thi dau');
//     //   END;
//     //   `);
//     //   tx.run(sql`
//     //   CREATE TRIGGER IF NOT EXISTS TRGU_TP_DOILTD
//     //   AFTER UPDATE ON ThePhat
//     //   WHEN NOT EXISTS(SELECT 1 FROM LichThiDau AS LTD
//     //       WHERE LTD.maTD=NEW.maTD AND (LTD.doiMot=NEW.maDoi OR LTD.doiHai=NEW.maDoi))
//     //   BEGIN
//     //       SELECT RAISE(ABORT, 'Doi bi phat phai thuoc mot trong hai doi cua lich thi dau');
//     //   END;
//     //   `);
//   });
// }
// createTPBackupTrigger()// .catch(console.error); // This may cause some horrible error in the future


const createLBTBackupTrigger = async() => {
  await db.transaction(async (tx) => {
      // Trigger tạo backup
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGD_LBT_BACKUP
      AFTER DELETE ON LoaiBT
      BEGIN
      INSERT INTO LoaiBTBackup(modifiedDate, maLBT, tenLBT, diemBT)
      VALUES(datetime('now'), OLD.maLBT, OLD.tenLBT, OLD.diemBT);
      END
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_LBT_BACKUP
      AFTER UPDATE ON LoaiBT
      BEGIN
      INSERT INTO LoaiBTBackup(modifiedDate, maLBT, tenLBT, diemBT)
      VALUES(datetime('now'), OLD.maLBT, OLD.tenLBT, OLD.diemBT);
      END
      `);
  });
}
createLBTBackupTrigger();

// const createLTPBackupTrigger = async() => {
//   await db.transaction(async (tx) => {
//       // Trigger tạo backup
//       tx.run(sql`
//       CREATE TRIGGER IF NOT EXISTS TRGD_LTP_BACKUP
//       AFTER DELETE ON LoaiTP
//       BEGIN
//       INSERT INTO LoaiTPBackup(modifiedDate, maLTP, tenLTP)
//       VALUES(datetime('now'), OLD.maLTP, OLD.tenLTP);
//       END
//       `);
//       tx.run(sql`
//       CREATE TRIGGER IF NOT EXISTS TRGU_LTP_BACKUP
//       AFTER UPDATE ON LoaiTP
//       BEGIN
//       INSERT INTO LoaiTPBackup(modifiedDate, maLTP, tenLTP)
//       VALUES(datetime('now'), OLD.maLTP, OLD.tenLTP);
//       END
//       `);
//   });
// }
// createLTPBackupTrigger();

const createVTBackupTrigger = async() => {
  await db.transaction(async (tx) => {
      // Trigger tạo backup
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGD_VT_BACKUP
      AFTER DELETE ON ViTri
      BEGIN
      INSERT INTO ViTriBackup(modifiedDate, maVT, tenVT)
      VALUES(datetime('now'), OLD.maVT, OLD.tenVT);
      END
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_VT_BACKUP
      AFTER UPDATE ON ViTri
      BEGIN
      INSERT INTO ViTriBackup(modifiedDate, maVT, tenVT)
      VALUES(datetime('now'), OLD.maVT, OLD.tenVT);
      END
      `);
  });
}
createVTBackupTrigger();

const createLCTBackupTrigger = async() => {
  await db.transaction(async (tx) => {
      // Trigger tạo backup
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGD_LCT_BACKUP
      AFTER DELETE ON LoaiCT
      BEGIN
      INSERT INTO LoaiCTBackup(modifiedDate, maLCT, tenLCT, soCauThuToiDa)
      VALUES(datetime('now'), OLD.maLCT, OLD.tenLCT, OLD.soCauThuToiDa);
      END
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_LCT_BACKUP
      AFTER UPDATE ON LoaiCT
      BEGIN
      INSERT INTO LoaiCTBackup(modifiedDate, maLCT, tenLCT, soCauThuToiDa)
      VALUES(datetime('now'), OLD.maLCT, OLD.tenLCT, OLD.soCauThuToiDa);
      END
      `);
  });
}
createLCTBackupTrigger();


const createVTDBackupTrigger = async() => {
  await db.transaction(async (tx) => {
      // Trigger tạo backup
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGD_VTD_BACKUP
      AFTER DELETE ON VongTD
      BEGIN
      INSERT INTO VongTDBackup(modifiedDate, maVTD, tenVTD)
      VALUES(datetime('now'), OLD.maVTD, OLD.tenVTD);
      END
      `);
      tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGU_VTD_BACKUP
      AFTER UPDATE ON VongTD
      BEGIN
      INSERT INTO VongTDBackup(modifiedDate, maVTD, tenVTD)
      VALUES(datetime('now'), OLD.maVTD, OLD.tenVTD);
      END
      `);
  });
}
createVTDBackupTrigger();