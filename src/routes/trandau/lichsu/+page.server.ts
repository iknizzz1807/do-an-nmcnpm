
import { db } from "$lib/server/db/client";
import { selectSanNhaMuaGiai } from "$lib/server/db/functions/Data/SanNha";
import { selectAllVongTD } from "$lib/server/db/functions/Data/VongTD";
import { LichThiDauTableBackup } from "$lib/server/db/schema/LichThiDau";
import type { DoiBong, MuaGiai, VongTD, SanNha } from "$lib/typesDatabase";
import { desc } from "drizzle-orm";
import { _GETDoiBong } from "../../api/doibong/+server";
import { _GETLichThiDau } from "../../api/lichthidau/+server";
import { _GETMuaGiai } from "../../api/muagiai/+server";
import type { PageServerLoad } from "./$types";
import { eq } from "drizzle-orm";


export const load = (async ({ fetch, locals, route }) => {
  try {
    const responseDB = await _GETDoiBong(locals.muaGiai!!.maMG!!);
    const responseMG = await _GETMuaGiai();
    
    const danhSachDoi: DoiBong[] = responseDB;
    const danhSachMuaGiai: MuaGiai[] = responseMG;
    const danhSachVTD: VongTD[] = await selectAllVongTD();
    const danhSachSan: SanNha[] = await selectSanNhaMuaGiai(locals.muaGiai!!.maMG!!);
    return {
      lichSu: (await db.select()
      .from(LichThiDauTableBackup)
      .where(eq(LichThiDauTableBackup.maMG, locals.muaGiai?.maMG!!))
      .orderBy(desc(LichThiDauTableBackup.modifiedDate))),
      danhSachDoi,
      danhSachMuaGiai,
      danhSachVTD,
      danhSachSan,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      lichSu: [],
      danhSachDoi: [],
      danhSachMuaGiai: [],
      danhSachVTD: [],
      danhSachSan: [],
    };
  }
}) satisfies PageServerLoad;