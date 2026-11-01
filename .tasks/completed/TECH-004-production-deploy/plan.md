# TECH-004-production-deploy — Plan

Trạng thái: COMPLETED

## Objective

Đưa game lên mạng.

## Scope đã làm

Image nginx, cấu hình header cho PWA, compose production, chạy E2E vào đúng image.

## Triển khai

Owner trỏ `c-star.lctuan.space` qua Cloudflare Tunnel vào `localhost:6000` và yêu cầu deploy. Tên game và sáu xác nhận ở `docs/content-review.md` vẫn đang chờ owner.
