export interface User {
  id: number;
  username: string;
}

export interface DoiBong {
  maDoi: string;
  tenDoi: string;
  sanNha: string;
}

export interface CauThu {
  maCT: string;
  tenCT: string;
  ngaySinh: Date;
  loaiCT: number;
  ghiChu: string;
}

export interface DSMuaGiai {
  maMG: number;
  tenMG: string;
}

export interface ThamGiaDB {
  maDoi: string;
  maCT: string;
  maMG: number;
}

export interface LichThiDau {
  maTD: string;
  doiMot: string;
  doiHai: string;
  ngayGio: Date;
  vongThiDau: number;
  maMG: number;
  doiThang: string;
}

export interface BanThang {
  maTD: string;
  maCT: string;
  thoiDiem: number;
  maDoi: string;
  loaiBanThang: string;
}