import type { TypesAreEqual } from "$lib/server/utils";
import type { ThamSo } from "$lib/typesDatabase";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ThamSoTable = sqliteTable("ThamSo", {
  tenThamSo: text().notNull().primaryKey(),
  giaTri: integer().notNull(),
});

export type ThamSoSelectParam = typeof ThamSoTable.$inferSelect; 

const checkType : TypesAreEqual<ThamSoSelectParam, ThamSo> = true;