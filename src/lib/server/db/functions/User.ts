import { hashPassword } from "$lib/server/auth/password";
import type { User } from "$lib/types";
import { eq } from "drizzle-orm";
import { db } from "../client";
import { UserTable, type UserSelect } from "../schema/User";

export const verifyUsernameInput = (userName: string) : boolean => {
  return userName.length > 3 && userName.length < 32 && userName.trim() == userName;
}

export const verifyEmailInput = (email: string): boolean => {
	return /^.+@.+\..+$/.test(email) && email.length < 256;
}

export const checkEmailAvailability = async (email: string) => {
	const row = await db.$count(UserTable, eq(UserTable.email, email));
	return row === 0;
}

export const createUser = async (email: string, username: string, password: string) : Promise<User> => {
  const passwordHash = await hashPassword(password);
  const ids = await db.insert(UserTable).values({
    email: email,
    username: username,
    passwordHash: passwordHash
  }).returning({ id : UserTable.id });
  const userId = ids.at(0) ?? null;
  if (userId === null)
    throw new Error("Error while creating User");
  return {
    id: userId.id,
    username: username,
    email: email,
  } satisfies User;
}

export const updateUserPassword = async (userId: number, password: string) : Promise<void> => {
  const passwordHash = await hashPassword(password);
  await db.update(UserTable).set({ passwordHash: passwordHash }).where(eq(UserTable.id, userId));
}

export const selectUserPasswordHash = async (userId: number) => {
  const user = (await db.select({ passwordHash: UserTable.passwordHash }).from(UserTable).where(eq(UserTable.id, userId))).at(0) ?? null;
  if (user === null)
    throw new Error("Invalid userId");
  return user.passwordHash;
}

export const selectUserFromEmail = async (email : string) => {
  return (await db.select().from(UserTable).where(eq(UserTable.email, email))).at(0) ?? null;
}