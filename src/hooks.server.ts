import type { Handle } from "@sveltejs/kit";
import sqlite3 from "sqlite3";

export const handle: Handle = async ({ event, resolve }) => {
  if (!event.locals.db) {
    // This will create the database within the `db.sqlite` file.
    const db = new sqlite3.Database("src/database/db.sqlite", (err) => {
      if (err) {
        throw err;
      }
    });

    // Set the db as our events.db variable.
    event.locals.db = db;

    // We can create a basic table in the db
    const query = `
      CREATE TABLE IF NOT EXISTS 'DoiBong' (
        'maDoi' TEXT primary key NOT NULL UNIQUE,
        'tenDoi' TEXT NOT NULL,
        'sanNha' TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS 'CauThu' (
        'maCT' TEXT primary key NOT NULL UNIQUE,
        'tenCT' TEXT NOT NULL,
        'ngaySinh' TEXT NOT NULL,
        'loaiCT' INTEGER NOT NULL,
        'ghiChu' TEXT NOT NULL
      );
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
      CREATE TABLE IF NOT EXISTS 'ThamGiaDB' (
        'maDoi' TEXT NOT NULL,
        'maCT' TEXT NOT NULL,
        'maMG' INTEGER NOT NULL,
      PRIMARY KEY('maDoi', 'maCT', 'maMG'),
      FOREIGN KEY('maDoi') REFERENCES 'DoiBong'('maDoi'),
      FOREIGN KEY('maCT') REFERENCES 'CauThu'('maCT'),
      FOREIGN KEY('maMG') REFERENCES 'DSMuaGiai'('maMG')
      );
      CREATE TABLE IF NOT EXISTS 'DSMuaGiai' (
        'maMG' INTEGER primary key NOT NULL UNIQUE,
        'tenMG' TEXT NOT NULL
      );
    `;
    
    db.exec(query, (err: any) => {
      if (err) {
        throw err;
      }
    });
  }
  const resp = await resolve(event);
  return resp;
};
