import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  return {
    setting: locals.setting
  };
}) satisfies PageServerLoad;
