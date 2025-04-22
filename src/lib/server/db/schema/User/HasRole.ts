import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { UserRoleTable } from "./UserRole";
import { UserGroupTable } from "./UserGroup";

export const HasRoleTable = sqliteTable("HasRole", {
  roleId: integer().notNull().references(() => UserRoleTable.roleId),
  groupId: integer().notNull().references(() => UserGroupTable.groupId),
}, (table) => ([
  primaryKey({ columns: [table.roleId, table.groupId]})
]));

export type HasRoleInsertParams = typeof HasRoleTable.$inferInsert;