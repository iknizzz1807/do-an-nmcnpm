import { selectLoaiCT } from "$lib/server/db/functions/Data/LoaiCT";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import { checkPageEditable } from "$lib/server/db/functions/User/UserRole";
import type { CauThu } from "$lib/typesDatabase";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, locals, route }) => {
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
    const loaiCTs = await selectLoaiCT();
    const isEditable = await checkPageEditable(locals.user!!.groupId, route.id);

    // console.log(danhSachCauThu);
    return {
      danhSachCauThu,
      tuoiMin: tuoiMin,
      tuoiMax: tuoiMax,
      loaiCTs: loaiCTs,
      isEditable
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      danhSachCauThu: [],
      tuoiMin: 0,
      tuoiMax: 0,
      loaiCTs: [],
      isEditable: false
    };
  }
}) satisfies PageServerLoad;