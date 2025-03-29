import type { DSMuaGiai } from "$lib/typesDatabase.js";
import { redirect, type Actions } from "@sveltejs/kit";

export const POST = async ({ locals, request, cookies }) => {
  try {
    const data = await request.json() satisfies DSMuaGiai;
    cookies.set('selectedMuaGiai', JSON.stringify(data), {
      path: "/",
      sameSite: "lax",
    });
    locals.muaGiai = data;
  }
  catch (err) {
    throw err;
  }
  return new Response(null, { status: 200 });
};