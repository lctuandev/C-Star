# TECH-004-production-deploy — Progress

## 2026-11-01

- Mọi thứ cần có của host đã nằm trong `deploy/nginx.conf`, có E2E chứng minh.
- Hai test lệch vì image tự build, tên file băm khác `apps/web/out`. Mount đúng bản build thì pass.
