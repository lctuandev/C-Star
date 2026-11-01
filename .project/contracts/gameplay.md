# Gameplay Contract

Những điều luôn phải đúng, dù cài đặt thế nào. Đổi hợp đồng này phải cập nhật scenarios và tests bị ảnh hưởng.

---

## 1. Nguồn sự thật

- `GameState` trong `game-core` là nguồn sự thật duy nhất của một lượt chơi.
- UI chỉ gửi hành động. `game-core` quyết định hợp lệ hay không và trả về state mới.
- Hành động không hợp lệ bị từ chối, state không đổi.

## 2. Tính tất định

- Mọi ngẫu nhiên lấy từ seeded RNG trong state. Không dùng `Math.random` hay giờ hệ thống trong luật.
- Cùng seed, cùng chuỗi lựa chọn, cùng kết quả.

## 3. Tiền

- Tiền là số nguyên VND, không bao giờ âm.
- Thiếu tiền thì phần thiếu vào `arrears`, không để số âm, và được trả trước ở phiếu lương sau. Khoản vay ghi riêng.
- Sổ nợ của công ty chỉ giảm khi công ty thật sự trả trong cốt truyện.

## 4. Chỉ số

- Năng lượng và căng thẳng luôn trong 0–100, quan hệ luôn trong -100…100.
- Không có game over cứng giữa chừng: chỉ số chạm ngưỡng thì mở khủng hoảng.

## 5. Cốt truyện

- Lựa chọn nào bị khóa thì hiện lý do.
- Lượt chơi nào cũng kết thúc ở đúng một trong sáu ending.
- Điều kiện ending xét theo thứ tự cố định (GDD §6).
- Áp dụng một hiệu ứng đúng một lần: bấm hai lần hay tải lại không được nhân đôi.

## 6. Lời cảnh báo

Không vào được màn chơi nếu chưa xác nhận phiên bản lời cảnh báo hiện tại (`contracts/content.md` §5).
