import type { Settings } from "$lib/types";
import { db } from "../client";
import { createDefaultSetting, UserSettingsTable } from "../schema/UserSettings"

export const SelectSettings : any = async ()  => {
  const result = ((await db.select().from(UserSettingsTable).limit(1)).at(0)) ?? null;
  if (result === null) {
    createDefaultSetting();
    console.error('Không có setting nào trong đây hết wtf. Create một setting mới, Refresh lại');
    return await SelectSettings();
  }
  return result.setting;
}

export const UpdateSettings = async(setting: Settings) => {
  await db.update(UserSettingsTable).set({ setting: setting }).limit(1);
}