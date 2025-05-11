import { and, eq, getTableColumns, ilike, like } from "drizzle-orm"
import { db } from "../../client";
import { UserRoleTable, type UserRoleInsertParams } from "../../schema/User/UserRole";
import { HasRoleTable } from "../../schema/User/HasRole";
import type { UserRole } from "$lib/typesAuth";

export const selectAllRole = async () => {
  return await db.select().from(UserRoleTable);
}

export const upsertRole = async(data : UserRoleInsertParams) => {
  await db.insert(UserRoleTable).values(data).onConflictDoUpdate({ 
    target: UserRoleTable.roleId,
    set: { roleName: data.roleName, viewablePage: data.viewablePage, canEdit: data.canEdit} });
}

export const checkPageViewable = async (groupId : number, pageName: string) => {
  console.log(pageName);
  const roles = (await db.select(getTableColumns(UserRoleTable)).from(HasRoleTable)
  .innerJoin(UserRoleTable, eq(UserRoleTable.roleId, HasRoleTable.roleId))
  .where(eq(HasRoleTable.groupId, groupId))
  .groupBy(UserRoleTable.roleId));
  for (const role of roles)
    if (pageName.match(role.viewablePage))
      return true;
  return false;
}

export const checkPageEditable = async (groupId : number, pageName: string) => {
  const roles = (await db.select(getTableColumns(UserRoleTable)).from(HasRoleTable)
  .innerJoin(UserRoleTable, eq(UserRoleTable.roleId, HasRoleTable.roleId))
  .where(eq(HasRoleTable.groupId, groupId))
  .groupBy(UserRoleTable.roleId));
  for (const role of roles)
    if (pageName.match(role.viewablePage))
      return role.canEdit;
  return false;
}

export const deleteUserRole = async (roleId : number) => {
  if (roleId === 9999)
    throw new Error("Xóa cái này là ăn l đó con");
  await db.delete(UserRoleTable).where(eq(UserRoleTable.roleId, roleId));
}