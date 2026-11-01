# ADR-001 — Monorepo, công nghệ, và không có server

## Status

ACCEPTED (2026-11-01). TECH-001 đã xác nhận trên Next 16.4.3.

## Context

Owner muốn làm việc theo flow của Alo Khách Ơi và đã quen stack của dự án đó. Nhưng C\* là game đơn theo
cốt truyện: không có người chơi khác, không có kinh tế chung, không có gì cần phân xử ở server.

## Decision

Dùng **pnpm workspace + Turborepo**, cùng họ công cụ với Alo, bỏ toàn bộ phần server:

```text
apps/
  web/            Next.js (App Router), React, Zustand, Tailwind; React Three Fiber nếu ADR-004 chốt 3D
  e2e/            Playwright
packages/
  game-core/      TypeScript thuần: GameState, story engine, tiền, chỉ số, ending, seeded RNG.
                  Không phụ thuộc React / Next / Three / IO.
  content/        Cốt truyện dạng dữ liệu, schema zod, validator, câu chữ pháp lý.
  config/         tsconfig và ESLint dùng chung.
```

Bố cục `apps/web/src`: `app/` (route), `features/<tên>/`, `components/ui/`, `lib/`.

Công cụ: Node 24, pnpm 11, TypeScript 6, ESLint 9 + Prettier, Vitest, Playwright, GitHub Actions.

**Không có** NestJS, Prisma, PostgreSQL, Redis, Socket.IO, tài khoản người chơi. Save nằm trên thiết bị.

## Why

- Bỏ server là bỏ luôn chi phí vận hành, đăng nhập, dữ liệu cá nhân, và là điều kiện để chơi offline.
- Tách `game-core` khỏi UI giúp luật chơi kiểm thử được và thay được lớp hiển thị (ADR-004) mà không đụng luật.
- Tách `content` để viết truyện không phải sửa code, và validator chặn nhánh chết ngay lúc build.

## Alternatives Considered

### Option A — Giữ nguyên stack Alo, có NestJS

- Bị loại: gánh toàn bộ phần multiplayer mà game không dùng.

### Option B — Một app Next.js, không monorepo

- Khả thi nhưng ranh giới `game-core` không có gì ép, và lệch với flow của Alo.

### Option C — Engine game (Godot, Unity xuất web)

- Bị loại: bản build nặng cho PWA di động, chữ tiếng Việt và UI hội thoại nhiều, owner không có sẵn kinh nghiệm.

## Consequences

### Positive

- Triển khai được như site tĩnh, không phát sinh chi phí mỗi người chơi.
- Tái dùng cấu hình và kinh nghiệm từ Alo.

### Negative

- Save mất khi người chơi xóa dữ liệu trình duyệt; không đồng bộ giữa các thiết bị. Có xuất/nhập save (FEAT-008).
- Người chơi sửa được save: chấp nhận vì game đơn.
- AI NPC (GDD §8) sau này cần một ADR mới và một dịch vụ riêng.

## Affected Systems

Toàn bộ.

## Related Tasks

- TECH-001-monorepo-foundation

## Date

2026-11-01
