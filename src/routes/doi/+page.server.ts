import type { PageServerLoad } from "./$types";

export const load = (async () => {
  // Gửi một get request để lấy danh sách cách các đội bóng(và vài thông tin liên quan nếu có thể)
  return {};
}) satisfies PageServerLoad;
