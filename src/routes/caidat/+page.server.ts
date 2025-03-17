import { db } from "$lib/server/db/client";
import { SelectSettings } from "$lib/server/db/functions/UserSettings";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  return {
    setting: await SelectSettings()
  };
}) satisfies PageServerLoad;
