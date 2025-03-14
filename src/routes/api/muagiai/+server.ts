import { selectAllDSMuaGiai } from "$lib/server/db/functions/DSMuaGiai";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({locals}) => {
  let dsMuaGiai = await selectAllDSMuaGiai();
  return new Response(JSON.stringify(dsMuaGiai), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};