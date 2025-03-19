import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { db } from "../client";
import { sql } from "drizzle-orm";
import type { TypesAreEqual } from "$lib/server/utils";
import type { Settings } from "$lib/types";

const DefaultSetting = {
  "tuoiMin": 16,
  "tuoiMax": 40,
  "soCauThuMin": 15,
  "soCauThuMax": 25,
  "soCauThuNuocNgoaiToiDa": 5,
  "doiDaTrenSanNha": 2,
  
  "loaiBanThang": 1,
  "thoiDiemGhiBanToiDa": 90,
  
  "soThePhatToiDa" : 5,

  "diemThang" : 3,
  "diemHoa": 1,
  "diemThua": 0
};

const checkType : TypesAreEqual<typeof DefaultSetting, Settings> = true;

export const UserSettingsTable = sqliteTable('UserSettings', {
  setting: text({ mode: "json" }).$defaultFn(() => DefaultSetting)
})

export const createDefaultSetting = async () => {
  await db.insert(UserSettingsTable).values({ setting: DefaultSetting });
}

const createUserSettingTrigger = async () => {
  await db.transaction(async (tx) => {
    tx.run(sql`
      CREATE TRIGGER IF NOT EXISTS TRGI_US_PREVENT
      AFTER INSERT ON UserSettings 
      WHEN NOT EXISTS(SELECT 1 FROM UserSettings)
      BEGIN
        SELECT RAISE(ABORT, 'PLEASE IGNORE THIS!!! THIS IS OK!!!: UserSettings table can only have 1 column');
      END;
      `);
    const first = (await tx.select().from(UserSettingsTable).limit(1)).at(0) ?? null;
    console.log(first);
    if (first === null) {
      await tx.insert(UserSettingsTable).values({ setting: DefaultSetting });
    }
  })
}

createUserSettingTrigger()//.catch(console.error);