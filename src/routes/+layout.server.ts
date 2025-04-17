import { selectAllMuaGiai } from "$lib/server/db/functions/MuaGiai";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load : LayoutServerLoad = async ({ locals }) => {
  return {
    MuaGiai: await selectAllMuaGiai(),
    selectedMuaGiai: locals.muaGiai
  }
}