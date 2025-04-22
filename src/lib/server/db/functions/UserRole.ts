import { eq } from "drizzle-orm"
import { db } from "../client"
import { UserRoleTable } from "../schema/User/UserRole"

// export const selectRole = async (roleId: number) => {
//   return (await db.select().from(UserRoleTable).where(eq(UserRoleTable.roleId, roleId))).at(0)!!;
// }

// export const selectRoleFromName = async (roleName: string) => {
//   return (await db.select().from(UserRoleTable).where(eq(UserRoleTable.roleName, roleName))).at(0)!!;
// }

export const checkRole = async (userRole: number, roleId : number) => {
  return (userRole & (1 << roleId)) != 0;
}