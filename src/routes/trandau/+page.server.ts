import { selectTiSoPhanLuoiTranDau, selectTiSoTranDau } from "$lib/server/db/functions/BanThang";
import { selectAllVongTD } from "$lib/server/db/functions/Data/VongTD";
import { checkPageEditable } from "$lib/server/db/functions/User/UserRole";
import type { DoiBong, MuaGiai, LichThiDau, VongTD } from "$lib/typesDatabase";
import { _GETDoiBong } from "../api/doibong/+server";
import { _GETLichThiDau } from "../api/lichthidau/+server";
import { _GETMuaGiai } from "../api/muagiai/+server";
import type { PageServerLoad } from "./$types";


export const load = (async ({ fetch, locals, route }) => {
  try {
    const response = await _GETLichThiDau(locals.muaGiai!!.maMG!!);
    const responseDB = await _GETDoiBong(locals.muaGiai!!.maMG!!);
    const responseMG = await _GETMuaGiai();
    
    const danhSachLTD: LichThiDau[] = response;
    const danhSachDoi: DoiBong[] = responseDB;
    const danhSachMuaGiai: MuaGiai[] = responseMG;
    const danhSachVTD: VongTD[] = await selectAllVongTD();

    const isEditable = await checkPageEditable(locals.user!!.groupId, route.id);

    const tiSo = async (lichThiDau : LichThiDau) => {
      lichThiDau.tiSoDoiMot = (await selectTiSoTranDau(lichThiDau.maTD!!, lichThiDau.doiMot)).tySo + 
        (await selectTiSoPhanLuoiTranDau(lichThiDau.maTD!!, lichThiDau.doiHai)).tySo;
      lichThiDau.tiSoDoiHai = (await selectTiSoTranDau(lichThiDau.maTD!!, lichThiDau.doiHai)).tySo + 
        (await selectTiSoPhanLuoiTranDau(lichThiDau.maTD!!, lichThiDau.doiMot)).tySo;
    }
    const results = await Promise.all(danhSachLTD.map(value => tiSo(value)));
    // for (const lichThiDau of danhSachLTD) {
    //   tiSo(lichThiDau);
    // }

    return {
      danhSachLTD,
      danhSachDoi,
      danhSachMuaGiai,
      danhSachVTD,
      isEditable,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      danhSachLTD: [],
      danhSachDoi: [],
      danhSachVTD: [],
      danhSachMuaGiai: [],
      isEditable: false
    };
  }
}) satisfies PageServerLoad;