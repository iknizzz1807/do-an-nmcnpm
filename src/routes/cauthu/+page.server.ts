import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import type { CauThu } from "$lib/typesDatabase";
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

    const tuoiMin = (await selectThamSo("tuoiMin"))!!;
    const tuoiMax = (await selectThamSo("tuoiMax"))!!;

    // console.log(danhSachCauThu);
    return {
      danhSachCauThu,
      tuoiMin: tuoiMin,
      tuoiMax: tuoiMax,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      danhSachCauThu: [],
      tuoiMin: 0,
      tuoiMax: 0,
    };
  }
}) satisfies PageServerLoad;