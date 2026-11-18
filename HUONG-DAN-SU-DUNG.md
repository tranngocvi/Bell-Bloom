# HƯỚNG DẪN VẬN HÀNH WEBSITE TRÒ CHƠI "BELL & BLOOM"
### FPT POLYSCHOOL - Ngày Nhà giáo Việt Nam 20/11
### Chủ đề: “Chuông vang tri thức - Hoa nở tri ân”

---

## 1. KHỞI CHẠY HỆ THỐNG

### Cách 1: Chạy chế độ phát triển (Development)
```bash
npm run dev
```
Trình duyệt sẽ mở tại: `http://localhost:5173/`

### Cách 2: Chạy bản phát hành chính thức (Production Build)
```bash
npm run build
npm run preview
```

---

## 2. MÔ HÌNH VẬN HÀNH 2 MÀN HÌNH (DÀNH CHO SỰ KIỆN)

Hệ thống được thiết kế hoàn hảo cho việc vận hành trên 1 laptop kết nối máy chiếu:

1. **Màn hình Laptop (Dành cho MC / Ban tổ chức):**
   - Mở trình duyệt vào `http://localhost:5173/`.
   - Bấm nút **"BẢNG ĐIỀU KHIỂN MC"** (ở góc phải dưới hoặc nút Setting).
   - Tại đây MC có thể quan sát câu hỏi, đáp án đúng, đọc giải thích và bấm các lệnh điều khiển.

2. **Màn hình Máy chiếu / TV ngoài (Dành cho khán giả & thí sinh):**
   - Trên Bảng điều khiển MC, bấm nút xanh lá **"MỞ MÀN HÌNH TRÌNH CHIẾU"** (hoặc truy cập trực tiếp `http://localhost:5173/?mode=projector`).
   - Kéo cửa sổ trình chiếu sang màn hình máy chiếu thứ hai.
   - Bấm biểu tượng **Toàn màn hình** hoặc phím **F** (hoặc `F11`).
   - Màn hình này **tuyệt đối không để lộ đáp án hay các nút điều khiển nội bộ**, chỉ đồng bộ theo hiệu lệnh của MC.

---

## 3. QUY TRÌNH ĐIỀU KHIỂN TỪNG CÂU HỎI

1. **Mở câu hỏi:** MC bấm mở câu hỏi. Lúc này đồng hồ **chưa chạy** để MC thong thả đọc đề cho thí sinh.
2. **Bắt đầu tính giờ:** MC bấm **"BẮT ĐẦU ĐẾM NGƯỢC"** (hoặc nhấn phím `Space`). Đồng hồ bắt đầu đếm ngược, có âm thanh vui tươi, 5 giây cuối có âm tíc tắc hồi hộp.
3. **Hết giờ:** Đồng hồ về `00`, còi báo hết giờ vang lên và hiện thông báo **"HẾT GIỜ - GIƠ BẢNG!"**.
   - *Lưu ý:* Thao tác hết giờ chỉ khóa trả lời, **đáp án vẫn được giấu kín** trên màn hình chiếu.
4. **Công bố đáp án:** Sau khi thí sinh đã giơ bảng và MC nhận xét, MC bấm **"CÔNG BỐ ĐÁP ÁN"** (hoặc nhấn phím `R`). Lúc này đáp án đúng sẽ sáng rực màu xanh lá, chuông vàng ngân vang và bảng giải thích chi tiết xuất hiện.
5. **Chuyển câu:** MC bấm **"CÂU TIẾP THEO"** (hoặc nhấn phím `→`) để sang câu kế tiếp.
6. **Sau câu 15:** Nút đổi thành **"KẾT THÚC CHƯƠNG TRÌNH"** đưa đến màn hình vinh danh, hiển thị tên Quán quân và pháo giấy Confetti rực rỡ.

---

## 4. BẢNG PHÍM TẮT NHANH (DÀNH CHO MC)

| Phím | Chức năng | Điều kiện |
| :---: | :--- | :--- |
| **`Space`** | Bắt đầu đếm ngược / Tạm dừng / Tiếp tục | Trong màn hình câu hỏi |
| **`R`** | Công bố đáp án | Khi thời gian đã hết / đã khóa |
| **`→`** | Chuyển sang câu tiếp theo | Sau khi đã công bố đáp án |
| **`M`** | Bật / Tắt âm thanh (Mute/Unmute) | Bất cứ lúc nào |
| **`F`** | Bật chế độ Toàn màn hình (Fullscreen) | Toàn màn hình máy chiếu |

*(Phím tắt tự động vô hiệu hóa khi người dùng đang nhập văn bản trong ô gõ chữ).*

---

## 5. QUẢN LÝ VÀ CHỈNH SỬA CÂU HỎI

- **Bộ 15 câu demo:** Đã được nạp sẵn 100% trong hệ thống theo đúng đề bài.
- **Sửa câu hỏi:** Vào Bảng điều khiển MC > Tab **"Quản lý 15 câu hỏi"** > Bấm **"Sửa"** tại từng câu.
- **Xuất JSON (Sao lưu):** Bấm nút **"Xuất JSON"** để tải file `bell-bloom-15-cau-hoi.json` về máy.
- **Nhập JSON (Thay đề chính thức):** Bấm nút **"Nhập JSON"** và chọn tệp câu hỏi của BTC. Hệ thống sẽ tự động kiểm tra chặt chẽ:
  - Đúng 15 câu hỏi.
  - Đầy đủ 4 phương án A, B, C, D không để trống.
  - Đáp án đúng thuộc A, B, C, D.
  - Thời gian từ 5 đến 300 giây.
  - Nếu có lỗi, hệ thống sẽ báo rõ vị trí lỗi để BTC sửa lại mà không làm mất dữ liệu hiện tại.
- **Khôi phục demo gốc:** Bấm nút **"Khôi phục demo gốc"** để hoàn tác về 15 câu mẫu chuẩn.

---

## 6. LƯU Ý VỀ DỮ LIỆU BẢO MẬT & BỘ NHỚ TRÌNH DUYỆT

- Dữ liệu câu hỏi, cài đặt và tiến trình đang được lưu trữ trực tiếp trên **LocalStorage của trình duyệt máy tính vận hành**.
- Trước sự kiện chính thức, BTC nên bấm **"Xuất JSON"** để lưu 1 bản dự phòng trên USB hoặc Google Drive.
- Khi tải lại trang (F5), hệ thống sẽ **tự động phục hồi nguyên vẹn tiến trình câu hỏi** và trạng thái khóa đáp án để buổi lễ diễn ra liên tục, an toàn tuyệt đối.
