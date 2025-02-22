import { generateCauThuData } from "./cauThuData";
import { generateDoiBongData } from "./doiBongData";
import { generateDSMuaGiaiData } from "./dsMuaGiaiData";
import { generateLichThuDauData } from "./lichThuDauData";

// npx tsx src/lib/server/db/placeholders/seed.ts
const muaGiais = await generateDSMuaGiaiData(5);
const doiBongs = await generateDoiBongData(5);
const cauThus = await generateCauThuData(15);
const lichThiDau = await generateLichThuDauData(1);