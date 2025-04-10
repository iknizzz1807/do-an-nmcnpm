import { updateSettings } from "$lib/server/db/functions/ThamSo";
import type { Settings } from "$lib/typesAuth";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const data : Settings = await request.json();
  await updateSettings(data);
  return new Response(null, {
    status: 200
  });
}