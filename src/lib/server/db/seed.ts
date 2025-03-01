import { seed } from "drizzle-seed";
import { db } from "./client";
import { CauThuTable } from "./schema/CauThu";
import { BanThangTable } from "./schema/BanThang";
import { DoiBongTable } from "./schema/DoiBong";
import { DSMuaGiaiTable } from "./schema/DSMuaGiai";
import { LichThiDauTable } from "./schema/LichThiDau";
import { ThamGiaDBTable } from "./schema/ThamGiaDB";

await seed(db, {
  DSMuaGiaiTable,
  CauThuTable,
  DoiBongTable,
  ThamGiaDBTable,
  LichThiDauTable,
  BanThangTable,
}).refine((f) => ({
  DSMuaGiaiTable: {
    columns:{ 
      tenMG: f.fullName()
    },
    count: 10
  },

  CauThuTable: {
    columns: {
      tenCT: f.fullName(),
      ngaySinh: f.date({ minDate: "1990-01-01", maxDate: "2005-12-31" }),
      loaiCT: f.int({ minValue: 0, maxValue: 5 }),
      ghiChu: f.loremIpsum(),
      nuocNgoai: f.int({ minValue: 0, maxValue: 1 })
    },
    count: 10
  },

  DoiBongTable: {
    columns: {
      tenDoi: f.companyName(),
      sanNha: f.city(),
    },
    count: 10
  },

  ThamGiaDBTable: {
    columns: {
      maMG: f.number({ minValue: 1, maxValue: 1})
    }
  },

  LichThiDauTable: {
    columns: {
      ngayGio: f.datetime(),
      vongThiDau: f.int({ minValue: 1, maxValue: 2 })
    },
    count: 10
  },
  
  BanThangTable: {
    columns: {
      thoiDiem: f.number({ minValue: 0.0, maxValue: 90.0 }),
      loaiBanThang: f.int({ minValue: 1, maxValue: 2 })
    },
    count: 10
  },
})).catch(() => {
  console.log("\n\nPlease delete the db.sqlite before running seed:db. You gonna fucking panic because of the amount of shit printed");
});