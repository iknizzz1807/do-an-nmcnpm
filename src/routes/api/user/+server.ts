import type { RequestHandler } from "./$types";
import type { User } from "$lib/typesAuth";
import { updateUser } from "$lib/server/db/functions/User/User";
import { errorResponseJSON } from "$lib";

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
  }

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}