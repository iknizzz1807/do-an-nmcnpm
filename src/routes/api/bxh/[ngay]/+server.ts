import type { RequestHandler } from "@sveltejs/kit";
import { selectBXHDoiNgay } from "$lib/server/db/functions/BangXepHang";
import type { BangXepHangNgay } from "$lib/typesResponse";
import { errorResponseJSON } from "$lib";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";

export const GET: RequestHandler = async ({ locals, request, params }) => {
  
  try {
    const ngay = params.ngay ?? null;
    if (ngay === null || ngay?.trim() === "")
      throw new Error("Ngày không được trống");

    let date = new Date(ngay);

    const danhSachTranDau = await selectBXHDoiNgay(new Date(date));
    const diemThang = (await selectThamSo("diemThang"))!!;
    const diemHoa = (await selectThamSo("diemHoa"))!!;
    const diemThua = (await selectThamSo("diemThua"))!!;
    for (let tranDau of danhSachTranDau) {
      tranDau.hieuSo = diemThang * tranDau.soTranThang + 
        diemHoa * tranDau.soTranHoa + 
        diemThua * tranDau.soTranThua;
    }
    danhSachTranDau.sort((a: BangXepHangNgay, b: BangXepHangNgay) => b.hieuSo - a.hieuSo);
    return new Response(JSON.stringify(danhSachTranDau), {
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