import type { RequestHandler } from "@sveltejs/kit";
import { selectBXHDoiNgay } from "$lib/server/db/functions/BangXepHang";

export const GET: RequestHandler = async ({ locals }) => {
  const danhSachTranDau = await selectBXHDoiNgay(new Date());
  return new Response(JSON.stringify(danhSachTranDau), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};