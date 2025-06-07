import { selectUserGroupGroupID } from "$lib/server/db/functions/User/UserGroup";
import type { LayoutServerLoad } from "./$types";



export const load : LayoutServerLoad = async ({ locals }) => {
  if (locals.user) {
    const group = await selectUserGroupGroupID(locals.user.groupId);
    console.log(group)
    return {
      user: {
        username: locals.user.username ?? "",
        groupName: group?.groupName ?? "",
      }
    }
  }
  else {
    return {
      user: {
        username: "",
        groupName: "",
      }
    }
  }
}