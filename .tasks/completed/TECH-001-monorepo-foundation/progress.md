# TECH-001-monorepo-foundation — Progress

## 2026-11-01

- Tạo task.
- Đọc docs của Next 16.4.3 trong `node_modules`: `output: 'export'` ghi ra `out/`, `next/image` phải tắt tối ưu
  hoặc có loader riêng. ADR-002 giữ nguyên.
- Dựng root, `config`, `game-core` (seeded RNG), `content` (`gameInfo`), `web`, `e2e`, CI.
- Cổng tránh đụng Alo (5000, 5100): dev 5200, static 5201, E2E 5300.

- Push lên `lctuandev/C-Star` qua SSH: máy không có credential HTTPS. CI xanh.

## Khác so với plan

- Thêm: ESLint chặn `Math.random`, `Date.now`, `new Date` trong `game-core`. Hợp đồng gameplay §2 đòi tất định,
  chặn sớm rẻ hơn tìm lỗi sau.
- Thêm: E2E chạy trên build tĩnh qua `serve`, không chạy trên `next dev`. Lý do: FEAT-001 cần test service worker
  đúng như lúc phát hành. Thêm devDependency `serve`.
- Thêm: `packages/config/tsconfig/node.json` thay cho `nestjs.json` của Alo, vì không có server.
- Zustand đã cài nhưng chưa dùng, sẽ dùng ở FEAT-005.
