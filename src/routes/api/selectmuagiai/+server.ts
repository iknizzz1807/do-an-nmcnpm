import type { MuaGiai } from "$lib/typesDatabase.js";
import { redirect, type Actions } from "@sveltejs/kit";

export const POST = async ({ locals, request, cookies }) => {
  try {
    const data = await request.json() satisfies MuaGiai;
    cookies.set("selectedMuaGiai", JSON.stringify(data), {
      path: "/",
      sameSite: "lax",
    });
    
    console.log(data);
    locals.muaGiai = data;
  }
  catch (err) {
    throw err;
  }
  return new Response(JSON.stringify({ muaGiai: locals.muaGiai }), { status: 200 });
};