// Database
export type ThamSo = {
    key: string,
    value: number,
}

export type MuaGiai = {
    maMG?: number | undefined;
    tenMG: string;
    ngayDienRa: string;
    ngayKetThuc: string;
}

export type DoiBong = {
    maDoi?: number | undefined;
    tenDoi: string;
    maSan: number;
    tenSan?: string | undefined;
}

export type CauThu = {
    maCT?: number | undefined;
    tenCT: string;
    maLCT: number;
    ghiChu: string;
    nuocNgoai: boolean;
    ngaySinh: string;
    banThang?: number | undefined;
}

export type ThamGiaDB = {
    maDoi: number;
    maCT: number;
    maMG: number;
}

export type ThamGiaTD = {
    maTD: number;
    maDoi: number;
    maCT: number;
    maVT: number;
};

export type BanThang = {
    maTD: number;
    maCT: number;
    maDoi: number;
    thoiDiem: number;
    loaiBanThang: string;
    // Data display
    tenCT?: string | undefined;
    tenDoi?: string | undefined;
}

export type ThePhat = {
    maTD: number;
    maDoi: number;
    maCT: number;
    thoiDiem: number;
    loaiThe: string;
    // Data display
    tenCT?: string | undefined;
    tenDoi?: string | undefined;
}

export type LichThiDau = {
    doiMot: number;
    doiHai: number;
    maVTD: number;
    maMG: number;
    maSan: number,
    doiThang?: number | null | undefined;
    maTD?: number | undefined;
    // Data display
    ngayGio?: string | undefined;
    tenDoiMot?: string | undefined;
    tenDoiHai?: string | undefined;
    tenMG?: string | undefined;
    tenDoiThang?: string | undefined;
}

// DATA
export type SanNha = {
    maSan?: number | undefined;
    tenSan: string;
    diaChi: string;
}

export type LoaiCT = {
    maLCT?: number | undefined;
    tenLCT: string;
    soCauThuToiDa: number;
}

export type VongTD = {
    maVTD?: number | undefined;
    tenVTD: string;

}

export type LoaiBT = {
    maLBT?: number | undefined;
    tenLBT: string;
}

export type LoaiTP = {
    maLTP?: number | undefined;
    tenLTP: string;
}

export type ViTri = {
    maVT?: number | undefined;
    tenVT: string;
}