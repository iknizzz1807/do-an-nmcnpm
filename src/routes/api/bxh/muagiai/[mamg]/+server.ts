import type { RequestHandler } from "@sveltejs/kit";
import { selectBXHDoiMuaGiai } from "$lib/server/db/functions/BangXepHang";
import type { BangXepHangNgay } from "$lib/typesResponse";
import { errorResponseJSON, isNumber } from "$lib";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import { selectDiemSoTen } from "$lib/server/db/functions/Data/DiemSo";

export const _GETBXHMuaGiai = async (maMG: number) => {
  const danhSachTranDau = await selectBXHDoiMuaGiai(maMG);
  const diemThang = (await selectDiemSoTen("Thắng"))!!.diemSo;
  const diemHoa = (await selectDiemSoTen("Hòa"))!!.diemSo;
  const diemThua = (await selectDiemSoTen("Thua"))!!.diemSo;
  for (let tranDau of danhSachTranDau) {
    tranDau.hieuSo = diemThang * tranDau.soTranThang + 
      diemHoa * tranDau.soTranHoa + 
      diemThua * tranDau.soTranThua;
  }
  danhSachTranDau.sort((a: BangXepHangNgay, b: BangXepHangNgay) => b.hieuSo - a.hieuSo);
  for (let i = 0; i < danhSachTranDau.length; i++) danhSachTranDau[i].hang = i + 1;
  return danhSachTranDau;
}

export const GET: RequestHandler = async ({ locals, request, params }) => {
  
  try {
    const maMG = parseInt(params.mamg ?? "");
    console.log("Mã mùa giải:", maMG);
    if (!isNumber(maMG))
      throw new Error("Mùa giải không được trống");
    const bxh = await _GETBXHMuaGiai(maMG);
    return new Response(JSON.stringify(bxh), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });  
  } catch (err) {
    if (err instanceof Error)
      return errorResponseJSON(400, err.message);
    throw err;
  }
};