# Fix — BUG-001-cloudflare-beacon

## Thay đổi

- `deploy/nginx.conf`: `location /` trả `Cache-Control: no-cache, no-transform`. Theo tài liệu Cloudflare, proxy không được sửa nội dung khi có `no-transform`, nên không chèn script. Tài liệu lấy ví dụ `public, no-transform`, còn ở đây phải giữ `no-cache` để bản mới tới người chơi.
- `apps/e2e/tests/home.spec.ts`: chờ ảnh QR tải xong rồi mới đọc `naturalWidth`. Test vẫn đòi ảnh tải thành công.

## Phương án còn lại

Nếu `no-transform` không có tác dụng (có người báo trên diễn đàn Cloudflare là không ăn), owner tắt trong dashboard: Web Analytics, chọn site, Manage site, Advanced Options, Disable automatic setup. Việc này đổi cài đặt tài khoản nên owner tự làm.

Nguồn: <https://developers.cloudflare.com/web-analytics/get-started/>

## Chưa xong

Tác dụng của `no-transform` chỉ kiểm được qua Cloudflare, tức là sau khi phát hành. Mỗi lần phát hành cần owner đồng ý.
