import { db } from "../client";
import { selectCauThuGhiBan } from "../functions/BangXepHang";
import { BanThangTable } from "../schema/BanThang";
import { generateBanThang } from "./banThangData";
import { generateCauThuData } from "./cauThuData";
import { generateDoiBongData } from "./doiBongData";
import { generateDSMuaGiaiData } from "./dsMuaGiaiData";
import { generateLichThuDauData } from "./lichThuDauData";

// npx tsx src/lib/server/db/placeholders/seed.ts
const muaGiais = await generateDSMuaGiaiData(5);
console.log(muaGiais);
const doiBongs = await generateDoiBongData(5);
console.log(doiBongs);
const cauThus = await generateCauThuData(15);
console.log(cauThus);
const lichThiDau = await generateLichThuDauData(1);
console.log(lichThiDau);
// await db.delete(BanThangTable);
// await generateBanThang(1);
// console.log(await selectCauThuGhiBan(1));