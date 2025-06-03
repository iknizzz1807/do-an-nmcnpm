import type { RequestHandler } from "@sveltejs/kit";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/db/functions/User/Session";
import { errorResponseJSON } from "$lib";

export const POST: RequestHandler = async (event) => {
  if ((event.locals.session ?? null) === null) {
    return errorResponseJSON(404, "Session doesn't exists");
  }
  await invalidateSession(event.locals.session!!.sessionId!!);
  deleteSessionTokenCookie(event);
  
  // ??
  return new Response(null, { status: 200 });
};
