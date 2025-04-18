import { db } from "../../client"
import { LoaiCTTable } from "../../schema/Data/LoaiCT"

export const selectLoaiCT = async() => {
  return await db.select().from(LoaiCTTable);
}