# Test — FEAT-035-player-name

## 2026-11-01

| Check | Result |
| --- | --- |
| Unit: làm sạch tên, chèn vào thoại, không điền vẫn chạy | PASS |
| Migration save v3 lên v4, fixture từng phiên bản | PASS |
| E2E: tên hiện trong truyện, còn sau khi tải lại | PASS |
| E2E: link lạc vào /apply về menu | PASS |

## Failures

- Lỗi thật, E2E bắt được, unit test thì không: `newRun` xóa cờ `startingNewGame`, effect của form thấy cờ tắt nên đẩy về menu ngay khi vừa nộp đơn.
  78 E2E hỏng theo. Sửa: chỉ đọc cờ một lần lúc vào trang. Đã thêm kiểm tra vào unit test.
