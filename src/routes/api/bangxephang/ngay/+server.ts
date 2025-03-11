import type { RequestHandler } from "@sveltejs/kit";
import { selectBXHDoiNgay } from "$lib/server/db/functions/BangXepHang";

export const GET: RequestHandler = async ({ locals }) => {
  const danhSachTranDau = await selectBXHDoiNgay(new Date("2025-03-05"));
  return new Response(JSON.stringify(danhSachTranDau), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};