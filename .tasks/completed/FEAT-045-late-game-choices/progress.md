# Progress — FEAT-045-late-game-choices

- Đo bằng giả lập 800 lượt, owner duyệt làm hai việc. Xong kế hoạch và kịch bản hành vi.
- Thêm nhịp cân nhắc tháng 4, câu hỏi của chị HR, cuộc gọi của mẹ, thỏa thuận 15 triệu, đoạn hé lộ trong The Survivor, giấy tờ thứ mười.
- Tự rà và sửa hai mâu thuẫn do phần mới gây ra: sếp khen người "không làm căng" ngay sau khi họ đứng ra nhận, và Uyên đưa giấy tờ cho người đã nhận chức.
- GPT chấm hai lượt: lần đầu CHƯA ĐẠT, lần sau ĐẠT. Chi tiết ở `review-3.md`.

## Lệch so với kế hoạch

- Bỏ "hiểu quyền lợi +5" khi ở lại tháng 4: GPT chỉ ra game đang thưởng cho việc ở lại.
- Nêu tên Uyên không còn tự động mất nhóm: có đường quay lại bằng nhận lỗi và 3 giấy tờ. Lý do: phạt quá nặng so với thông tin người chơi có lúc chọn.
- Đứng cùng Uyên không còn được giấy tờ, thay vào đó mất khoản 5 triệu nếu ở nhóm Vượt thác.
- Chụp tờ giấy khóa luôn lựa chọn ở lại, để từ chối thường vẫn có lý do tồn tại.
- Thêm một lựa chọn trong kết thúc The Survivor, lần đầu một kết thúc có lựa chọn. Plan ghi không thêm cảnh mới: vẫn giữ, đây là một nút trong cảnh có sẵn.

Ảnh hưởng: chương 6 có 5 lần chọn, nhiều hơn tiêu chí từ 3. Điều kiện sáu kết thúc không đổi.

## Vấn đề gặp phải

- E2E mới dùng `getByText` trùng ba phần tử của khung thoại, 4 lần đỏ. Lỗi ở test, đã đổi sang `getByRole('status')`.
- Lần gửi đầu tới ChatGPT cần bấm gửi hai lần vì nút chưa nhận nội dung.
