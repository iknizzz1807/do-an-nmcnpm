// Database
export type ThamSo = {
  tenThamSo: string;
  giaTri: number;
};

export type MuaGiai = {
  maMG?: number | undefined;
  tenMG: string;
  ngayDienRa: string;
  ngayKetThuc: string;
  imageURL?: string | null | undefined;
};

export type DoiBong = {
  maDoi?: number | undefined;
  tenDoi: string;
  maSan: number;
  maMG: number;
  imageURL?: string | null | undefined;
  tenSan?: string | undefined;
  ketQua5TranGanNhat?: ("win" | "lose")[] | undefined;
  logoUrl?: string | undefined;
};

export type CauThu = {
  maCT?: number | undefined;
  tenCT: string;
  ngaySinh: string;
  ghiChu: string;
  soAo: number;
  maLCT: number;
  maDoi: number;
  imageURL?: string | null | undefined;

  banThang?: number | undefined;
};

export type TrongTai = {
  maTT?: number | undefined;
  tenTT: string;
  ngaySinh: string;
  maMG: number;
};

export type ThamGiaDB = {
  maDoi: number;
  maCT: number;
  maMG: number;
};

export type ThamGiaTD = {
  maTD: number;
  maDoi: number;
  maCT: number;
  maVT: number;
};

export type BanThang = {
  maTD: number;
  maCT: number;
  thoiDiem: number;
  maLBT: number;
  // Data display
  maDoi?: number | undefined;
  tenCT?: string | undefined;
  tenDoi?: string | undefined;
};

export type ThePhat = {
  maTD: number;
  maCT: number;
  thoiDiem: number;
  maLTP: number;
  // Data display
  maDoi?: number | undefined;
  tenCT?: string | undefined;
  tenDoi?: string | undefined;
};

export type LichThiDau = {
  maTD?: number | undefined;
  maMG: number;
  maVTD: number;
  maSan: number;

  doiMot: number;
  doiHai: number;
  doiThang?: number | null | undefined;

  ngayGioDuKien?: string | undefined;
  ngayGioThucTe?: string | undefined;

  thoiGianDaThiDau: number;
  maTT: number;

  // Data display
  tenDoiMot?: string | undefined;
  tenDoiHai?: string | undefined;
  tenMG?: string | undefined;
  tenDoiThang?: string | undefined;
  tenVTD?: string | undefined;
};

// DATA
export type SanNha = {
  maSan?: number | undefined;
  tenSan: string;
  diaChi: string;
  maMG: number;
};

export type DiemSo = {
  maDS?: number | undefined;
  tenDS: string;
  diemSo: number;
};

export type LoaiCT = {
  maLCT?: number | undefined;
  tenLCT: string;
  soCauThuToiDa: number;
};

export type VongTD = {
  maVTD?: number | undefined;
  tenVTD: string;
};

export type LoaiBT = {
  maLBT?: number | undefined;
  tenLBT: string;
  diemBT?: number | undefined;
};

export type LoaiTP = {
  maLTP?: number | undefined;
  tenLTP: string;
  soThePhatToiDa: number;
};

export type ViTri = {
  maVT?: number | undefined;
  tenVT: string;
};
