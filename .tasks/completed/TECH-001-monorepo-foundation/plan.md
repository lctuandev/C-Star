# TECH-001-monorepo-foundation — Plan

Trạng thái: PLANNING

## Objective

Dựng bộ khung code để mọi task sau có chỗ đặt và có lệnh kiểm tra thống nhất, theo ADR-001.

## Scope

- pnpm workspace + Turborepo, Node 24, TypeScript 6, Prettier, ESLint 9.
- `apps/web`: Next.js App Router, static export, Tailwind, Zustand, font Be Vietnam Pro, một trang chào.
- `packages/game-core`, `packages/content`, `packages/config`, mỗi package có một hàm và một test thật.
- ESLint chặn `game-core` import React, Next, Three và IO.
- `apps/e2e`: Playwright hai project `phone-portrait` (390×844) và `laptop` (1280×800), một spec mở trang chủ.
- GitHub Actions: format, typecheck, lint, test, build, E2E.
- Thêm `.claude/launch.json`, `.prettierignore`, `AGENTS.md` nếu công cụ tự sinh.

## Non-goals

- PWA (FEAT-001), màn cảnh báo (FEAT-002), story engine (FEAT-003).
- R3F: chỉ thêm khi ADR-004 chốt 3D.
- Triển khai production (TECH-004).

## Affected systems

Toàn bộ repo, chưa có code.

## Implementation steps

1. Đọc docs Turborepo và Next trong `node_modules` của phiên bản cài, nhất là static export.
2. Tạo root và `packages/config`, lấy cấu hình từ Alo Khách Ơi.
3. Tạo `game-core`, `content` kèm test và luật ESLint.
4. Tạo `apps/web`, xác minh static export sinh ra thư mục tĩnh chạy được.
5. Tạo `apps/e2e`, CI.
6. Chạy toàn bộ lệnh, cập nhật `.project/CURRENT.md`, ghi lệch so với ADR-001 nếu có.

## Acceptance criteria

- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm test:e2e` đều xanh.
- `pnpm dev` mở được trang chào trên điện thoại cùng Wi-Fi.
- Bản build là site tĩnh, chạy được trên một static server bất kỳ.
- Import React trong `game-core` làm lint đỏ.
- CI xanh trên GitHub (sau khi owner tạo remote).

## Risks

- Next có thể đổi cách làm static export ở phiên bản cài: đọc docs trước, không dựa vào trí nhớ.
- Nếu static export không dùng được, phải đổi ADR-002, không âm thầm chuyển sang server.

## Dependencies

Không có. Remote GitHub cần owner tạo để chạy CI.
