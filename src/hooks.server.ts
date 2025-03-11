import { validateSessionToken } from "$lib/server/db/functions/Session";
import { deleteSessionTokenCookie, setSessionTokenCookie } from "$lib/server/db/functions/Session";
import type { DSMuaGiai } from "$lib/types";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // Handle session for user
	const token = event.cookies.get("session") ?? null;
	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;
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
	if (selectedMuaGiai == null) {
		event.locals.muaGiai = null;
	}
	else {
		event.locals.muaGiai = JSON.parse(selectedMuaGiai) satisfies DSMuaGiai;
	}
	
  return resolve(event);
};
