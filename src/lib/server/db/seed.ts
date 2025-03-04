import { seed } from "drizzle-seed";
import { db } from "./client";
import { CauThuTable } from "./schema/CauThu";
import { DoiBongTable } from "./schema/DoiBong";
import { DSMuaGiaiTable } from "./schema/DSMuaGiai";
import { LichThiDauTable } from "./schema/LichThiDau";
import { generateBanThang, generateLichThiDau, generateTGDB } from "./seedFunctions";

await seed(db, {
  DSMuaGiaiTable,
  CauThuTable,
  DoiBongTable,
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
    },
    count: 200
  },

  DoiBongTable: {
    columns: {
      tenDoi: f.companyName(),
      sanNha: f.city(),
    },
    count: 10
  },
})).catch(() => {
  console.log("\n\nPlease delete the db.sqlite before running seed:db. You gonna fucking panic because of the amount of shit printed");
});

// Generate ban Thang

await generateLichThiDau(1);
await generateTGDB();
const lichThiDau = await db.select().from(LichThiDauTable);
for (const lich of lichThiDau) {
  await generateBanThang(lich.maTD, 2, 5);
}