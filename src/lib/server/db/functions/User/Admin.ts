import { eq } from "drizzle-orm";
import { getRandomUUID } from "$lib/server/utils";
import { verifyPasswordHash } from "$lib/server/auth/password";
import { password as adminPassword } from "$lib/server/secretPassword.json";
import { UserTable } from "../../schema/User/User";
import { db } from "../../client";

export const checkPasswordAdmin = async (password: string) => {
  return verifyPasswordHash(adminPassword, password);
}

export const loginAdmin = async () => {
  const hasAdmin = (await db.select().from(UserTable).where(eq(UserTable.id, 0))).at(0) ?? null;
  if (hasAdmin === null) {
    console.log("Admin chưa tồn tại, tạo admin");
    return await createAdmin();
  }
  else {
    return hasAdmin;
  }
}

export const createAdmin = async() => {
  await db.insert(UserTable).values({ 
    id: 0, 
    email: getRandomUUID(), 
    username: "Admin", 
    passwordHash: getRandomUUID(), 
    groupId: 0 
  });
  return (await db.select().from(UserTable).where(eq(UserTable.id, 0))).at(0)!!;

}