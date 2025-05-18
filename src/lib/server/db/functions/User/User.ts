import { hashPassword } from "$lib/server/auth/password";
import { eq } from "drizzle-orm";
import type { User } from "$lib/typesAuth";
import { UserTable } from "../../schema/User/User";
import { db } from "../../client";

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
    passwordHash: passwordHash,
  }).returning();
  const userId = ids.at(0) ?? null;
  if (userId === null)
    throw new Error("Không thể tạo user");
  return userId satisfies User;
}

export const updateUserPassword = async (userId: number, password: string) : Promise<void> => {
  const passwordHash = await hashPassword(password);
  await db.update(UserTable).set({ passwordHash: passwordHash }).where(eq(UserTable.id, userId));
}

export const updateUser = async(user: User) => {
  await db.update(UserTable)
    .set({ username: user.username, email: user.email, groupId: user.groupId }).where(eq(UserTable.id, user.id));
}

export const selectUserPasswordHash = async (userId: number) => {
  const user = (await db.select({ passwordHash: UserTable.passwordHash })
    .from(UserTable)
    .where(eq(UserTable.id, userId)).limit(1)).at(0) ?? null;
  if (user === null)
    throw new Error("Invalid userId");
  return user.passwordHash;
}

export const selectUserFromEmail = async (email : string) => {
  return (await db.select().from(UserTable).where(eq(UserTable.email, email)).limit(1)).at(0) ?? null;
}

export const selectUserFromUsername = async (username : string) => {
  return (await db.select().from(UserTable).where(eq(UserTable.username, username)).limit(1)).at(0) ?? null;
}

export const selectAllUser = async() => {
  let result = (await db.select().from(UserTable))
    .map((user) => { 
      return ({ id: user.id, username: user.username, email: user.email, groupId: user.groupId } satisfies User) 
    });
  // Remove admin from Profile edit
  const first = result.at(0) ?? null;
  if (first !== null && first.id === 0)
    result.splice(0, 1);
  return result;
}

export const deleteUser = async (userId : number) => {
  if (userId === 0)
    throw new Error("Xóa cái này là ăn lồn đó con");
  await db.delete(UserTable).where(eq(UserTable.id, userId));
}