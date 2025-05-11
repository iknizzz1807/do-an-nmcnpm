import type { RequestHandler } from "./$types";
import type { User } from "$lib/typesAuth";
import { deleteUser, updateUser, updateUserPassword } from "$lib/server/db/functions/User/User";
import { errorResponseJSON, isNumber } from "$lib";

export const POST : RequestHandler = async({ request, locals, params } : { request: Request, locals: App.Locals, params: any }) => {
  const data = await request.json();
  if (!(data satisfies User))
    throw new Error("Không thỏa mãn User");
  // if (!locals.user?.isAdmin) 
  //   return errorResponseJSON(401, "Không có quyền cập nhật");

  let user : User = data;
  
  if ((user.id ?? null) === null) {
    throw new Error("Không thể update user không có id");
  }
  else {
    await updateUser(user).catch((err) => {
      throw err;
    });
    if (user.editedPassword ?? null) {
      updateUserPassword(user.id, user.editedPassword!!);
    }
  }

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const DELETE: RequestHandler = async ({ request, url, locals}) => {
  if (!locals.user)
    return errorResponseJSON(401, "Unauthorized");
  try {

    const userId = parseInt(url.searchParams.get("userId") ?? "");
    if (!isNumber(userId))
      throw new Error("roleId không hợp lệ");
    await deleteUser(userId);
    return new Response(JSON.stringify( { userId: userId }), {
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