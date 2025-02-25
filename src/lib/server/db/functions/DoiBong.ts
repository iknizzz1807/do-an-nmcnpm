import { ilike, eq } from "drizzle-orm";
import { db } from "../client";
import { DoiBongTable } from "../schema/DoiBong";
import type { DoiBong } from "$lib/types";

export const insertDoiBong = async (...doiBong: DoiBong[]) => {
  let returning = await db
    .insert(DoiBongTable)
    .values(doiBong)
    .returning({ id: DoiBongTable.maDoi });
  if (returning === null || returning.length === 0)
    throw new Error("Lỗi thêm mới đội bóng: Không thể thêm mới");
  return returning;
};

export const selectAllDoiBong = async () => {
  return (await db.select().from(DoiBongTable)) satisfies DoiBong[];
};

export const selectDoiBongTen = async (tenDoi: string) => {
  return (await db
    .select()
    .from(DoiBongTable)
    .where(ilike(DoiBongTable.tenDoi, "%" + tenDoi + "%"))) satisfies DoiBong[];
};

export const selectDoiBongTenTrung = async (tenDoi: string) => {
  const returning = await db
    .select({ maDoi: DoiBongTable.maDoi })
    .from(DoiBongTable)
    .where(eq(DoiBongTable.tenDoi, tenDoi));

  return Number(returning.at(0));
  // return (
  //   await db
  //     .select({ maDoi: DoiBongTable.maDoi })
  //     .from(DoiBongTable)
  //     .where(eq(DoiBongTable.tenDoi, tenDoi))
  // ).at(0);
};
