import type { CauThu } from "$lib/typesDatabase";
import dateFormat from "dateformat";
import type { PageServerLoad } from "./$types";
import { _GETBXH } from "../../api/bxh/[ngay]/+server";

export const load = (async ({ fetch, locals, params }) => {
  try {
    const ngay = params.ngay ?? null;
    if (ngay === null || ngay?.trim() === "")
      throw new Error("Ngày không được trống");
    let date = new Date(ngay);

    const reponse = await _GETBXH(date);

    const bangXepHangNgay = reponse;

    return {
      bangXepHangNgay: bangXepHangNgay,
      dateBXH: dateFormat(date, "isoDate")
    }
  } catch (err) {
    console.error(err);
    return {
      bangXepHangNgay: [],
      dateBXH: ""
    }
  }
}) satisfies PageServerLoad;