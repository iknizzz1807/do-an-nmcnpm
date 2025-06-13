import type { RequestHandler } from "@sveltejs/kit";
import { selectBXHDoiNgay, selectBXHDoiThang } from "$lib/server/db/functions/BangXepHang";
import type { BangXepHangNgay } from "$lib/typesResponse";
import { errorResponseJSON } from "$lib";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import { selectDiemSoTen } from "$lib/server/db/functions/Data/DiemSo";

export const _GETBXHNgay = async (ngay: Date) => {
  const danhSachTranDau = await selectBXHDoiNgay(ngay);
  console.log(danhSachTranDau);
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
    const ngay = params.ngay ?? null;
    if (ngay === null || ngay?.trim() === "")
      throw new Error("Ngày không được trống");

    let date = new Date(ngay);

    const bxh = await _GETBXHNgay(date);
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