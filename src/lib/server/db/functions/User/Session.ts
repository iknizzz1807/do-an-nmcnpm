import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { eq } from "drizzle-orm"
import type { RequestEvent } from "@sveltejs/kit";
import { SessionTable, UserTable, type SessionSelect, type UserSelect } from "../../schema/User/User";
import { db } from "../../client";


const expiredTime : number = 1000 * 60 * 60 * 24 * 30; // 30 days;

export const generateSessionToken = (): string => {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export const createSession = async (token: string, userId: number): Promise<SessionSelect> => {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: SessionSelect = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + expiredTime)
	};
	await db.insert(SessionTable).values(session);
	return session;
}

/*
Sessions are validated in 2 steps:

Does the session exist in your database?
Is it still within expiration?
*/
export const validateSessionToken = async(token: string): Promise<SessionValidationResult> => {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await db
		.select({ user: UserTable, session: SessionTable })
		.from(SessionTable)
		.innerJoin(UserTable, eq(SessionTable.userId, UserTable.id))
		.where(eq(SessionTable.id, sessionId));

	if (result.length == 0) {
		return { session: null, user: null };
	}

	const { user, session } = result[0];
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(SessionTable).where(eq(SessionTable.id, session.id));
		return { session: null, user: null };
	}

	// If expiresAt is less than 15days update to 30days
	if (Date.now() >= session.expiresAt.getTime() - expiredTime / 2) {
		session.expiresAt = new Date(Date.now() + expiredTime);
		await db
			.update(SessionTable)
			.set({
				expiresAt: session.expiresAt
			})
			.where(eq(SessionTable.id, session.id));
	}
	return { session, user };
}

export const invalidateSession = async(sessionId: string): Promise<void> => {
	await db.delete(SessionTable).where(eq(SessionTable.id, sessionId));
}

export const invalidateAllSessions = async(userId: number): Promise<void> => {
	await db.delete(SessionTable).where(eq(SessionTable.userId, userId));
}

// CSRF protection
export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set("session", token, {
		httpOnly: true,
		sameSite: "lax",
		expires: expiresAt,
		path: "/"
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set("session", "", {
		httpOnly: true,
		sameSite: "lax",
		maxAge: 0,
		path: "/"
	});
}

export type SessionValidationResult =
	| { session: SessionSelect; user: UserSelect }
	| { session: null; user: null };