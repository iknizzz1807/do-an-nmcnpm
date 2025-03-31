import { verifyPasswordHash } from "$lib/server/auth/password";
import { Throttler } from "$lib/server/auth/throttler";
import { TokenBucketRateLimit } from "$lib/server/auth/tokenbucket";
import { checkPasswordAdmin, loginAdmin } from "$lib/server/db/functions/Admin";
import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/server/db/functions/Session";
import { selectUserFromEmail, selectUserPasswordHash, verifyEmailInput } from "$lib/server/db/functions/User";
import { redirect } from "@sveltejs/kit";
import { fail, type Actions } from "@sveltejs/kit"

// Limit Retry request
const throttler = new Throttler<number>([0, 1, 2, 4, 8, 16, 30, 60, 180, 300]);
// Ratelimit
const ipBucket = new TokenBucketRateLimit<string>(20, 1);

export const actions : Actions =  {
  default: async (event) => {
    // TODO: Assumes X-Forwarded-For is always included.
    const clientIP = event.getClientAddress();
    if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
      return fail(429, {
        message: "Too many requests",
        email: ""
      });
    }

    const formData = await event.request.formData();
    const password = formData.get("password");
    if (typeof password !== "string") {
      return fail(400, {
        message: "Invalid or missing fields",
        email: ""
      })
    }
    if (password === "") {
      return fail(400, {
        message: "Invalid or missing fields",
        email: ""
      })
    }
    
    if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
      return fail(429, {
        message: "Too many requests",
        email: ""
      })
    }

    const validPassword = await checkPasswordAdmin(password);
    if (!validPassword) {
      return fail(400, {
        message: "Invalid password",
      });
    }
    const user = await loginAdmin();

	  throttler.reset(user.id);
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
    return redirect(302, "/");
  }
}