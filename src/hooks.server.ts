
import { errorResponseJSON } from "$lib";
import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from "$lib/server/db/functions/User/Session";
import { checkPageEditable, checkPageViewable } from "$lib/server/db/functions/User/UserRole";
import type { MuaGiai } from "$lib/typesDatabase";
import { error, redirect, type Handle } from "@sveltejs/kit";

const excludedRoutes : String[] = [
	"/login",
	"/",
	"/signup",
	"/loginAdmin",
	"/api/logout",
	""
] 

const isRouteInExcludedRoute = (route: String) : boolean => {
	return excludedRoutes.includes(route);
}

export const handle: Handle = async ({ event, resolve }) => {
  // Handle session for user
	const token = event.cookies.get("session") ?? null;
	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;
		// remove this if it looks like shit bruh
		if (event.url.pathname.startsWith("/api/")) {
			return errorResponseJSON(401, "Unauthorized");
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
	
	if (event.route.id !== null && !isRouteInExcludedRoute(event.route.id)) {
		if (event.locals.user !== null && 
			 	event.route.id !== "/" &&
				(await checkPageViewable(event.locals.user?.groupId!!, event.route.id)) === false) {
				error(401);
			}
	}
  return resolve(event);
};
