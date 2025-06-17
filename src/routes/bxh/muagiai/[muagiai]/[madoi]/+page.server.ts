import dateFormat from "dateformat";
import type { PageServerLoad } from "./$types";
import { isNumber } from "$lib";

export const load : PageServerLoad = async ({ params, fetch }) => {
  try {

    const muagiai = params.muagiai ?? null;
    if (muagiai === null || muagiai?.trim() === "")
      throw new Error("Ngày không được trống");

    let muaGiai = parseInt(muagiai);
    if (isNumber(muaGiai) === false || muaGiai <= 0) 
      throw new Error("Mùa giải không hợp lệ");

    const response = await fetch("/api/bxh/muagiai/" + muaGiai + "/" + params.madoi, {
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