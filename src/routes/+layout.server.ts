import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { selectAllMuaGiai } from "$lib/server/db/functions/MuaGiai";
import { selectAllUserGroupWithRole, selectUserGroupGroupID, selectUserGroupWithRole } from "$lib/server/db/functions/User/UserGroup";

export const load : LayoutServerLoad = async ({ locals }) => {
  console.log(locals.muaGiai);
  const isAdmin = (locals.user?.groupId ?? -1) == 0;
  return {
    dsMuaGiai: await selectAllMuaGiai(),
    selectedMuaGiai: locals.muaGiai,
    isAdmin: isAdmin,
    viewablePages: await selectUserGroupWithRole(locals.user?.groupId ?? -1)
  }
}