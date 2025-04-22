import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const UserRoleTable = sqliteTable("UserRole", {
  roleId: integer().notNull().primaryKey({ autoIncrement: true }),
  roleName: text().notNull(),
  viewablePage: text().notNull(),
  canEdit: integer({ mode:"boolean" }).notNull(),
});

export type UserRoleInsertParams = typeof UserRoleTable.$inferInsert;