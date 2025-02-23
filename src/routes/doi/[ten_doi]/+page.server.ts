import type { PageServerLoad } from "./$types";

type ThongTinCauThu = {
  maCauThu: string;
  tenCauThu: string;
  ngaySinh: string;
  loaiCauThu: string;
  ghiChu: string;
};

export const load = (async ({ params }) => {
  // const danhSachCauThu = await getDanhSachCauThu(params.ten_doi);
  // Cái này là data giả để mô phỏng data thật được get request từ danh sách các cầu thủ của một đội bóng
  const danhSachCauThuMU: ThongTinCauThu[] = [
    {
      maCauThu: "4321894745",
      tenCauThu: "Bruno Fernades",
      ngaySinh: "10-2-2001",
      loaiCauThu: "Tiền vệ tấn công",
      ghiChu: "Chuyên phất bậy",
    },
    {
      maCauThu: "905634803",
      tenCauThu: "Garnacho",
      ngaySinh: "10-2-2001",
      loaiCauThu: "Tiền đạo cánh trái",
      ghiChu: "Đá ngu vc",
    },
  ];
  const danhSachCauThuMC: ThongTinCauThu[] = [
    {
      maCauThu: "7546754676",
      tenCauThu: "Kevin De Bruyne",
      ngaySinh: "10-2-2001",
      loaiCauThu: "Tiền vệ tấn công",
      ghiChu: "Chuyền hay vc",
    },
    {
      maCauThu: "092998043",
      tenCauThu: "Rodri",
      ngaySinh: "10-2-2001",
      loaiCauThu: "Tiền vệ phòng ngự",
      ghiChu: "Chia bài tuyến giữa đỉnh vc",
    },
  ];

  let danhSachCauThuTraVe: ThongTinCauThu[] =
    params.ten_doi === "mancity" ? danhSachCauThuMC : danhSachCauThuMU;

  return { danhSachCauThuTraVe };
}) satisfies PageServerLoad;
