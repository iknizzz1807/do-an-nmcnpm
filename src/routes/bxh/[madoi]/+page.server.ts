import type { PageServerLoad } from "./$types";

export const load : PageServerLoad = async ({ params, fetch }) => {
  try {
    const response = await fetch("/api/bangxephang/" + params.madoi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ dateBXH: new Date("2025-03-25") })
    });

    if (!response.ok) {
      throw new Error("Không thể load data");
    }

    return {
      dsCTGhiBan: await response.json(),
    }

  } catch (e) {
    throw e;
  }
}