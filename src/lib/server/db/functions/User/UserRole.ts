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
  const role = (await db.select(getTableColumns(UserRoleTable)).from(HasRoleTable)
    .innerJoin(UserRoleTable, eq(UserRoleTable.roleId, HasRoleTable.roleId))
    .where(and(eq(HasRoleTable.groupId, groupId), like(UserRoleTable.viewablePage, pageName)))
    .groupBy(UserRoleTable.roleId)
    .limit(1)).at(0) ?? null;
  if (role === null)
    return false;
  return role.canEdit;
}