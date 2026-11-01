# UX Direction

Quy tắc UX cấp sản phẩm. Mọi task giao diện phải theo. Rút từ `.project/ux-direction.md` của Alo Khách Ơi,
giữ phần dùng chung và viết lại cho game cốt truyện.

Cập nhật: 2026-11-01 (M6: tông màu mới, hỗ trợ tablet và PC).

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

**Mọi cỡ màn hình đều là bản chính.** Điện thoại dọc vẫn là nơi đa số người chơi ở, nhưng tablet và PC không phải bản
phóng to của nó. Cảnh luôn tràn màn hình, giao diện đè lên cảnh.

| Loại             | Viewport điển hình   | Bố cục                                                        |
| ---------------- | -------------------- | ------------------------------------------------------------- |
| Điện thoại dọc   | 360–430 × 640–932    | Thoại và bảng hành động ở dưới, trong tầm ngón cái            |
| Điện thoại ngang | 640–932 × 360–430    | Như PC, gọn hơn: bảng hành động ở bên phải                    |
| Máy bảng dọc     | 768–834 × 1024–1194  | Như điện thoại, thoại giới hạn 768 px, cảnh rộng hơn          |
| Máy bảng ngang   | 1024–1366 × 768–1024 | Như PC                                                        |
| Laptop / PC      | 1280+ × 720–1080+    | HUD một hàng, thoại giữa dưới, hành động cột phải, có phím tắt |

Variant `wide:` (rộng từ 1024 px, hoặc từ 640 px khi nằm ngang) là chỗ duy nhất đổi bố cục màn chơi.

Quy tắc:

- Bố cục theo chiều rộng và chiều cao thực, không theo tên thiết bị.
- Dùng `dvh`, `svh` và safe-area inset. Không giả định chiều cao cố định.
- Dải chắn phía sau status bar khi chạy tràn màn hình (bài học BUG-004 của Alo trên iOS).
- Màn chơi không cuộn trang. Bảng nào không vừa thì tự cuộn bên trong, không bao giờ bị cắt.
- Camera tự căn vào phần màn hình giao diện chừa lại (`fitView`), không cần chỉnh tay theo từng cỡ.

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

## 6. Tông màu

Đêm văn phòng, giấy tờ và tiền lương. Nền mực xanh đêm, chữ trắng ngà ấm, chứ không phải đen tuyền và trắng tinh.

| Vai trò        | Token             | Màu       | Dùng cho                                       |
| -------------- | ----------------- | --------- | ---------------------------------------------- |
| Nền            | `surface-950…600` | `#0d1220` | Mọi nền, nghiêng xanh tím                      |
| Hy vọng, tiền  | `paycheck`        | `#ffc83d` | Nút chính, tên người nói, số công ty nợ        |
| Đèn văn phòng  | `fluorescent`     | `#9ff0dc` | Sức, tin tốt, chữ C trên logo                  |
| Cảnh báo       | `alarm`           | `#ff7a5c` | Căng thẳng, đóng dấu, tin xấu                  |
| Giấy           | `paper`           | `#f6efdf` | Lời thoại, phiếu lương, ticket, giấy tờ        |

**Giấy là linh hồn của giao diện.** Mọi thứ có người nói hoặc có chữ ký đều là tờ giấy đặt trên nền tối. Đó là chất
văn phòng của game, và chữ tối trên nền giấy cũng dễ đọc nhất.

Trong văn phòng 3D, bảng màu là chàm, xanh ngọc, mù tạt, san hô trên nền kem: tháng đầu rực rỡ như lời hứa.

**Màu bị rút dần theo tháng** (`officeMood().drain`): văn phòng nhạt dần và lạnh đi, đúng không khí "lạnh, ngột ngạt"
ở GDD §7 khi công ty hết tiền, còn nhân vật giữ nguyên màu. Nhà riêng giữ được nhiều màu hơn. Câu chuyện được kể bằng
màu, không cần chữ.

Không dùng màu ngoài các token. Không shadow, không glow. Nút có viền dưới dày để trông như một phím bấm.
