import type { RequestHandler } from "@sveltejs/kit";
import { selectCauThuGhiBan } from "$lib/server/db/functions/BangXepHang";
import { isNumber } from "$lib";

export const GET: RequestHandler = async ({ locals, params, request }) => {
  if ((params.madoi ?? null) === null || params.madoi?.trim() === "")
    throw new Error("Mã Đội là null");
  const madoi = parseInt(params.madoi!!);
  if (!isNumber(madoi))
    throw new Error("Mã Đội không là số");

  const ngay = params.ngay ?? null;
  if (ngay === null || ngay?.trim() === "")
    throw new Error("Ngày không được trống");

  let date = new Date(ngay);

  const dsCTGhiBan = await selectCauThuGhiBan(date, madoi);
  return new Response(JSON.stringify(dsCTGhiBan), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};