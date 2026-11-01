# Result — TECH-001-monorepo-foundation

## What changed

Monorepo pnpm + Turborepo theo ADR-001: `apps/web` (Next.js 16 static export, Tailwind 4, font Be Vietnam Pro),
`apps/e2e` (Playwright, hai viewport), `packages/game-core` (seeded RNG), `packages/content` (`gameInfo`, zod),
`packages/config`, GitHub Actions. Trang chào tạm hiện tên game và dòng nhắc hư cấu.

## Decisions

- Static export dùng được, ADR-001 và ADR-002 không đổi.
- `game-core` bị lint chặn cả nguồn không tất định, không chỉ import.
- E2E chạy trên build tĩnh.

## Known issues

- Chưa thử trên điện thoại thật cùng Wi-Fi.
