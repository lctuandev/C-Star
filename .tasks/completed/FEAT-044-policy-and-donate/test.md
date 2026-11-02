# Test — FEAT-044-policy-and-donate

| Kiểm tra | Kết quả |
| --- | --- |
| Unit game-core | PASS, 114 |
| Unit content, gồm người chơi ngẫu nhiên, người chơi cô độc, validator, `story-links` | PASS, 107 |
| Unit web | PASS, 229 |
| Unit art-pipeline | PASS, 2 |
| E2E Playwright, điện thoại và laptop | PASS, 139 passed, 15 skipped, EXIT=0 |
| Typecheck, lint, format | PASS |
| Không cookie, không tải từ máy chủ ngoài (E2E, chạy với bản build cục bộ) | PASS |
| QR nén giải mã giống hệt bản gốc | PASS |
| Hộp thoại QR vừa màn hình 320 px | PASS |
| Xem trang chủ, QR, chính sách ở 4 cỡ màn hình | PASS |
| Quét QR thật bằng app ngân hàng | NOT TESTED |
| Cookie Cloudflare trên site thật | PASS, kiểm ở BUG-001-cloudflare-beacon |
| Không tải từ máy chủ ngoài trên site thật | FAIL ở bản `cefc40d`, Cloudflare chèn script; PASS từ `3088b75`: xem BUG-001-cloudflare-beacon |
