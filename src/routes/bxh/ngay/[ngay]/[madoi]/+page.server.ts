import dateFormat from "dateformat";
import type { PageServerLoad } from "./$types";

export const load : PageServerLoad = async ({ params, fetch }) => {
  try {

    const ngay = params.ngay ?? null;
    if (ngay === null || ngay?.trim() === "")
      throw new Error("Ngày không được trống");

    let date = new Date(ngay);

    const response = await fetch("/api/bxh/ngay/" + dateFormat(date, "isoDate") + "/" + params.madoi, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Không thể load data");
    }

    return {
      dsCTGhiBan: await response.json(),
    }

  } catch (e) {
    console.error(e);
    return {
      dsCTGhiBan: []
    }
  }
}