import type { RequestHandler } from "@sveltejs/kit";
import { selectBXHDoiNgay } from "$lib/server/db/functions/BangXepHang";
import type { BangXepHangNgay } from "$lib/typesResponse";

export const POST: RequestHandler = async ({ locals, request }) => {
  const data = await request.json();

  const danhSachTranDau = await selectBXHDoiNgay(new Date(data.dateBXH));
  console.log(locals.setting);
  for (let tranDau of danhSachTranDau) {
    tranDau.hieuSo = locals.setting.diemThang * tranDau.soTranThang + 
      locals.setting.diemHoa * tranDau.soTranHoa + 
      locals.setting.diemThua * tranDau.soTranThua;
  }
  danhSachTranDau.sort((a: BangXepHangNgay, b: BangXepHangNgay) => b.hieuSo - a.hieuSo);
  return new Response(JSON.stringify(danhSachTranDau), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};