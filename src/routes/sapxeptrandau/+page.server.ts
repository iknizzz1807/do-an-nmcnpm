import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import { checkPageEditable } from "$lib/server/db/functions/User/UserRole";
import type { DoiBong, MuaGiai, LichThiDau } from "$lib/typesDatabase";
import { _GETDoiBong } from "../api/doibong/+server";
import { _GETLichThiDau } from "../api/lichthidau/+server";
import { _GETMuaGiai } from "../api/muagiai/+server";
import type { PageServerLoad } from "./$types";


export const load = (async ({ fetch, locals, route }) => {
  try {
    const responseDB = await _GETDoiBong(locals.muaGiai!!.maMG!!);
    const responseMG = await _GETMuaGiai();
    
    const danhSachDoi: DoiBong[] = responseDB;
    const danhSachMuaGiai: MuaGiai[] = responseMG;

    const isEditable = await checkPageEditable(locals.user!!.groupId, route.id);

    return {
      danhSachDoi,
      danhSachMuaGiai,
      isEditable,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      danhSachDoi: [],
      danhSachMuaGiai: [],
      isEditable: false
    };
  }
}) satisfies PageServerLoad;