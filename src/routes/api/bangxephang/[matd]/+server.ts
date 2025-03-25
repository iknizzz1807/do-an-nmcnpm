import type { RequestHandler } from "@sveltejs/kit";
import { selectCauThuGhiBan } from "$lib/server/db/functions/BangXepHang";
import { isNumber } from "$lib";

export const GET: RequestHandler = async ({ locals, params }) => {
  if ((params.matd ?? null) === null || params.matd?.trim() === "")
    throw new Error("Mã thi đấu là null");
  const matd = parseInt(params.matd!!);
  if (!isNumber(matd))
    throw new Error("Mã thi đấu không là số");
  const dsCTGhiBan = await selectCauThuGhiBan(new Date(), matd);
  return new Response(JSON.stringify(dsCTGhiBan), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};