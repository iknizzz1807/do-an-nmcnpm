import { errorResponseJSON } from "$lib";
import { insertGroup, updateGroup, updateRolesToGroup } from "$lib/server/db/functions/User/UserGroup";
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
  if ((data.groupId ?? null) === null)
  {
    const id = await insertGroup(data.groupName);
    await updateRolesToGroup(id.id, data.roles);
    return new Response(JSON.stringify(id), {
      status: 200
    });
  }
  else
  {
    await updateGroup(data.groupId!!, data.groupName);
    await updateRolesToGroup(data.groupId!!, data.roles);
    return new Response(JSON.stringify({ id: data.groupId!! }), {
      status: 200
    });
  }
}