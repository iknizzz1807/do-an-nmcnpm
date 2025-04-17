import { validateSessionToken } from "$lib/server/db/functions/Session";
import { deleteSessionTokenCookie, setSessionTokenCookie } from "$lib/server/db/functions/Session";
import type { MuaGiai } from "$lib/typesDatabase";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // Handle session for user
	const token = event.cookies.get("session") ?? null;
	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;
		// remove this if it looks like shit bruh
		if (event.url.pathname.startsWith("/api/")) {
			return new Response(JSON.stringify({ error: "Unauthorized" }), {
				status: 401,
				headers: {
					"Content-Type": "application/json"
				}
			})
		}
		else if (!event.url.pathname.includes("/login") && event.url.pathname !== "/signup") {
			return redirect(307, '/login');
		}

		return resolve(event);
	}
	else {
		const { session, user } = await validateSessionToken(token);
		if (session !== null) {
			setSessionTokenCookie(event, token, session.expiresAt);
		} else {
			deleteSessionTokenCookie(event);
		}
	
		event.locals.session = session;
		event.locals.user = user;
	}

	const selectedMuaGiai = event.cookies.get("selectedMuaGiai") ?? null;
	if (selectedMuaGiai === null) {
		event.locals.muaGiai = null;
		if (event.url.pathname !== "/muagiai" &&
				!event.url.pathname.startsWith("/api")) {
				return redirect(307, "/muagiai");		
		}
		return resolve(event);
	}
	else {
		event.locals.muaGiai = JSON.parse(selectedMuaGiai) satisfies MuaGiai;
	}

  return resolve(event);
};
