import type { DSMuaGiai } from "$lib/types.js";
import { redirect, type Actions } from "@sveltejs/kit";

export const POST = async ({ locals, request, cookies }) => {
  try {
    const data = await request.json() satisfies DSMuaGiai;
    cookies.set('selectedMuaGiai', JSON.stringify(data), {
      path: "/",
      sameSite: "lax",
    });
    locals.muaGiai = data;
    redirect(303, '/');
  }
  catch (err) {
    throw err;
  }
  return new Response(null, { status: 200 });
};