# Result — TECH-004-production-deploy

## What changed

Game chạy công khai tại <https://c-star.lctuan.space>: nginx trong Docker trên máy owner, cổng `127.0.0.1:6000`, Cloudflare Tunnel phía trước.

Phát hành bản mới, từ thư mục gốc repo:

```bash
docker compose -f deploy/docker-compose.prod.yml up -d --build
```

Người đang chơi thấy lời mời cập nhật ở menu, không bị ngắt giữa cảnh. Quay về bản cũ: `git checkout <commit>` rồi chạy lại lệnh trên.

## Known issues

- Chạy trên máy cá nhân: máy tắt hoặc mất mạng thì site ngừng, trừ người đã cài PWA.
- Chưa cài thử thật trên Android và iPhone.
- Tên game và sáu xác nhận ở `docs/content-review.md` chưa được owner chốt.
