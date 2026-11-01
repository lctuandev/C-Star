# Test — TECH-004-production-deploy

## 2026-11-01

| Check                                                  | Result     |
| ------------------------------------------------------ | ---------- |
| Image build từ repo sạch                                | PASS       |
| `/about` ra `about.html`, `sw.js` no-store, static immutable | PASS |
| E2E toàn bộ trên nginx: 87 pass, 2 so với build khác nên lệch | PASS |
| `pwa.spec` trên nginx với đúng bản build                 | PASS       |
| Cài thật trên Android và iPhone                         | NOT TESTED |

## 2026-11-01, trên domain thật

| Check                                                                 | Result     |
| --------------------------------------------------------------------- | ---------- |
| HTTPS, `sw.js` no-store, MIME của `glb` và `webp`                     | PASS       |
| E2E vào `https://c-star.lctuan.space` (pwa, home, disclaimer, layout): 46 pass | PASS |
| Ảnh chụp 3D từ domain thật                                             | PASS       |
| Cài thật trên Android và iPhone                                        | NOT TESTED |

## Failures

- `every file of the build is in the cache` đỏ ở cả hai cấu hình: test so cache của bản đã deploy với `apps/web/out` trên máy, hai bản khác mã build. Báo động giả, cùng lý do như lần chạy trên nginx trước.
- Một lần `page.goto` quá 30 giây ở trang menu. Chạy lặp 18 lần đều qua, không tái hiện được: coi là chập chờn mạng qua tunnel, chưa rõ nguyên nhân.

## 2026-11-01, lần phát hành thứ hai (`ecd9f1e`, có âm thanh)

| Check                                                                 | Result     |
| --------------------------------------------------------------------- | ---------- |
| Owner đồng ý deploy                                                    | PASS       |
| File âm thanh, ảnh, GLB trả đúng MIME qua HTTPS                        | PASS       |
| E2E vào domain thật: sound, disclaimer, home, 26 test                  | PASS       |
| E2E `pwa.spec` vào domain thật, trừ test so với bản build trên máy: 15 pass | PASS  |

## 2026-11-01, lần phát hành thứ ba (`11ebbbd`, tên nhân vật, tiếng từng lựa chọn, nhạc theo truyện, góp ý theo chương)

| Check                                                                 | Result     |
| --------------------------------------------------------------------- | ---------- |
| Owner đồng ý deploy                                                    | PASS       |
| CI của commit này                                                      | PASS       |
| E2E vào domain thật: sound, disclaimer, home, pwa, 41 test             | PASS       |
