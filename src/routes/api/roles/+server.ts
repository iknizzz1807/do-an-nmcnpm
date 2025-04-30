import { errorResponseJSON } from "$lib";
import { updateRolesToGroup } from "$lib/server/db/functions/User/UserGroup";
import { checkPageViewable } from "$lib/server/db/functions/User/UserRole";
import type { UserGroupRoles } from "$lib/typesResponse";
import type { RequestHandler } from "./$types";


// Update User Group Has Roles
export const POST: RequestHandler = async ({ request, locals, route }) => {
  if (!locals.user)
    return errorResponseJSON(401, "Unauthorized");
  if (locals.user.id !== 0)
  {
    if ((await checkPageViewable(locals.user!!.groupId!!, route.id)) === false)
      return errorResponseJSON(401, "Unauthorized");
  }

  const data : UserGroupRoles = await request.json();
  await updateRolesToGroup(data.groupId, data.roles);
  return new Response(null, {
    status: 200
  });
}