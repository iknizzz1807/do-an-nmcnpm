import { fail, redirect, type RequestEvent } from "@sveltejs/kit";
import type { PageServerLoad } from "./bxh/$types";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/db/functions/Session";
export const actions = {
	default: (event: RequestEvent) => {
		if (event.locals.session === null) {
			return fail(401, {
				message: "Not authenticated"
			});
		}
		invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		return redirect(302, "/login");
	}
}