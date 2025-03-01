import { fail, redirect, type RequestEvent } from "@sveltejs/kit";
import type { PageServerLoad } from "./bxh/$types";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/db/functions/Session";


export const load : PageServerLoad = async(event) => {
	// if (event.locals.session === null || event.locals.user === null) {
	// 	return redirect(302, "/login");
	// }
	// if (!event.locals.user.emailVerified) {
	// 	return redirect(302, "/verify-email");
	// }
	// if (!event.locals.user.registered2FA) {
	// 	return redirect(302, "/2fa/setup");
	// }
	// if (!event.locals.session.twoFactorVerified) {
	// 	return redirect(302, get2FARedirect(event.locals.user));
	// }
	return {
		user: event.locals.user
	};
}
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