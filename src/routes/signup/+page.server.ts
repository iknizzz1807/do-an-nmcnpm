import { verifyPasswordHash } from "$lib/server/auth/password";
import { Throttler } from "$lib/server/auth/throttler";
import { TokenBucketRateLimit } from "$lib/server/auth/tokenbucket";
import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/server/db/functions/Session";
import { createUser, selectUserFromEmail, selectUserPasswordHash, verifyEmailInput } from "$lib/server/db/functions/User";
import { redirect } from "@sveltejs/kit";
import { fail, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types";

// Ratelimit
const ipBucket = new TokenBucketRateLimit<string>(10, 1);

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user !== null && locals.session !== null)
    redirect(302, "/");
  return {};
}

export const actions : Actions =  {
  default: async (event) => {
    // TODO: Assumes X-Forwarded-For is always included.
    const clientIP = event.getClientAddress();
    if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
      return fail(429, {
        message: "Too many requests",
        email: ""
      });
    }

    const formData = await event.request.formData();
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    if (typeof email !== "string" || typeof password !== "string" || typeof username !== "string") {
      return fail(400, {
        message: "Invalid or missing fields",
        email: ""
      })
    }
    if (email === "" || password === "" || username === "") {
      return fail(400, {
        message: "Invalid or missing fields",
        email: ""
      })
    }
    if (!verifyEmailInput(email)) {
      return fail(400, {
        message: "Invalid email",
        email: ""
      })
    }
    const checkExistsUser = await selectUserFromEmail(email);
    if (checkExistsUser !== null) {
      return fail(400, {
        message: "Đã có user sử dụng email này rồi",
        email: ""
      })
    }
  
    const user = await createUser(email, username, password);
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
    return redirect(302, "/");
  }
}