import { isNumber } from "$lib";
import { selectCauThuDoiBong } from "$lib/server/db/functions/CauThu";
import { selectDoiBongTenDoi } from "$lib/server/db/functions/DoiBong";
import { selectLichThiDauMaTD } from "$lib/server/db/functions/LichThiDau";
import type { BanThang, ThePhat } from "$lib/typesDatabase";
import type { PageServerLoad } from "./$types";


// TODO: rework this
export const load = (async ({ fetch, params, locals }) => {
  try {
    const maTD = parseInt(params.matd);
    if (!isNumber(maTD))
      throw new Error("MaTD phải là một số");
    const tranDau = await selectLichThiDauMaTD(maTD) ?? null;
    if (tranDau === null)
      throw new Error("Không tồn tại trận đấu");

    const doiMot = await selectDoiBongTenDoi(tranDau.doiMot) ?? null;
    if (doiMot === null)
      throw new Error("Không tồn tại đội bóng. Thats sus");

    const doiHai = await selectDoiBongTenDoi(tranDau.doiHai) ?? null;
    if (doiHai === null)
      throw new Error("Không tồn tại đội bóng. Thats sus");

    if (locals.muaGiai === null)
      throw new Error("Chưa chọn mùa giải");
    const cauThuDoiMot = await selectCauThuDoiBong(locals.muaGiai!!.maMG!!, tranDau.doiMot);
    const cauThuDoiHai = await selectCauThuDoiBong(locals.muaGiai!!.maMG!!, tranDau.doiHai);

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

    const danhSachBanThang : BanThang[] = await responseBT.json();
    const danhSachThePhat : ThePhat[] = await responseTP.json();
    danhSachBanThang.sort((a, b) => a.thoiDiem - b.thoiDiem);
    danhSachThePhat.sort((a, b) => a.thoiDiem - b.thoiDiem);
    return {
      maTD: maTD,
      maDoiMot: tranDau.doiMot,
      maDoiHai: tranDau.doiHai,
      tenDoiMot: doiMot.tenDoi,
      tenDoiHai: doiHai.tenDoi,
      cauThuDoiMot: cauThuDoiMot,
      cauThuDoiHai: cauThuDoiHai,
      danhSachBanThang: danhSachBanThang,
      danhSachThePhat: danhSachThePhat,
    }
  } catch (err) {
    console.error(err);
    return {
      maDoiMot: 0,
      maDoiHai: 0,
      tenDoiMot: "",
      tenDoiHai: "",
      cauThuDoiMot: [],
      cauThuDoiHai: [],
      danhSachBanThang: [],
      danhSachThePhat: [],
    }
  }
}) satisfies PageServerLoad;