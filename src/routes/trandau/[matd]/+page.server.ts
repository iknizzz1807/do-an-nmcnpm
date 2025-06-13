import { isNumber } from "$lib";
import { selectCauThuDoiBong, selectCauThuTGTD } from "$lib/server/db/functions/CauThu";
import { selectAllLoaiBT } from "$lib/server/db/functions/Data/LoaiBT";
import { selectDoiBongMaDoi } from "$lib/server/db/functions/DoiBong";
import { selectLichThiDauMaTD } from "$lib/server/db/functions/LichThiDau";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import { checkPageEditable } from "$lib/server/db/functions/User/UserRole";
import type { BanThang, LichThiDau, LoaiBT, ThePhat } from "$lib/typesDatabase";
import { _GETBanThang } from "../../api/banthang/[matd]/+server";
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
    const cauThuDoiMot = await selectCauThuTGTD(tranDau.maTD!!, tranDau.doiMot);
    const cauThuDoiHai = await selectCauThuTGTD(tranDau.maTD!!, tranDau.doiHai);
    console.log("allo");

    const responseBT = await _GETBanThang(maTD);

    // const responseTP = await fetch("/api/thephat/" + maTD, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // });
    // if (!responseTP.ok) {
    //   throw new Error("Failed to fetch Thẻ phạt");
    // }

    const danhSachBanThang : BanThang[] = responseBT;
    const danhSachThePhat : ThePhat[] = [];
    danhSachBanThang.sort((a, b) => a.thoiDiem - b.thoiDiem);
    // danhSachThePhat.sort((a, b) => a.thoiDiem - b.thoiDiem);

    const loaiBTs : LoaiBT[] = await selectAllLoaiBT();
    const thoiDiemGhiBanToiDa = (await selectThamSo("thoiDiemGhiBanToiDa"))!!;
    const isEditable = await checkPageEditable(locals.user!!.groupId, route.id);
    
    return {
      maTD: maTD,
      maDoiMot: tranDau.doiMot,
      maDoiHai: tranDau.doiHai,
      tenDoiMot: doiMot.tenDoi,
      tenDoiHai: doiHai.tenDoi,
      thoiDiemGhiBanToiDa: thoiDiemGhiBanToiDa,
      cauThuDoiMot: cauThuDoiMot,
      cauThuDoiHai: cauThuDoiHai,
      danhSachBanThang: danhSachBanThang,
      danhSachThePhat: danhSachThePhat,
      loaiBTs: loaiBTs,
      isEditable: isEditable
    }
  } catch (err) {
    console.error(err);
    return {
      maDoiMot: 0,
      maDoiHai: 0,
      tenDoiMot: "",
      tenDoiHai: "",
      thoiDiemGhiBanToiDa: 0,
      cauThuDoiMot: [],
      cauThuDoiHai: [],
      loaiBTs: [],
      danhSachBanThang: [],
      danhSachThePhat: [],
      isEditable: false
    }
  }
}) satisfies PageServerLoad;