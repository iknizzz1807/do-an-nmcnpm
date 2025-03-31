// Auth
export type User = {
    id: number;
    email: string;
    username: string;
    isAdmin: boolean;
}

export type Settings = {
    // Cầu thủ
    tuoiMin: number;
    tuoiMax: number;
    soCauThuMin: number;
    soCauThuMax: number;
    soCauThuNuocNgoaiToiDa: number;
    doiDaTrenSanNha: number;
    
    // Bàn thắng
    loaiBanThang: number;
    thoiDiemGhiBanToiDa: number;
    
    // Thẻ phạt
    soThePhatToiDa : number;

    // Điểm bảng xếp hạng
    diemThang : number;
    diemHoa: number;
    diemThua: number;

}

export type Session = {
    id: string;
    userId: number;
    expiresAt: Date;
}