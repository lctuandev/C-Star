# FEAT-002-disclaimer-gate — Progress

## 2026-11-01

- Chọn: chỉ hỏi lại ở "Game mới" và khi đổi phiên bản, không hỏi mỗi lần mở app, để không thành thói quen bấm bỏ qua.
  Trên menu luôn có một dòng nhắc ngắn.
- Cổng bọc `children` ở root layout thay vì route `/disclaimer` kèm redirect như bản nháp kiến trúc: route thêm sau này
  tự nằm sau cổng, không có đường vòng để quên. Đã sửa `architecture/overview.md`.
- Đưa dòng nhắc từ `gameInfo.fictionNote` sang `disclaimer.reminder`: một nguồn duy nhất.
- Có `/about` (Về game, bản đơn giản) và `/play` (giữ chỗ tới FEAT-005).
- Sửa lỗi `HEAD` của worker từ FEAT-001.
