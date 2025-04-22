import { errorResponseJSON } from "$lib";
import { selectSettings } from "$lib/server/db/functions/ThamSo";
import { selectAllUser } from "$lib/server/db/functions/User/User";
import { checkPageViewable } from "$lib/server/db/functions/User/UserRole";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, route}) => {
  const roleId = 9999;
  if (!locals.user)
    error(401);
  if ((await checkPageViewable(locals.user?.groupId!!, route.id)) === false)
    error(401);
    
  return {
    setting: await selectSettings(),
    users: await selectAllUser(),
  };
}) satisfies PageServerLoad;
