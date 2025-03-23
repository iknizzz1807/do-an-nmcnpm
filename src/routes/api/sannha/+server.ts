import { selectAllSanNha } from "$lib/server/db/functions/SanNha";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
  let result = await selectAllSanNha();
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};