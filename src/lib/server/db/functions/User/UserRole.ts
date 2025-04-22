import { and, eq, getTableColumns } from "drizzle-orm"
import { db } from "../../client";
import { UserRoleTable } from "../../schema/User/UserRole";
import { HasRoleTable } from "../../schema/User/HasRole";

export const checkPageViewable = async (groupId : number, pageName: string) => {
  return (await db.select().from(HasRoleTable)
    .innerJoin(UserRoleTable, eq(UserRoleTable.roleId, HasRoleTable.roleId))
    .where(and(eq(HasRoleTable.groupId, groupId), eq(UserRoleTable.viewablePage, pageName))).limit(1)).length != 0;
}

export const checkPageEditable = async (groupId : number, pageName: string) => {
  const role = (await db.select(getTableColumns(UserRoleTable)).from(HasRoleTable)
    .innerJoin(UserRoleTable, eq(UserRoleTable.roleId, HasRoleTable.roleId))
    .where(and(eq(HasRoleTable.groupId, groupId), eq(UserRoleTable.viewablePage, pageName)))
    .groupBy(UserRoleTable.roleId)
    .limit(1)).at(0) ?? null;
  if (role === null)
    return false;
  return role.canEdit;
}