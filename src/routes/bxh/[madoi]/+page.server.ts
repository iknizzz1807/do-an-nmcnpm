import type { PageServerLoad } from "./$types";

export const load : PageServerLoad = async ({ params, fetch }) => {
  try {
    const response = await fetch("/api/bangxephang/" + params.madoi, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
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