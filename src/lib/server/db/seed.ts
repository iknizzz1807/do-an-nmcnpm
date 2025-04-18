import { seed } from "drizzle-seed";
import { db } from "./client";
import { CauThuTable } from "./schema/CauThu";
import { DoiBongTable } from "./schema/DoiBong";
import { MuaGiaiTable } from "./schema/MuaGiai";
import { LichThiDauTable } from "./schema/LichThiDau";
import { generateBanThang, generateLichThiDau, generateTGDB, generateTGTD, generateThePhat } from "./seedFunctions";
import { randIntBetween } from "../utils";
import { SanNhaTable } from "./schema/Data/SanNha";
import { ViTriTable } from "./schema/Data/ViTri";
import { LoaiCTTable } from "./schema/Data/LoaiCT";
import { LoaiBTTable } from "./schema/Data/LoaiBT";
import { LoaiTPTable } from "./schema/Data/LoaiTP";
import { VongTDTable } from "./schema/Data/VongTD";

await seed(db, {
  SanNhaTable,
  MuaGiaiTable,
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

  MuaGiaiTable: {
    columns:{ 
      tenMG: f.fullName(),
      ngayDienRa: f.date(),
      ngayKetThuc: f.date(),
    },
    count: 3
  },

  CauThuTable: {
    columns: {
      tenCT: f.fullName(),
      ngaySinh: f.date({ minDate: "1990-01-01", maxDate: "2005-12-31" }),
      ghiChu: f.loremIpsum(),
      maLCT: f.int({minValue: 1, maxValue: 2}),
    },
    count: 550,
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

const muaGiais = await db.select().from(MuaGiaiTable);
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