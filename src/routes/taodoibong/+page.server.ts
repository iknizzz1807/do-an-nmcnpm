import type { PageServerLoad, Actions } from "./$types";

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    console.log(data.get("td") + " " + data.get("sn"));
  },
} satisfies Actions;

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;
