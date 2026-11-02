# Test — BUG-001-cloudflare-beacon

| Kiểm tra | Kết quả |
| --- | --- |
| Tái hiện: E2E `keeps the promises of the policy` trên site thật, bản `cefc40d` | FAIL, tải `beacon.min.js` ở `/` và `/policy` |
| Tái hiện: `curl` user agent Chrome thấy script, `127.0.0.1:6000` không có | PASS |
| `nginx -t` và header trên cổng phụ 6011, ảnh bản đang chạy với config mới | PASS, `no-cache, no-transform` ở `/`, `/policy`, `/donate/qr.png`; `/sw.js` giữ nguyên |
| E2E QR trên site thật sau khi sửa test | PASS, 2 passed, EXIT=0 |
| Script không còn trên site thật sau khi phát hành `3088b75` (`curl` user agent Chrome ở `/`, `/policy`, `/play`, `/about`) | PASS, 0 lần xuất hiện |
| Regression: E2E `keeps the promises of the policy` trên site thật | PASS |
| Không cookie trên site thật, sau khi mở `/` và `/policy` | PASS |
| E2E `home.spec.ts` và `disclaimer.spec.ts` trên site thật | PASS, 22 passed, EXIT=0 |
| CI của `3088b75` | PASS |
| Header `no-transform` không làm mất nén: `/` qua Cloudflare còn 3,8 KB | PASS |
| Người chơi cũ nhận trang sạch sau khi đồng ý cập nhật PWA | NOT TESTED, version worker đã đổi từ `88edb74d71c0` sang `d3ddd993343f` nên bản cập nhật sẽ được nhận ra |
