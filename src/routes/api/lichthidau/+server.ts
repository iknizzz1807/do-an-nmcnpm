import { selectAllLichThiDau } from "$lib/server/db/functions/LichThiDau";
import type { RequestHandler } from "@sveltejs/kit";

export const GET : RequestHandler = async() => {
  let dsLTD = await selectAllLichThiDau();
  return new Response(JSON.stringify(dsLTD), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    }
  });
}