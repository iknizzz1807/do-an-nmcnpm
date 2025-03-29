import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const UserTable = sqliteTable("User", {
	id: integer().primaryKey({ autoIncrement: true }),
	email: text().notNull().unique(),
	username: text().notNull(),
	passwordHash: text().notNull()
	// emailVerifed: integer().$default(() => 0),
	// registeredTOTP: integer().$default(() => 0),
	// registeredPasskey: integer().$default(() => 0),
	// registeredSecurityKey: integer().$default(() => 0),
	// registered2FA: integer().$default(() => 0)
});

export const SessionTable = sqliteTable("Session", {
	id: text().primaryKey(),
	userId: integer().notNull().references(() => UserTable.id),
	expiresAt: integer({mode: "timestamp"}).notNull()
});

export type UserSelect = typeof UserTable.$inferSelect;
export type SessionSelect = typeof SessionTable.$inferSelect;