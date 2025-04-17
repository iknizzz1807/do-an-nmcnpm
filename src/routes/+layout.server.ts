import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { selectAllMuaGiai } from "$lib/server/db/functions/MuaGiai";

export const load : LayoutServerLoad = async ({ locals }) => {
  return {
    dsMuaGiai: await selectAllMuaGiai(),
    selectedMuaGiai: locals.muaGiai
  }
}