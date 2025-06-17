// Database
export type ThamSoBackup = {
  BackupID?: number | undefined;
  modifiedDate: string;
  tenThamSo: string;
  giaTri: number;
};

export type MuaGiaiBackup = {
  
  BackupID?: number | undefined;
  modifiedDate: string;
  maMG: number;
  tenMG: string;
  ngayDienRa: string;
  ngayKetThuc: string;
  imageURL?: string | null | undefined;
};

export type DoiBongBackup = {
  
  BackupID?: number | undefined;
  modifiedDate: string;
  maDoi: number;
  tenDoi: string;
  maSan?: number | null | undefined;
  maMG: number;
  imageURL?: string | null | undefined;

  tenSan?: string | undefined;
  ketQua5TranGanNhat?: ("win" | "lose" | "draw")[] | undefined;
  logoUrl?: string | undefined;
};

export type CauThuBackup = {
  
  BackupID?: number | undefined;
  modifiedDate: string;
  maCT: number;
  tenCT: string;
  ngaySinh: string;
  ghiChu: string;
  soAo: number;
  maLCT?: number | null | undefined;
  maDoi: number;
  imageURL?: string | null | undefined;

  banThang?: number | undefined;
};

export type TrongTaiBackup = {
  
  BackupID?: number | undefined;
  modifiedDate: string;
  maTT: number;
  tenTT: string;
  ngaySinh: string;
  maMG: number;
};

export type ThamGiaDBBackup = {
  
  BackupID?: number | undefined;
  modifiedDate: string;
  maDoi: number;
  maCT: number;
  maMG: number;
};

export type TieuChiXepHangBackup = {
  
  BackupID?: number | undefined;
  modifiedDate: string;
  tenTC: string;
  uuTien: number;
  maTC: number;
}

export type ThamGiaTDBackup = {
  
  BackupID?: number | undefined;
  modifiedDate: string;
  maTD: number;
  maDoi: number;
  maCT: number;
  maVT?: number | null | undefined;
};

export type BanThangBackup = {
  BackupID?: number | undefined;
  modifiedDate: string;
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

export type ThePhatBackup = {
  
  BackupID?: number | undefined;
  modifiedDate: string;
  maTD: number;
  maCT: number;
  thoiDiem: number;
  maLTP: number;
  // Data display
  maDoi?: number | undefined;
  tenCT?: string | undefined;
  tenDoi?: string | undefined;
};

export type LichThiDauBackup = {
  
  BackupID?: number | undefined;
  modifiedDate: string;
  maTD: number;
  maMG: number;
  maVTD?: number | null | undefined;
  maSan?: number | null | undefined;

  doiMot: number;
  doiHai: number;
  doiThang?: number | null | undefined;

  ngayGioDuKien?: string | null | undefined;
  ngayGioThucTe?: string | null | undefined;

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
export type SanNhaBackup = {
  
  BackupID?: number | undefined;
  modifiedDate: string;
  maSan: number;
  tenSan: string;
  diaChi: string;
  maMG: number;
};

export type DiemSoBackup = {
  
  BackupID?: number | undefined;
  modifiedDate: string;
  maDS: number;
  tenDS: string;
  diemSo: number;
};

export type LoaiCTBackup = {
  
  BackupID?: number | undefined;
  modifiedDate: string;
  maLCT: number;
  tenLCT: string;
  soCauThuToiDa: number;
};

export type VongTDBackup = {
  
  BackupID?: number | undefined;
  modifiedDate: string;
  maVTD: number;
  tenVTD: string;
};

export type LoaiBTBackup = {
  
  BackupID?: number | undefined;
  modifiedDate: string;
  maLBT: number;
  tenLBT: string;
  diemBT?: number | undefined;
};

export type LoaiTPBackup = {
  
  BackupID?: number | undefined;
  modifiedDate: string;
  maLTP: number;
  tenLTP: string;
  soThePhatToiDa: number;
};

export type ViTriBackup = {
  
  BackupID?: number | undefined;
  modifiedDate: string;
  maVT: number;
  tenVT: string;
};
