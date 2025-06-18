import { errorResponseJSON, isNumber } from "$lib";
import { upsertGroup, updateRolesToGroup, deleteUserGroup } from "$lib/server/db/functions/User/UserGroup";
import { checkPageViewable } from "$lib/server/db/functions/User/UserRole";
import type { UserGroupInsert, UserGroupRoles } from "$lib/typesResponse";
import type { RequestHandler } from "./$types";


// Update User Group Has Roles
export const POST: RequestHandler = async ({ request, locals, route }) => {

  try {

    const data : UserGroupInsert = await request.json();
    const id = await upsertGroup({ groupId: data.groupId!!, groupName: data.groupName});
    await updateRolesToGroup(id.id, data.roles);
    return new Response(JSON.stringify(id), {
      status: 200
    });
  } catch (error) {
    if (error instanceof Error)
      return errorResponseJSON(400, error.message);
    else
      throw error;
  }
}

export const DELETE: RequestHandler = async ({ request, url, locals}) => {
  
  try {
    const groupId = parseInt(url.searchParams.get("groupId") ?? "");
    if (!isNumber(groupId))
      throw new Error("groupId không hợp lệ");
    await deleteUserGroup(groupId);
    
    return new Response(JSON.stringify( { groupId: groupId }), {
      status: 200
    });
  }
  catch (err) {
    if (err instanceof Error)   
      return errorResponseJSON(400, err.message);
    else
      throw err;
  }

}