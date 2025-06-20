<p align="center">
  <a href="https://www.uit.edu.vn/" title="Trường Đại học Công nghệ Thông tin" style="border: none;">
    <img src="https://i.imgur.com/WmMnSRt.png" alt="Trường Đại học Công nghệ Thông tin | University of Information Technology">
  </a>
</p>

<h1 align="center"><b>SE.104 - NHẬP MÔN CÔNG NGHỆ PHẦN MỀM</b></h>

# GIỚI THIỆU MÔN HỌC

- **Tên môn học:** NHẬP MÔN CÔNG NGHỆ PHẦN MỀM.
- **Mã môn học:** SE.104.
- **Năm học:** HK2 (2024 - 2025).
- **Giảng viên**: Đỗ Thị Thanh Tuyền.

# Hệ Thống Quản Lý Giải Bóng Đá

## Giới thiệu

Đây là một ứng dụng web quản lý giải bóng đá được phát triển bằng **SvelteKit** để phục vụ làm đồ án cho môn học **SE.104 Nhập Môn Công Nghệ Phần Mềm** tại **UIT**. Hệ thống cho phép quản lý toàn diện các khía cạnh của một giải bóng đá, bao gồm quản lý đội bóng, cầu thủ, trận đấu, sân vận động và nhiều tính năng khác.

---

## Thành viên nhóm

| Họ tên                 | Link GitHub                                                      | Mã số sinh viên |                                                       |
| ---------------------- | ---------------------------------------------------------------- | --------------- |-------------------------------------------------------|
| Nguyễn Mỹ Thống        | [github.com/iknizzz1807](https://github.com/iknizzz1807)         | 23521527        |                                                       |
| Đặng Trần Anh Hào      | [github.com/kohrabi](https://github.com/kohrabi)                 | 23520444        |did most of this shit and have depression due to this  |
| Trương Thiên Phú       | [github.com/MilkyChococo](https://github.com/MilkyChococo)       | 23521190        |                                                       |
| Đặng Ngọc Trường Giang | [github.com/ngoctruonggiang](https://github.com/ngoctruonggiang) | 23520406        |                                                       |
| Trần Đức Hải           | [github.com/duchai1703](https://github.com/duchai1703)           | 23520421        |                                                       |

---

## Tính năng chính

1. **Quản lý Trận Đấu**

   - Xem danh sách tất cả các trận đấu
   - Tạo và chỉnh sửa thông tin trận đấu
   - Ghi nhận bàn thắng và thẻ phạt
   - Quản lý danh sách cầu thủ tham gia trận đấu
   - Phân công vị trí cho cầu thủ trong trận đấu

2. **Quản lý Cầu Thủ**

   - Xem danh sách tất cả cầu thủ
   - Thêm, sửa, xóa thông tin cầu thủ
   - Tìm kiếm cầu thủ theo tên
   - Quản lý thông tin cá nhân của cầu thủ (tên, ngày sinh, loại cầu thủ)
   - Giới hạn độ tuổi cầu thủ theo quy định

3. **Quản lý Đội Bóng**

   - Xem danh sách tất cả đội bóng
   - Thêm, sửa, xóa đội bóng
   - Quản lý cầu thủ trong đội bóng
   - Giới hạn số lượng cầu thủ trong đội

4. **Quản lý Sân Nhà**
   - Xem danh sách sân vận động
   - Thêm, sửa, xóa thông tin sân vận động
   - Gán sân nhà cho đội bóng

---

## Cấu trúc dữ liệu

Hệ thống sử dụng các bảng dữ liệu chính sau:

- **LichThiDau**: Lưu trữ thông tin trận đấu (`maTD`, `doiMot`, `doiHai`, `doiThang`, `ngayGioDuKien`, `ngayGioThucTe`)
- **BanThang**: Ghi nhận bàn thắng trong trận đấu (`maTD`, `maCT`, `maDoi`, `thoiDiem`, `maLBT`)
- **ThamGiaTD**: Theo dõi cầu thủ tham gia trận đấu (`maTD`, `maCT`, `maDoi`, `maVT`)
- **DoiBong**: Thông tin đội bóng (`maDoi`, `tenDoi`, `maSan`)
- **CauThu**: Thông tin cầu thủ (`maCT`, `tenCT`, `ngaySinh`, `maLCT`, `ghiChu`, `banThang`, `soAo`)
- **SanNha**: Thông tin sân vận động (`maSan`, `tenSan`, `diaChi`)

---

## API Endpoints

### Quản lý Đội Bóng

- `GET /api/doibong`: Lấy danh sách đội bóng
- `POST /api/doibong`: Tạo hoặc cập nhật đội bóng
- `DELETE /api/doibong`: Xóa đội bóng

### Quản lý Cầu Thủ

- `GET /api/cauthu`: Lấy danh sách tất cả cầu thủ
- `POST /api/cauthu`: Cập nhật thông tin cầu thủ
- `DELETE /api/cauthu`: Xóa cầu thủ
- `GET /api/cauthu/[ma_doi]`: Lấy danh sách cầu thủ của một đội
- `POST /api/cauthu/[ma_doi]`: Thêm cầu thủ vào đội

### Quản lý Sân Nhà

- `GET /api/sannha`: Lấy danh sách sân nhà
- `POST /api/sannha`: Tạo hoặc cập nhật sân nhà
- `DELETE /api/sannha`: Xóa sân nhà

### Quản lý Trận Đấu

- `GET /api/lichthidau`: Lấy danh sách trận đấu
- `POST /api/lichthidau`: Tạo hoặc cập nhật trận đấu
- `DELETE /api/lichthidau`: Xóa trận đấu
- `GET /api/banthang/[matd]`: Lấy bàn thắng của một trận đấu
- `POST /api/banthang/[matd]`: Tạo hoặc cập nhật bàn thắng
- `POST /api/thamgiatd/[matd]`: Cập nhật danh sách cầu thủ tham gia trận đấu

---

## Quy trình sử dụng

1. **Quản lý đội bóng và cầu thủ**

   - Tạo đội bóng mới
   - Thêm cầu thủ vào đội bóng
   - Gán sân nhà cho đội bóng

2. **Lập lịch thi đấu**

   - Tạo các trận đấu giữa các đội
   - Đặt thời gian và địa điểm thi đấu

3. **Quản lý trận đấu**
   - Chọn cầu thủ tham gia trận đấu
   - Phân công vị trí cho cầu thủ
   - Ghi nhận bàn thắng và thẻ phạt
   - Cập nhật kết quả trận đấu

---

## Phân quyền

- Chỉ người dùng có quyền mới có thể thêm, sửa, xóa thông tin
- Kiểm tra quyền truy cập dựa trên nhóm người dùng

---

## Giao diện người dùng

- **Bảng dữ liệu (Table)** để hiển thị danh sách
- **Biểu mẫu (Form)** để thêm và chỉnh sửa thông tin
- **Thông báo (Toast)** để hiển thị kết quả thao tác
- **Nút bấm và điều hướng** để dễ dàng sử dụng

---

## Chạy dự án

```bash
npm run dev-seeddb
```
