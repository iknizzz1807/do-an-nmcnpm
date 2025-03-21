import type { DoiBong } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch }) => {
  try {
    const response = await fetch("api/doibong", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const danhSachDoiBong: DoiBong[] = await response.json();

    return {
      danhSachDoiBong,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      danhSachDoiBong: [],
    };
  }
}) satisfies PageServerLoad;
