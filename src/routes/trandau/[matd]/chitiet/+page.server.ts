import { isNumber } from "$lib";
import { selectCauThuDoiBong, selectCauThuTGTD } from "$lib/server/db/functions/CauThu";
import { selectAllViTri } from "$lib/server/db/functions/Data/ViTri";
import { selectDoiBongMaDoi } from "$lib/server/db/functions/DoiBong";
import { selectLichThiDauMaTD } from "$lib/server/db/functions/LichThiDau";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import { checkPageEditable } from "$lib/server/db/functions/User/UserRole";
import type { BanThang, CauThu, LichThiDau, ThePhat, ViTri } from "$lib/typesDatabase";
import type { PageServerLoad } from "./$types";


// TODO: rework this
export const load = (async ({ fetch, params, locals, route }) => {
  try {
    const maTD = parseInt(params.matd);
    if (!isNumber(maTD))
      throw new Error("MaTD phải là một số");
    
    const tranDau : LichThiDau | null = await selectLichThiDauMaTD(maTD) ?? null;
    if (tranDau === null)
      throw new Error("Không tồn tại trận đấu");

    const doiMot = await selectDoiBongMaDoi(tranDau.doiMot) ?? null;
    if (doiMot === null)
      throw new Error("Không tồn tại đội bóng. Thats sus");

    const doiHai = await selectDoiBongMaDoi(tranDau.doiHai) ?? null;
    if (doiHai === null)
      throw new Error("Không tồn tại đội bóng. Thats sus");

    if (locals.muaGiai === null)
      throw new Error("Chưa chọn mùa giải");
    const cauThuDoiMot = await selectCauThuDoiBong(tranDau.doiMot);
    const cauThuDoiHai = await selectCauThuDoiBong(tranDau.doiHai);

    const viTri = await selectAllViTri();

    const responseBT = await fetch("/api/banthang/" + maTD, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!responseBT.ok) {
      throw new Error("Failed to fetch Bàn thắng");
    }

    const responseTP = await fetch("/api/thephat/" + maTD, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!responseTP.ok) {
      throw new Error("Failed to fetch Thẻ phạt");
    }

    const cauThuThamGiaDoiMot = await selectCauThuTGTD(maTD, tranDau.doiMot);
    const cauThuThamGiaDoiHai = await selectCauThuTGTD(maTD, tranDau.doiHai);
    const cauThuThamGiaDoiMotValue = cauThuThamGiaDoiMot.map((value) => {
      const cauThu : CauThu = {
        ...value.cauThu
      }
      const viTri : ViTri = {
        ...value.viTri
      }
      return {
        cauThu: cauThu,
        viTri: viTri,
      }
    });
    const cauThuThamGiaDoiHaiValue = cauThuThamGiaDoiHai.map((value) => {
      const cauThu : CauThu = {
        ...value.cauThu
      }
      const viTri : ViTri = {
        ...value.viTri
      }
      return {
        cauThu: cauThu,
        viTri: viTri,
      }
    });

    return {
      soCauThuTGTDMax: (await selectThamSo("soCauThuTGTDMax"))!!,
      maTD: maTD,
      maDoiMot: tranDau.doiMot,
      maDoiHai: tranDau.doiHai,
      tenDoiMot: doiMot.tenDoi,
      tenDoiHai: doiHai.tenDoi,
      cauThuDoiMot: cauThuDoiMot,
      cauThuDoiHai: cauThuDoiHai,
      cauThuThamGiaDoiMot: cauThuThamGiaDoiMotValue,
      cauThuThamGiaDoiHai: cauThuThamGiaDoiHaiValue,
      viTri: viTri,
      isEditable: true
    }
  } catch (err) {
    console.error(err);
    return {
      soCauThuTGTDMax: 0,
      maDoiMot: 0,
      maDoiHai: 0,
      tenDoiMot: "",
      tenDoiHai: "",
      cauThuDoiMot: [],
      cauThuDoiHai: [],
      cauThuThamGiaDoiMot: [],
      cauThuThamGiaDoiHai: [],
      viTri: [],
      isEditable: false
    }
  }
}) satisfies PageServerLoad;