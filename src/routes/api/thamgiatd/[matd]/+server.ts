import { errorResponseJSON, isNumber } from "$lib";
import { deleteThamGiaTD, insertThamGiaTD, upsertThamGiaTD } from "$lib/server/db/functions/ThamGiaTD";
import type { ThamGiaTD } from "$lib/typesDatabase";
import type { RequestHandler } from "./$types";

export const POST : RequestHandler = async ({ params, locals, request }) => {
  const data = await request.json();

  const maTD = parseInt(params.matd);
  try {

    if (!isNumber(maTD))
      throw new Error("matd param không đúng");
    if (!(data satisfies ThamGiaTD[]))
      throw new Error("data không thỏa mãn");
    console.log("ThamGiaTD data: ", data);
    await deleteThamGiaTD(maTD);
    await upsertThamGiaTD(...data);
  } catch (err) {
    if (err instanceof Error)
      return errorResponseJSON(400, err.message);
    throw err;
  }
  
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}