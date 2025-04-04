import { selectAllDSMuaGiai } from "$lib/server/db/functions/DSMuaGiai";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load : LayoutServerLoad = async ({ locals }) => {
  return {
    dsMuaGiai: await selectAllDSMuaGiai(),
    selectedMuaGiai: locals.muaGiai
  }
}