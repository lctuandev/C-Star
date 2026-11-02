# Result — BUG-001-cloudflare-beacon

Trạng thái: COMPLETED

Cloudflare không còn chèn script thống kê vào site, nên câu "không dùng công cụ theo dõi" ở `/policy` đúng với thực tế. Cách làm: nginx gửi `Cache-Control: no-cache, no-transform` cho trang và file tĩnh.

Bài học: site thật phải kiểm bằng E2E với `E2E_EXTERNAL_URL`, không chỉ `curl`, vì Cloudflare chỉ chèn khi yêu cầu giống trình duyệt.

Còn lại: người chơi cũ vẫn dùng trang đã lưu trong PWA cho tới khi đồng ý cập nhật. Địa chỉ có dấu `/` cuối trả 403, ghi ở `.project/backlog.md`.
