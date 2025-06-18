import { isNumber } from "$lib";
import { db } from "$lib/server/db/client";
import { selectCauThuDoiBong, selectCauThuTGTD } from "$lib/server/db/functions/CauThu";
import { selectAllLoaiBT } from "$lib/server/db/functions/Data/LoaiBT";
import { selectDoiBongMaDoi } from "$lib/server/db/functions/DoiBong";
import { selectLichThiDauMaTD } from "$lib/server/db/functions/LichThiDau";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import { checkPageEditable } from "$lib/server/db/functions/User/UserRole";
import { BanThangTableBackup } from "$lib/server/db/schema/BanThang";
import type { BanThang, LichThiDau, LoaiBT, ThePhat } from "$lib/typesDatabase";
import { eq } from "drizzle-orm";
import { _GETBanThang } from "../../../api/banthang/[matd]/+server";
import type { PageServerLoad } from "./$types";
import { desc } from "drizzle-orm";


// TODO: rework this
export const load = (async ({ fetch, params, locals, route }) => {
  try {
    const maTD = parseInt(params.matd);
    if (!isNumber(maTD))
      throw new Error("MaTD phải là một số");
    
    const tranDau : LichThiDau | null = await selectLichThiDauMaTD(maTD) ?? null;
    if (tranDau === null)
      throw new Error("Không tồn tại trận đấu");

    const doiMot = await selectDoiBongMaDoi(tranDau.doiMot) ?? null;
    if (doiMot === null)
      throw new Error("Không tồn tại đội bóng. Thats sus");

    const doiHai = await selectDoiBongMaDoi(tranDau.doiHai) ?? null;
    if (doiHai === null)
      throw new Error("Không tồn tại đội bóng. Thats sus");

    if (locals.muaGiai === null)
      throw new Error("Chưa chọn mùa giải");
    const cauThuDoiMot = await selectCauThuTGTD(tranDau.maTD!!, tranDau.doiMot);
    const cauThuDoiHai = await selectCauThuTGTD(tranDau.maTD!!, tranDau.doiHai);
    const loaiBTs : LoaiBT[] = await selectAllLoaiBT();
    
    return {
      lichSu: await db.select()
      .from(BanThangTableBackup)
      .where(eq(BanThangTableBackup.maTD, maTD))
      .orderBy(desc(BanThangTableBackup.modifiedDate)),
      doiMot: doiMot,
      doiHai: doiHai, 
      cauThuDoiMot: cauThuDoiMot,
      cauThuDoiHai: cauThuDoiHai,
      loaiBTs: loaiBTs,
    }
  } catch (err) {
    console.error(err);
    return {
      lichSu: [],
      doiMot: null,
      doiHai: null, 
      cauThuDoiMot: [],
      cauThuDoiHai: [],
      loaiBTs: [],
    }
  }
}) satisfies PageServerLoad;