import { and, eq, getTableColumns, inArray } from "drizzle-orm";
import { db } from "../../client"
import { HasRoleTable } from "../../schema/User/HasRole";
import { UserGroupTable, type UserGroupInsertParams } from "../../schema/User/UserGroup"
import { UserRoleTable } from "../../schema/User/UserRole";
import type { UserGroupInsert, UserGroupRoles, UserGroupUserRoles } from "$lib/typesResponse";
import { error } from "@sveltejs/kit";

export const selectAllUserGroup = async () => {
  return await db.select().from(UserGroupTable);
}

export const selectUserGroupGroupID = async (groupID: number) => {
  return (await db.select().from(UserGroupTable).where(eq(UserGroupTable.groupId, groupID)).limit(1)).at(0) ?? null;
}

export const upsertGroup = async (group : UserGroupInsertParams) => {
  return (await db.insert(UserGroupTable).values(group)
  .onConflictDoUpdate({
    target: UserGroupTable.groupId,
    set: { groupName: group.groupName }
  })
  .returning({ id: UserGroupTable.groupId })).at(0)!!;
}
export const selectAllUserGroupWithRole = async () : Promise<UserGroupRoles[]> => {
  const groups = await db.select().from(UserGroupTable);
  let groupRoles : UserGroupRoles[] = [];
  for (const group of groups)
  {
    const roles = (await db.select().from(HasRoleTable).where(eq(HasRoleTable.groupId, group.groupId))).flatMap((val) => val.roleId);
    groupRoles.push({
      groupId: group.groupId,
      groupName: group.groupName,
      roles: roles
    });
  }
  return groupRoles
}


export const selectUserGroupWithRole = async (groupId: number) : Promise<UserGroupUserRoles> => {
  const group = (await db.select().from(UserGroupTable).where(eq(UserGroupTable.groupId, groupId))).at(0) ??null;
  if (group === null)
    return ({
    groupId: 0,
    groupName: "",
    roles: []
  });
  console.log(group)
  const roles = (await db.select(getTableColumns(UserRoleTable)).from(HasRoleTable).innerJoin(UserRoleTable, eq(UserRoleTable.roleId, HasRoleTable.roleId)).where(eq(HasRoleTable.groupId, group.groupId)));
  return ({
    groupId: group.groupId,
    groupName: group.groupName,
    roles: roles
  });
}

export const updateRolesToGroup = async(groupId: number, roles: number[]) => {
  if (groupId === 0)
    throw new Error("không thể sửa được");
  let groupRoles = (await db.select().from(HasRoleTable)
    .where(eq(HasRoleTable.groupId, groupId))).flatMap((val) => val.roleId);
  // Update
  let rolesExcluded : number[] = roles.filter(value => !groupRoles.includes(value));

  if (rolesExcluded.length > 0) {
    await db.insert(HasRoleTable).values(rolesExcluded.map(value => ({ groupId: groupId, roleId: value })));
  }
  // Delete
  rolesExcluded = groupRoles.filter(value => !roles.includes(value));

  if (rolesExcluded.length > 0) {
    await db.delete(HasRoleTable).where(and(eq(HasRoleTable.groupId, groupId), inArray(HasRoleTable.roleId, rolesExcluded)));
  }
}

export const deleteUserGroup = async(groupId : number) => {
  if (groupId === 0)
    throw new Error("không thể xóa được");
  await db.delete(UserGroupTable).where(eq(UserGroupTable.groupId, groupId));
}