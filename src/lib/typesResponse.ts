import type { UserRole } from "./typesAuth";
import type { BanThang, DoiBong, ThePhat } from "./typesDatabase"

// Query Results

export type KetQuaThiDau = {
  doiMot: DoiBong,
  doiHai: DoiBong,
  tySo: string,
  san : string,
  ngayGio: string
}

export type UserGroupInsert = {
  groupId?: number | null;
  groupName: string;
  roles: number[];
};

export type UserGroupRoles = {
  groupId: number,
  groupName: string,
  roles: number[],
}


export type UserGroupUserRoles = {
  groupId: number,
  groupName: string,
  roles: UserRole[],
}


export type KQTraCuuCauThu = {
  tenCT: string,
  tenDoi: string,
  maLCT: number,
  tongSoBanThang: number
}

export type BangXepHangNgay = {
  maDoi: number,
  tenDoi: string,
  soTran: number,
  soTranThang: number,
  soTranThua: number,
  soTranHoa: number,
  diem: number,
  hieuSo: number,
  hang: number,
}

export type CauThuGhiBan = {
  maCT: number;
  tenCT: string;
  maDoi: number;
  tenDoi: string;
  maLCT: number | null;
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