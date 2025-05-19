import type { RequestHandler } from "@sveltejs/kit";
import { deleteSessionTokenCookie } from "$lib/server/db/functions/User/Session";

export const POST: RequestHandler = async (event) => {
  deleteSessionTokenCookie(event);
  // ??
  return new Response(null, { status: 200 });
};
