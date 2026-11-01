# UX Direction

Quy tắc UX cấp sản phẩm. Mọi task giao diện phải theo. Rút từ `.project/ux-direction.md` của Alo Khách Ơi,
giữ phần dùng chung và viết lại cho game cốt truyện.

Cập nhật: 2026-11-01.

---

## 1. Tiêu chuẩn

Làm mỗi màn như sắp giao cho người chơi thật vào ngày mai.

- Thiết kế từ góc nhìn người chơi: đang ở đâu trong truyện, làm được gì, mất gì, được gì.
- Ít chạm, nút lớn, phản hồi ngay. Không có trạng thái chết.
- Chuyển động để giải thích thay đổi (tiền trừ, sổ nợ tăng), không bao giờ chặn thao tác.
- Không dùng UI kiểu admin dashboard. Màn nào giống bảng cài đặt thì thiết kế lại. Giao diện nên có chất văn
  phòng: phiếu lương, email nội bộ, thông báo HR, bảng Excel bị châm biếm.
- Không shadow, không glow trên nút. Tách các hành động bằng khoảng cách (từ 12 px) và độ tương phản nền.
- Hoàn thiện là một phần của "xong": trạng thái trống, đang tải, lỗi.

## 2. Màn hình

**Mục tiêu chính: điện thoại dọc.**

| Loại            | Viewport điển hình | Bố cục                                                   |
| --------------- | ------------------ | -------------------------------------------------------- |
| Điện thoại dọc  | 360–430 × 640–932  | Một cột, thoại ở phần dưới, trong tầm ngón cái           |
| Điện thoại ngang | 640–932 × 360–430 | Không phải mục tiêu thiết kế, nhưng không được vỡ        |
| Máy bảng        | 768–1024 × 1024–1366 | Bố cục dọc, thoáng hơn                                 |
| Laptop / PC     | 1280+ × 720–1080   | Cảnh rộng, thoại đặt giữa dưới, có phím tắt              |

Quy tắc:

- Bố cục theo chiều rộng và chiều cao thực, không theo tên thiết bị.
- Dùng `dvh`, `svh` và safe-area inset. Không giả định chiều cao cố định.
- Dải chắn phía sau status bar khi chạy tràn màn hình (bài học BUG-004 của Alo trên iOS).

## 3. Đọc chữ là hoạt động chính

- Cỡ chữ thoại tối thiểu 16 px, đổi được trong cài đặt (FEAT-027).
- Chữ chạy luôn tua được bằng một chạm. Không buộc phải chờ.
- Luôn có lịch sử thoại vừa qua.
- Chữ tiếng Việt dùng font đủ dấu, kiểm ở 360 px.

## 4. Giọng văn

Vui, đời, cay nhẹ, không toxic. Xem `contracts/content.md` §3.

Thông điệp hệ thống cũng là chỗ để đùa: nút tiến tới ngày lương, phiếu lương số 0, email tự động của HR.

## 5. Màn cảnh báo

Rõ ràng, nghiêm túc, không đùa. Đọc xong trong dưới 10 giây, một nút duy nhất để đi tiếp. Không phải chờ đồng hồ.
