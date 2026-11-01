# Test — TECH-001-monorepo-foundation

## 2026-11-01

| Check                                                                      | Result     |
| -------------------------------------------------------------------------- | ---------- |
| `pnpm format:check`                                                        | PASS       |
| `pnpm typecheck` (6 task)                                                  | PASS       |
| `pnpm lint` (6 task)                                                       | PASS       |
| `pnpm test`: game-core 5, content 3, web 1                                 | PASS       |
| `pnpm build` sinh site tĩnh ở `apps/web/out` (844 KB)                      | PASS       |
| Site tĩnh chạy trên `python -m http.server`, không có Next                 | PASS       |
| `pnpm test:e2e` trên build tĩnh: phone-portrait và laptop                  | PASS       |
| React, `node:fs`, `Math.random`, `Date.now`, `new Date` trong `game-core`: lint đỏ cả 5 | PASS |
| `pnpm dev` qua địa chỉ LAN của máy trả 200 và đúng nội dung                | PASS       |
| Nhìn thật ở 375×812: đủ dấu tiếng Việt, không có lỗi console               | PASS       |
| Mở bằng điện thoại thật cùng Wi-Fi                                         | NOT TESTED |
| CI xanh trên GitHub (run 41280738591, commit `9b9354e`), đủ mọi bước       | PASS       |

## Failures

- `pnpm typecheck` và `pnpm lint` ở `apps/e2e`, lần đầu: code trong `page.evaluate` dùng `document` mà tsconfig
  không có DOM. Thêm `"lib": ["ES2023", "DOM"]`.
- `pnpm test:e2e` lần đầu: Playwright 1.64.1 cần Chromium v1248, máy chỉ có bản của Alo. Đã chạy
  `playwright install chromium`. CI có sẵn bước này.
