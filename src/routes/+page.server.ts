import { fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/db/functions/Session";