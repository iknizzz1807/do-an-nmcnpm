import { errorResponseJSON } from "$lib";
import { upsertGroup, updateRolesToGroup } from "$lib/server/db/functions/User/UserGroup";
import { checkPageViewable } from "$lib/server/db/functions/User/UserRole";
import type { UserGroupInsert, UserGroupRoles } from "$lib/typesResponse";
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

  const data : UserGroupInsert = await request.json();
  const id = await upsertGroup({ groupId: data.groupId!!, groupName: data.groupName});
  await updateRolesToGroup(id.id, data.roles);
  return new Response(JSON.stringify(id), {
    status: 200
  });
}