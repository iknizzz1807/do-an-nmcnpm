// Auth
export type User = {
    id: number;
    email: string;
    username: string;
    role: number;
}

export type UserRole = {
    roleId: number,
    roleName: string,
}

export type Settings = {
    // Cầu thủ
    tuoiMin: number;
    tuoiMax: number;
    soCauThuMin: number;
    soCauThuMax: number;
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