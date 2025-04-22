import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const UserGroupTable = sqliteTable("UserGroup", {
  groupId: integer().notNull().primaryKey({ autoIncrement: true }),
  groupName: text().notNull(),
});
