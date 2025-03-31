import { selectAllUser } from "$lib/server/db/functions/User";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  return {
    setting: locals.setting,
    users: await selectAllUser(),
  };
}) satisfies PageServerLoad;
