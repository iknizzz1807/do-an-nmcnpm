import { eq } from "drizzle-orm";
import { UserTable } from "../schema/User";
import { getRandomUUID } from "$lib/server/utils";
import { db } from "../client";
import { hashPassword } from "$lib/server/auth/password";
import { password as adminPassword } from "$lib/server/secretPassword.json";

export const checkPasswordAdmin = async (password: string) => {
  const passwordHash = await hashPassword(password);
  return (passwordHash === adminPassword);
}

export const loginAdmin = async () => {
  const hasAdmin = (await db.select().from(UserTable).where(eq(UserTable.id, 0))).at(0) ?? null;
  if (hasAdmin === null) {
    await db.insert(UserTable).values({ 
      id: 0, 
      email: getRandomUUID(), 
      username: "Admin", 
      passwordHash: getRandomUUID(), 
      isAdmin: true });
    console.log("Admin chưa tồn tại, tạo admin");
    return (await db.select().from(UserTable).where(eq(UserTable.id, 0))).at(0)!!;
  }
  else {
    return hasAdmin;
  }
}