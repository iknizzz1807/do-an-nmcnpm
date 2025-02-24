import type { RequestHandler } from "@sveltejs/kit";
import { selectBXHDoiNgay } from "$lib/server/db/functions/BangXepHang";

export const GET: RequestHandler = async () => {
  const danhSachTranDau = await selectBXHDoiNgay(new Date("2025-02-24T08:35:50.000Z"));
  return new Response(JSON.stringify(danhSachTranDau), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};