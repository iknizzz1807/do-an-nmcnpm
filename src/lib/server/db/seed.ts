import { seed } from "drizzle-seed";
import { db } from "./client";
import { CauThuTable } from "./schema/CauThu";
import { DoiBongTable } from "./schema/DoiBong";
import { MuaGiaiTable } from "./schema/MuaGiai";
import { LichThiDauTable } from "./schema/LichThiDau";
import { generateBanThang, generateLichThiDau, generateTGDB, generateTGTD, generateThePhat } from "./seedFunctions";
import { randIntBetween } from "../utils";
import { SanNhaTable } from "./schema/Data/SanNha";
import { TrongTaiTable } from "./schema/TrongTai";

await seed(db, {
  SanNhaTable,
  CauThuTable,
  MuaGiaiTable,
  DoiBongTable,
  TrongTaiTable,
}).refine((f) => ({
  
  MuaGiaiTable: {
    columns:{ 
      tenMG: f.fullName(),
      ngayDienRa: f.date(),
      ngayKetThuc: f.date(),
      deleted: f.default({ defaultValue: false }),
    },
    count: 3,
    with: {
      SanNhaTable: 10,
      DoiBongTable: 10,
      TrongTaiTable: 5,
    }
  },

  SanNhaTable: {
    columns: {
      // maSan: f.int({minValue: 10 * i}),
      tenSan: f.companyName(),
      diaChi: f.streetAddress(),
      deleted: f.default({ defaultValue: false }),
      // maMG: f.default({ defaultValue: muaGiai.maMG }),
    },
    with: {
      DoiBongTable: 1,
    }
  },

  DoiBongTable: {
    columns: {
      tenDoi: f.companyName(),
    },
    with: {
      CauThuTable: 20,
    }
  },

  CauThuTable: {
    columns: {
      tenCT: f.fullName(),
      ngaySinh: f.date({ minDate: "1990-01-01", maxDate: "2005-12-31" }),
      ghiChu: f.loremIpsum(),
      soAo: f.int({ minValue: 1, maxValue: 99 }),
      maLCT: f.int({ minValue: 1, maxValue: 2 }),
      deleted: f.default({ defaultValue: false }),
    },
  },

  TrongTaiTable: {
    columns: {
      tenTT: f.fullName(),
      ngaySinh: f.date({ minDate: "1990-01-01", maxDate: "2005-12-31" }),
      deleted: f.default({ defaultValue: false }),
    }
  }
})).catch((reason) => {
  console.log("\n");
  // console.log(reason);
  console.log("\n\nPlease delete the db.sqlite before running seed:db. \
    You gonna fucking panic because of the amount of shit printed");
});
// Generate ban Thang

const muaGiais = await db.select().from(MuaGiaiTable);
for (const muaGiai of muaGiais) {
  await generateLichThiDau(muaGiai.maMG);
  // await generateTGDB(muaGiai.maMG);
}
const lichThiDau = await db.select().from(LichThiDauTable);
for (const lich of lichThiDau) {
  await generateTGTD(lich.maTD, lich.doiMot);
  await generateTGTD(lich.maTD, lich.doiHai);
  await generateBanThang(lich.maTD, randIntBetween(0, 5), randIntBetween(0, 5));
  // await generateThePhat(lich.maTD, randIntBetween(0, 1), randIntBetween(0, 1));
}