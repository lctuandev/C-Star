# Save Contract

Save là thứ duy nhất của người chơi mà ta không thể khôi phục giúp họ. FEAT-008 cài đặt hợp đồng này.

---

## 1. Lưu ở đâu

- IndexedDB trên thiết bị. `localStorage` chỉ giữ tiện ích nhỏ (âm lượng, xác nhận lời cảnh báo).
- Không gửi đi đâu. Không có tài khoản.

## 2. Định dạng

- Mỗi save có `saveVersion` và `contentVersion`.
- Chỉ lưu state gốc (kèm seed RNG), không lưu giá trị suy ra được, không lưu state UI.
- Tên người chơi nằm trong save (từ v4) và chỉ ở trên thiết bị, không gửi đi đâu.
- Từ v5 save có `outlook` (niềm tin, hiểu quyền lợi) và `paidByMonth` (sổ lương). Save cũ lên v5 nhận `outlook` trung bình và sổ rỗng, vì tiền đã nhận trước đó không còn dấu vết.
- Save được kiểm tra bằng schema trước khi nạp.

## 3. Đổi định dạng

- Tăng `saveVersion` và viết migration từ bản ngay trước đó.
- Mỗi phiên bản giữ một fixture save mẫu, CI nạp lại được tất cả.
- Không bao giờ xóa save của người chơi vì nó cũ.

## 4. Khi có lỗi

- Save hỏng: báo rõ, không ghi đè, cho xuất file ra để cứu.
- Bộ nhớ đầy hoặc không ghi được: báo cho người chơi, game vẫn chạy tiếp.
- Autosave ghi nguyên tử: giữ bản tốt gần nhất cho tới khi bản mới ghi xong.

## 5. Autosave

Sau mỗi hành động và mỗi lựa chọn hội thoại. Tải lại phải về đúng điểm đó, không lặp hiệu ứng. Ghi đĩa mất vài mili giây: tắt
máy ngay trong khoảng đó thì mất đúng thao tác cuối, state vẫn nguyên vẹn.

## 6. Sao lưu

Người chơi xuất và nhập save được bằng file, vì save chỉ nằm trên một thiết bị (ADR-001, ADR-002).
