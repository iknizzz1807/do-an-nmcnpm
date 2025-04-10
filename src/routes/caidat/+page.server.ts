import { selectSettings } from "$lib/server/db/functions/ThamSo";
import { selectAllUser } from "$lib/server/db/functions/User";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  
  return {
    setting: await selectSettings(),
    users: await selectAllUser(),
  };
}) satisfies PageServerLoad;
