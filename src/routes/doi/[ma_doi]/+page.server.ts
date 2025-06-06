import { selectAllLoaiCT } from "$lib/server/db/functions/Data/LoaiCT";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import { checkPageEditable } from "$lib/server/db/functions/User/UserRole";
import type { CauThu } from "$lib/typesDatabase";
import { _GETCauThuMaDoi } from "../../api/cauthu/[ma_doi]/+server";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, fetch, locals, route }) => {
  // const danhSachCauThu = await getDanhSachCauThu(params.ten_doi);
  // Cái này là data giả để mô phỏng data thật được get request từ danh sách các cầu thủ của một đội bóng

  try {

    const response = await _GETCauThuMaDoi(params.ma_doi);
  
    const danhSachCauThu: CauThu[] = response;

    const tuoiMin = (await selectThamSo("tuoiMin"))!!;
    const tuoiMax = (await selectThamSo("tuoiMax"))!!;
    const loaiCTs = await selectAllLoaiCT();
    const isEditable = await checkPageEditable(locals.user!!.groupId, route.id);

    return {
      danhSachCauThu,
      ma_doi: params.ma_doi,
      tuoiMin: tuoiMin,
      tuoiMax: tuoiMax,
      loaiCTs: loaiCTs,
      isEditable
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      danhSachCauThu: [],
      ma_doi: params.ma_doi,
      tuoiMin: 0,
      tuoiMax: 0,
      loaiCTs: [],
      isEditable: false
    };
  }
}) satisfies PageServerLoad;
