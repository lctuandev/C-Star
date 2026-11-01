# FEAT-001-pwa-shell — Progress

## 2026-11-01

- Tạo task. Xong TECH-001 thì làm.
- Manifest, icon, metadata iOS. Icon iOS chuyển thành `app/apple-icon.png` theo quy ước của Next.
- Worker sinh sau `next build`: `scripts/build-sw.mjs` ghép danh sách file vào `sw.template.js`. Mọi thứ phục vụ
  từ cache của đúng phiên bản, khóa theo pathname vì Next thêm query như `?_rsc=`.
- Luồng cập nhật, gợi ý cài, `Button` dùng chung.

## Khác so với plan

- Bỏ Lighthouse: bản hiện tại đã bỏ mục PWA. Thay bằng `Page.getInstallabilityErrors`, chính là luật của Chrome.
- Không precache `404.html` và `_not-found*`: host redirect hoặc trả 404 cho chúng, một file lỗi là hỏng cả install.
  Địa chỉ lạ khi offline ra game.
- Nghiệm thu cài thật trên Android và iPhone chuyển sang TECH-004, vì cần HTTPS. Đã ghi vào roadmap và backlog.
- Thêm kiểm tra bản mới khi app quay lại từ nền, tối đa mỗi giờ một lần: app đã cài có thể mở nhiều ngày không điều
  hướng.
- Thêm lối thoát 10 giây cho nút cập nhật (xem `test.md`).

## Hành vi cần biết

- Không bấm cập nhật mà đóng hết tab: lần mở sau trình duyệt tự dùng bản mới. Không ngắt lượt chơi, nên chấp nhận.
- Hai tab: chỉ tab bấm tự reload. Tab kia vẫn chạy trang cũ cho tới khi mở lại.
