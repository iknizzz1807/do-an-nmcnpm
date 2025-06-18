import { errorResponseJSON, isNumber } from "$lib";
import { checkPageViewable, deleteUserRole, upsertRole } from "$lib/server/db/functions/User/UserRole";
import type { UserRoleInsertParams } from "$lib/server/db/schema/User/UserRole";
import type { RequestHandler } from "./$types";


// Update User Group Has Roles
export const POST: RequestHandler = async ({ request, locals, route }) => {

  try {

    const data : UserRoleInsertParams = await request.json();
    
    await upsertRole(data);
    
    return new Response(JSON.stringify(data), {
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

    const roleId = parseInt(url.searchParams.get("roleId") ?? "");
    if (!isNumber(roleId))
      throw new Error("roleId không hợp lệ");
    await deleteUserRole(roleId);
    return new Response(JSON.stringify( { roleId: roleId }), {
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