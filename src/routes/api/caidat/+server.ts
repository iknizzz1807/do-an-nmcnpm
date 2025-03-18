import type { Settings } from "$lib/types";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const data : Settings = await request.json();
  console.log(data);
  return new Response(null, {
    status: 200
  });
}