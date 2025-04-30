import { errorResponseJSON } from "$lib";
import { selectSettings } from "$lib/server/db/functions/ThamSo";
import { selectAllUser } from "$lib/server/db/functions/User/User";
import { checkPageViewable, selectAllRole } from "$lib/server/db/functions/User/UserRole";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { selectAllUserGroup, selectAllUserGroupWithRole } from "$lib/server/db/functions/User/UserGroup";

export const load = (async ({ locals, route}) => {
  const roleId = 9999;
  if (!locals.user)
    error(401);
  if ((await checkPageViewable(locals.user?.groupId!!, route.id)) === false)
    error(401);
    
  return {
    setting: await selectSettings(),
    users: await selectAllUser(),
    userGroup: await selectAllUserGroupWithRole(),
    userRoles: await selectAllRole()
  };
}) satisfies PageServerLoad;
