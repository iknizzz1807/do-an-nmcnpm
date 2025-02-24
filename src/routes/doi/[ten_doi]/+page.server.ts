import type { CauThu } from "$lib/types";
import type { PageServerLoad } from "./$types";

function formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export const load = (async ({ params }) => {
  // const danhSachCauThu = await getDanhSachCauThu(params.ten_doi);
  // Cái này là data giả để mô phỏng data thật được get request từ danh sách các cầu thủ của một đội bóng
  const danhSachCauThuMU: CauThu[] = [
    {
      maCT: 4321894745,
      tenCT: "Bruno Fernades",
      ngaySinh: new Date("10-2-2001"),
      loaiCT: 0,
      nuocNgoai: 0,
      ghiChu: "Chuyên phất bậy",
    },
    {
      maCT: 905634803,
      tenCT: "Garnacho",
      ngaySinh: new Date("10-2-2001"),
      loaiCT: 0,
      nuocNgoai: 0,
      ghiChu: "Đá ngu vc",
    },
  ];
  const danhSachCauThuMC: CauThu[] = [
    {
      maCT: 7546754676,
      tenCT: "Kevin De Bruyne",
      ngaySinh: new Date("10-2-2001"),
      loaiCT: 0,
      nuocNgoai: 0,
      ghiChu: "Chuyền hay vc",
    },
    {
      maCT: 92998043,
      tenCT: "Rodri",
      ngaySinh: new Date("10-2-2001"),
      loaiCT: 0,
      nuocNgoai: 0,
      ghiChu: "Chia bài tuyến giữa đỉnh vc",
    },
  ];

  let danhSachCauThuTraVe: CauThu[];

  // Hard coded data

  if (params.ten_doi === "mancity") danhSachCauThuTraVe = danhSachCauThuMC;
  else if (params.ten_doi === "mu") danhSachCauThuTraVe = danhSachCauThuMU;
  else danhSachCauThuTraVe = [];

  return { danhSachCauThuTraVe, ten_doi: params.ten_doi };
}) satisfies PageServerLoad;
