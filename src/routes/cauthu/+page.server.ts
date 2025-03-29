import type { CauThu, SanNha } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, locals }) => {
  try {
    const response = await fetch("api/cauthu", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const danhSachCauThu: CauThu[] = await response.json();


    // console.log(danhSachCauThu);
    return {
      danhSachCauThu,
      tuoiMin: locals.setting.tuoiMin,
      tuoiMax: locals.setting.tuoiMax,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      danhSachCauThu: [],
      tuoiMin: locals.setting.tuoiMin,
      tuoiMax: locals.setting.tuoiMax,
    };
  }
}) satisfies PageServerLoad;