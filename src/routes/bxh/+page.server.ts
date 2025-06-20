import type { CauThu } from "$lib/typesDatabase";
import dateFormat from "dateformat";
import type { PageServerLoad } from "./$types";
import { _GETBXHNgay } from "../api/bxh/ngay/[ngay]/+server";
import { _GETMuaGiai } from "../api/muagiai/+server";

export const load = (async ({  }) => {
  try {

    const date = new Date();
    const reponse = await _GETBXHNgay(date);

    const bangXepHangNgay = reponse;
    const danhSachMuaGiai = await _GETMuaGiai();

    return {
      bangXepHangNgay: bangXepHangNgay,
      danhSachMuaGiai: danhSachMuaGiai,
      dateBXH: dateFormat(date, "isoDate")
    }
  } catch (err) {
    console.error(err);
    return {
      bangXepHangNgay: [],
      danhSachMuaGiai: [],
      dateBXH: ""
    }
  }
}) satisfies PageServerLoad;