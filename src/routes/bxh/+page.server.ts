import type { BangXepHangNgay } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch }) => {
  try {
    const response = await fetch("api/bangxephang/ngay", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const bangXepHangNgay: BangXepHangNgay[] = await response.json();
    console.log(bangXepHangNgay);
    return {
      bangXepHangNgay,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      bangXepHangNgay: [],
    };
  }
}) satisfies PageServerLoad;