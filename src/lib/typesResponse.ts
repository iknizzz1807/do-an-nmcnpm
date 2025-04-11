import type { BanThang, DoiBong, ThePhat } from "./typesDatabase"

// Query Results
export type KetQuaThiDau = {
  doiMot: DoiBong,
  doiHai: DoiBong,
  tySo: string,
  san : string,
  ngayGio: string
}

export type KQTraCuuCauThu = {
  tenCT: string,
  tenDoi: string,
  loaiCT: number,
  tongSoBanThang: number
}

export type BangXepHangNgay = {
  maDoi: number,
  tenDoi: string,
  soTran: number,
  soTranThang: number,
  soTranThua: number,
  soTranHoa: number,
  hieuSo: number,
  hang: number
}

export type CauThuGhiBan = {
  maCT: number;
  maDoi: number;
  tenCT: string;
  tenDoi: string;
  loaiCT: number;
  soBanThang: number;
}

export type UpdateBanThang = {
  oldBanThang?: BanThang | null;
  newBanThang: BanThang;
}
export type UpdateThePhat = {
  oldThePhat?: ThePhat | null;
  newThePhat: ThePhat;
}