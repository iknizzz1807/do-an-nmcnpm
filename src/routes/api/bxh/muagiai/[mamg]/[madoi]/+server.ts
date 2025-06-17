import type { RequestHandler } from "@sveltejs/kit";
import { selectCauThuGhiBanMuaGiai, selectCauThuGhiBanNgay, selectCauThuGhiBanThang } from "$lib/server/db/functions/BangXepHang";
import { errorResponseJSON, isNumber } from "$lib";
import type { CauThu } from "$lib/typesDatabase";
import type { CauThuGhiBan } from "$lib/typesResponse";

export const GET: RequestHandler = async ({ locals, params, request }) => {
  try {

    const maMG = parseInt(params.mamg ?? "");
    console.log("Mã Mùa Giải:", maMG);
    if (!isNumber(maMG))
      throw new Error("Mã Mùa Giải không hợp lệ");

    if ((params.madoi ?? null) === null || params.madoi?.trim() === "")
      throw new Error("Mã Đội là null");
    const maDoi = parseInt(params.madoi!!);
    if (!isNumber(maDoi))
      throw new Error("Mã Đội không là số");
    
    const dsCTGhiBan: CauThuGhiBan[] = await selectCauThuGhiBanMuaGiai(maMG, maDoi);
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