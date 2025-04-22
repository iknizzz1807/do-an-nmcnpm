import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { db } from "../../client";
import { eq } from "drizzle-orm";

export const UserTable = sqliteTable("User", {
	id: integer().primaryKey({ autoIncrement: true }),
	email: text().notNull().unique(),
	username: text().notNull(),
	passwordHash: text().notNull(),
	role: integer().default(0).notNull() // Bitwise and với role UserRole (trong functions có hàm check)
	// emailVerifed: integer().$default(() => 0),
	// registeredTOTP: integer().$default(() => 0),
	// registeredPasskey: integer().$default(() => 0),
	// registeredSecurityKey: integer().$default(() => 0),
	// registered2FA: integer().$default(() => 0)
}, (table) => [
	uniqueIndex("User_id").on(table.id)
]);

export const SessionTable = sqliteTable("Session", {
	id: text().primaryKey(),
	userId: integer().notNull().references(() => UserTable.id),
	expiresAt: integer({mode: "timestamp"}).notNull()
});

export type UserSelect = typeof UserTable.$inferSelect;
export type SessionSelect = typeof SessionTable.$inferSelect;