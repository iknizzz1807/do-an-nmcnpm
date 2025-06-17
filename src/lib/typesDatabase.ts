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
  maSan?: number | null | undefined;
  maMG: number;
  imageURL?: string | null | undefined;

  tenSan?: string | undefined;
  diaChi?: string | undefined;
  ketQua5TranGanNhat?: ("win" | "lose" | "draw")[] | undefined;
  logoUrl?: string | undefined;
};

export type CauThu = {
  maCT?: number | undefined;
  tenCT: string;
  ngaySinh: string;
  ghiChu: string;
  soAo: number;
  maLCT?: number | null | undefined;
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

export type TieuChiXepHang = {
    tenTC: string;
    uuTien: number;
    maTC?: number | undefined;
}

export type ThamGiaTD = {
  maTD: number;
  maDoi: number;
  maCT: number;
  maVT?: number | null | undefined;
};

export type BanThang = {
  maTD: number;
  maCT: number;
  thoiDiem: number;
  maLBT?: number | null | undefined;
  // Data display
  maDoi?: number | undefined;
  tenCT?: string | undefined;
  tenDoi?: string | undefined;
  tenLBT?: string | undefined;
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
  maVTD?: number | null | undefined;
  maSan?: number | null | undefined;

  doiMot: number;
  doiHai: number;
  doiThang?: number | null | undefined;

  ngayGioDuKien?: string | undefined;
  ngayGioThucTe?: string | undefined;

  thoiGianDaThiDau: number;
  maTT?: number | null | undefined;

  // Data display
  tenDoiMot?: string | undefined;
  tenDoiHai?: string | undefined;
  tenMG?: string | undefined;
  tenDoiThang?: string | undefined;
  tenSan?: string | undefined;
  tenTT?: string | undefined;
  tenVTD?: string | undefined;
  tiSoDoiMot?: number | undefined;
  tiSoDoiHai?: number | undefined;
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
