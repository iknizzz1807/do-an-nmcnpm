import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const UserRoleTable = sqliteTable("UserRole", {
  roleId: integer().notNull().primaryKey(),
  roleName: text().notNull(),
});
