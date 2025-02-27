import { verifyPasswordHash } from "$lib/server/auth/password";
import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/server/db/functions/Session";
import { selectUserFromEmail, selectUserPasswordHash, verifyEmailInput } from "$lib/server/db/functions/User";
import { redirect } from "@sveltejs/kit";
import { fail, type Actions } from "@sveltejs/kit"

export const actions : Actions =  {
  default: async (event) => {
    // const clientIP = event.request.headers.get("X-Forwarded-For");
    const formData = await event.request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    if (typeof email !== "string" || typeof password !== "string") {
      return fail(400, {
        message: "Invalid or missing fields",
        email: ""
      })
    }
    if (email === "" || password === "") {
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
    
    const user = await selectUserFromEmail(email);
    if (user === null) {
      return fail(400, {
        message: "Account does not exist",
        email
      });
    }
    const passwordHash = await selectUserPasswordHash(user.id);
    const validPassword = await verifyPasswordHash(passwordHash, password);
    if (!validPassword) {
      return fail(400, {
        message: "Invalid password",
        email
      });
    }
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
    return redirect(302, "/");
  }
}