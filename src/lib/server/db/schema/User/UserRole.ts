import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { UserAbilityTable } from "./UserAbility";
import { UserGroupTable } from "./UserGroup";

export const UserRoleTable = sqliteTable("UserRole", {
  abilityId: integer().notNull().references(() => UserAbilityTable.abilityId),
  groupId: integer().notNull().references(() => UserGroupTable.groupId),
}, (table) => ([
  primaryKey({ columns: [table.abilityId, table.groupId]})
]));
