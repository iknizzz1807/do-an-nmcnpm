import type { RequestHandler } from "@sveltejs/kit";
import { selectCauThuGhiBan } from "$lib/server/db/functions/BangXepHang";
import { isNumber } from "$lib";

export const POST: RequestHandler = async ({ locals, params, request }) => {
  if ((params.madoi ?? null) === null || params.madoi?.trim() === "")
    throw new Error("Mã Đội là null");
  const madoi = parseInt(params.madoi!!);
  if (!isNumber(madoi))
    throw new Error("Mã Đội không là số");
  const data = await request.json();
  const dsCTGhiBan = await selectCauThuGhiBan(new Date(data.dateBXH), madoi);
  return new Response(JSON.stringify(dsCTGhiBan), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};