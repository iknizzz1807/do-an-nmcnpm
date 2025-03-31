import type { CauThu } from "$lib/typesDatabase";
import dateFormat from "dateformat";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, locals, params }) => {
  try {
    const ngay = params.ngay ?? null;
    if (ngay === null || ngay?.trim() === "")
      throw new Error("Ngày không được trống");
    let date = new Date(ngay);

    const reponse = await fetch("/api/bangxephang/" + dateFormat(date, "isoDate"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    if (!reponse.ok)
      throw new Error("Failed to fetch data");

    const bangXepHangNgay = await reponse.json();

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