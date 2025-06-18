import { isNumber } from "$lib";
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

    if (!params.ma_doi)
      throw new Error("Mã đội không được cung cấp");
    const maDoi = parseInt(params.ma_doi);
    if (!isNumber(maDoi))
      throw new Error("Mã đội phải là một số");
    const response = await _GETCauThuMaDoi(params.ma_doi);
  
    const danhSachCauThu: CauThu[] = response;

    const tuoiMin = (await selectThamSo("tuoiMin"))!!;
    const tuoiMax = (await selectThamSo("tuoiMax"))!!;
    const loaiCTs = await selectAllLoaiCT();
    const isEditable = await checkPageEditable(locals.user!!.groupId, route.id);

    return {
      danhSachCauThu,
      ma_doi: params.ma_doi,
      maDoi: maDoi,
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
      maDoi: 0,
      tuoiMin: 0,
      tuoiMax: 0,
      loaiCTs: [],
      isEditable: false
    };
  }
}) satisfies PageServerLoad;
