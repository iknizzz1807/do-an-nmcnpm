import type { RequestHandler } from "@sveltejs/kit";
import { selectBXHDoiThang } from "$lib/server/db/functions/BangXepHang";
import type { BangXepHangNgay } from "$lib/typesResponse";
import { errorResponseJSON, isNumber } from "$lib";
import { selectThamSo } from "$lib/server/db/functions/ThamSo";
import { selectDiemSoTen } from "$lib/server/db/functions/Data/DiemSo";
import { selectAllTieuChiXepHang, selectTieuChiXepHangMaTC, selectTieuChiXepHangTenTC } from "$lib/server/db/functions/Data/TieuChiXepHang";

export const _GETBXHThang = async (thang: Date) => {
  const danhSachTranDau = await selectBXHDoiThang(thang);
  const diemThang = (await selectDiemSoTen("Thắng"))!!.diemSo;
  const diemHoa = (await selectDiemSoTen("Hòa"))!!.diemSo;
  const diemThua = (await selectDiemSoTen("Thua"))!!.diemSo;
  for (let tranDau of danhSachTranDau) {
    tranDau.diem = diemThang * tranDau.soTranThang + 
      diemHoa * tranDau.soTranHoa + 
      diemThua * tranDau.soTranThua;
  }
  const tieuChi = new Map((await selectAllTieuChiXepHang()).sort((a, b) => a.uuTien - b.uuTien).map(tc => [tc.tenTC, tc]));
  
  danhSachTranDau.sort((a: BangXepHangNgay, b: BangXepHangNgay) => {
    if (tieuChi.size === 0) return b.diem - a.diem;

    for (const [key, tc] of tieuChi) {
      const valueA = a[key as keyof BangXepHangNgay];
      const valueB = b[key as keyof BangXepHangNgay];
      // Skip if either value is null/undefined
      if (valueA == null || valueB == null) continue;
      
      const numA = typeof valueA === 'string' ? parseFloat(valueA) : valueA;
      const numB = typeof valueB === 'string' ? parseFloat(valueB) : valueB;
      
      if (typeof numA !== 'number' || typeof numB !== 'number') continue;
      if (!isNumber(numA) || !isNumber(numB)) continue; 

      if (numA !== numB) {
        return (numB - numA);
      }
    }
    return 0;
  });
  for (let i = 0; i < danhSachTranDau.length; i++) danhSachTranDau[i].hang = i + 1;
  return danhSachTranDau;
}

export const GET: RequestHandler = async ({ locals, request, params }) => {
  
  try {
    const thang = params.thang ?? null;
    if (thang === null || thang?.trim() === "")
      throw new Error("Ngày không được trống");

    let date = new Date(thang);

    const bxh = await _GETBXHThang(date);
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