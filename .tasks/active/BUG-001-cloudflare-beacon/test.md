# Test — BUG-001-cloudflare-beacon

| Kiểm tra | Kết quả |
| --- | --- |
| Tái hiện: E2E `keeps the promises of the policy` trên site thật, bản `cefc40d` | FAIL, tải `beacon.min.js` ở `/` và `/policy` |
| Tái hiện: `curl` user agent Chrome thấy script, `127.0.0.1:6000` không có | PASS |
| `nginx -t` và header trên cổng phụ 6011, ảnh bản đang chạy với config mới | PASS, `no-cache, no-transform` ở `/`, `/policy`, `/donate/qr.png`; `/sw.js` giữ nguyên |
| E2E QR trên site thật sau khi sửa test | PASS, 2 passed, EXIT=0 |
| Script không còn trên site thật sau khi phát hành | NOT TESTED, chờ phát hành |
| Không cookie trên site thật | NOT TESTED, test dừng ở bước script nên chưa tới |
