import { selectCauThuMaCT, selectCauThuTGTD } from "$lib/server/db/functions/CauThu";
import { selectAllLoaiCT } from "$lib/server/db/functions/Data/LoaiCT";
import { selectSanNhaMaSan } from "$lib/server/db/functions/Data/SanNha";
import { selectAllVongTD } from "$lib/server/db/functions/Data/VongTD";
import { selectAllDoiBong, selectDoiBongMaDoi, selectDoiBongMuaGiai } from "$lib/server/db/functions/DoiBong";
import { selectLichThiDauWithCauThu } from "$lib/server/db/functions/LichThiDau";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import { checkPageEditable } from "$lib/server/db/functions/User/UserRole";
import type { CauThu, DoiBong } from "$lib/typesDatabase";
import { _GETCauThuMaDoi } from "../../api/cauthu/[ma_doi]/+server";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, fetch, locals, route }) => {
  // const danhSachCauThu = await getDanhSachCauThu(params.ten_doi);
  // Cái này là data giả để mô phỏng data thật được get request từ danh sách các cầu thủ của một đội bóng

  try {

    const maCT = parseInt(params.mact);

    if ((maCT ?? null) === null)
      throw Error("Invalid maCT");

    const cauThu = await selectCauThuMaCT(maCT);
    if (cauThu === null)
      throw Error("Đội không tồn tại");

    const doiBong = (await selectDoiBongMaDoi(cauThu.maDoi!!))!!;
    const sanNha = (await selectSanNhaMaSan(doiBong.maSan))!!;
    doiBong.tenSan = sanNha.tenSan;
    const tranDaus = await selectLichThiDauWithCauThu(maCT);

    const doiBongs = await selectAllDoiBong();
    const vongTD = await selectAllVongTD();
    for (const tranDau of tranDaus) {
      tranDau.tenDoiMot = doiBongs.find(value => value.maDoi === tranDau.doiMot)?.tenDoi ?? "";
      tranDau.tenDoiHai = doiBongs.find(value => value.maDoi === tranDau.doiHai)?.tenDoi ?? "";
      tranDau.tenDoiThang = doiBongs.find(value => value.maDoi === tranDau.doiThang)?.tenDoi ?? "Hòa";
      tranDau.tenVTD = vongTD.find(value => value.maVTD === tranDau.maVTD)?.tenVTD ?? "";
    }

    const tuoiMin = (await selectThamSo("tuoiMin"))!!;
    const tuoiMax = (await selectThamSo("tuoiMax"))!!;
    const loaiCTs = await selectAllLoaiCT();
    const isEditable = await checkPageEditable(locals.user!!.groupId, route.id);

    return {
      cauThu: cauThu,
      maCT: maCT,
      doiBong: doiBong,
      tranDau: tranDaus,
      tuoiMin: tuoiMin,
      tuoiMax: tuoiMax,
      loaiCTs: loaiCTs,
      isEditable: isEditable
    };
  } catch (error) {
    console.error("Error fetching data:", error);

    return {
      cauThu: null,
      maCT: 0,
      doiBong: null,
      tranDau: [],
      tuoiMin: 0,
      tuoiMax: 0,
      loaiCTs: [],
      isEditable: false,
    };
  }
}) satisfies PageServerLoad;
