import type { LichThiDau } from "$lib/types";
import type { PageServerLoad } from "./$types";


export const load = (async ({ fetch }) => {
  try {
    const response = await fetch("/api/lichthidau", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const danhSachLTD: LichThiDau[] = await response.json();

    return {
      danhSachLTD,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      danhSachLTD: [],
    };
  }
}) satisfies PageServerLoad;