import type { RequestHandler } from "@sveltejs/kit";
import { selectCauThuGhiBan } from "$lib/server/db/functions/BangXepHang";
import { errorResponseJSON, isNumber } from "$lib";
import type { CauThu } from "$lib/typesDatabase";

export const GET: RequestHandler = async ({ locals, params, request }) => {
  try {

    const maMG = parseInt(params.maMG ?? "");
    if (!isNumber(maMG))
      throw new Error("Mã Mùa Giải không hợp lệ");

    if ((params.madoi ?? null) === null || params.madoi?.trim() === "")
      throw new Error("Mã Đội là null");
    const madoi = parseInt(params.madoi!!);
    if (!isNumber(madoi))
      throw new Error("Mã Đội không là số");
    
    const dsCTGhiBan: CauThu[] = [];
    return new Response(JSON.stringify(dsCTGhiBan), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  catch (error) {
    if (error instanceof Error) {
      return errorResponseJSON(400, error.message);
    }
    else
      throw error;
  }
};