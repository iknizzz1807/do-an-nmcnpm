import { selectKetQuaTranDauGanDay } from "$lib/server/db/functions/DoiBong";
import { checkPageEditable } from "$lib/server/db/functions/User/UserRole";
import type { DoiBong, LichThiDau, SanNha } from "$lib/typesDatabase";
import { _GETDoiBong } from "../api/doibong/+server";
import { _GETSanNha } from "../api/sannha/+server";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, locals, route }) => {
  try {
    const response = await _GETDoiBong(locals.muaGiai!!.maMG!!);

    const danhSachDoiBong: DoiBong[] = response;
    const responseSN = await _GETSanNha();

    const danhSachSanNha : SanNha[] = responseSN;
    const isEditable = await checkPageEditable(locals.user!!.groupId, route.id);

    for (const doiBong of danhSachDoiBong) {
      const ketQua : LichThiDau[] = await selectKetQuaTranDauGanDay(doiBong.maDoi!!);
      doiBong.ketQua5TranGanNhat = ketQua.map(value => 
        (value.doiThang === doiBong.maDoi ? "win" : (value.doiThang === null ? "tie" : "lose"))
      ) 
    }

    return {
      danhSachDoiBong: danhSachDoiBong,
      danhSachSanNha: danhSachSanNha,
      isEditable
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      danhSachDoiBong: [],
      danhSachSanNha: [],
      isEditable: false
    };
  }
}) satisfies PageServerLoad;
