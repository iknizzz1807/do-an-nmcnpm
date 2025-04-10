import { seed } from "drizzle-seed";
import { db } from "./client";
import { CauThuTable } from "./schema/CauThu";
import { DoiBongTable } from "./schema/DoiBong";
import { DSMuaGiaiTable } from "./schema/DSMuaGiai";
import { LichThiDauTable } from "./schema/LichThiDau";
import { generateBanThang, generateLichThiDau, generateTGDB, generateTGTD, generateThePhat } from "./seedFunctions";
import { randIntBetween } from "../utils";
import { SanNhaTable } from "./schema/SanNha";

await seed(db, {
  SanNhaTable,
  DSMuaGiaiTable,
  CauThuTable,
  DoiBongTable,
}).refine((f) => ({
  
  SanNhaTable: {
    columns: {
      tenSan: f.companyName(),
      diaChi: f.streetAddress()
    },
    with: {
      DoiBongTable: 1,
    }
  },

  DSMuaGiaiTable: {
    columns:{ 
      tenMG: f.fullName(),
      ngayDienRa: f.date(),
    },
    count: 3
  },

  CauThuTable: {
    columns: {
      tenCT: f.fullName(),
      ngaySinh: f.date({ minDate: "1990-01-01", maxDate: "2005-12-31" }),
      loaiCT: f.int({ minValue: 0, maxValue: 5 }),
      ghiChu: f.loremIpsum(),
      nuocNgoai: f.int({ minValue: 0, maxValue: 0 })
    },
    count: 550
  },

  DoiBongTable: {
    columns: {
      tenDoi: f.companyName(),
    },
    count: 10
  },
})).catch((reason) => {
  console.log("\n");
  console.log(reason);
  console.log("\n\nPlease delete the db.sqlite before running seed:db. You gonna fucking panic because of the amount of shit printed");
});

// Generate ban Thang

const muaGiais = await db.select().from(DSMuaGiaiTable);
for (const muaGiai of muaGiais) {
  await generateLichThiDau(muaGiai.maMG);
  await generateTGDB(muaGiai.maMG);
}
const lichThiDau = await db.select().from(LichThiDauTable);
for (const lich of lichThiDau) {
  await generateTGTD(lich.maTD, lich.doiMot);
  await generateTGTD(lich.maTD, lich.doiHai);
  await generateBanThang(lich.maTD, randIntBetween(0, 5), randIntBetween(0, 5));
  await generateThePhat(lich.maTD, randIntBetween(0, 1), randIntBetween(0, 1));
}