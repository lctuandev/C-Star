# Test — TECH-004-production-deploy

## 2026-11-01

| Check                                                  | Result     |
| ------------------------------------------------------ | ---------- |
| Image build từ repo sạch                                | PASS       |
| `/about` ra `about.html`, `sw.js` no-store, static immutable | PASS |
| E2E toàn bộ trên nginx: 87 pass, 2 so với build khác nên lệch | PASS |
| `pwa.spec` trên nginx với đúng bản build                 | PASS       |
| Cài thật trên Android và iPhone                         | NOT TESTED |
