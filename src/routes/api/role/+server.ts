import { errorResponseJSON } from "$lib";
import { checkPageViewable, upsertRole } from "$lib/server/db/functions/User/UserRole";
import type { UserRoleInsertParams } from "$lib/server/db/schema/User/UserRole";
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

  const data : UserRoleInsertParams = await request.json();

    await upsertRole(data);
  return new Response(JSON.stringify(data), {
    status: 200
  });
}