# Result — FEAT-001-pwa-shell

## What changed

Game cài được và chơi được không cần mạng. Worker precache toàn bộ bản build (37 file, 0,77 MB) vào một cache theo
phiên bản. Bản mới chờ người chơi đồng ý ở thẻ "Có bản mới rồi", không bao giờ tự reload. Menu có gợi ý cài cho
Android (prompt của trình duyệt) và iPhone (các bước), đóng rồi thì không hiện lại.

## Decisions

- Worker sinh từ danh sách file thật của bản build, nên thêm nội dung không thể quên precache.
- Bước bấm cập nhật E2E chạy bằng Chrome không DevTools, vì CDP làm Chromium giữ worker mới lại.

## Known issues

- Chưa cài thật trên Android và iPhone: cần HTTPS, chuyển sang TECH-004.
- Host thật phải phục vụ `/x` cho `x.html` và không cache `sw.js`: kiểm ở TECH-004.
- Chưa rõ vì sao CDP giữ worker lại.
