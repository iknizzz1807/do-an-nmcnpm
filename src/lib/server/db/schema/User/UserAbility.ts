import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const UserAbilityTable = sqliteTable("UserAbility", {
  abilityId: integer().notNull().primaryKey({ autoIncrement: true }),
  abilityName: text().notNull(),
  viewablePage: text().notNull(),
});
