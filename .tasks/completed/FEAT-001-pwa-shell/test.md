# Test — FEAT-001-pwa-shell

## 2026-11-01

| Check                                                                          | Result     |
| ------------------------------------------------------------------------------ | ---------- |
| Unit: worker `install`, `activate`, `fetch`, `message` trên `caches` giả lập   | PASS       |
| Unit: danh sách precache, phiên bản build, manifest và icon có thật            | PASS       |
| Unit: phát hiện bản mới, áp dụng, hết 10 giây, tab khác đã cập nhật            | PASS       |
| Unit: gợi ý cài, iOS, ghi nhớ, bộ nhớ bị chặn, không đăng ký ở development     | PASS       |
| Unit tổng: web 54                                                              | PASS       |
| E2E: Chrome nhận là cài được (`Page.getInstallabilityErrors` rỗng), hai viewport | PASS     |
| E2E: tắt mạng, tải lại, font và mọi request đều có; địa chỉ lạ vẫn ra game     | PASS       |
| E2E: mọi file build nằm trong cache, so trực tiếp với `apps/web/out`           | PASS       |
| E2E: bản mới được mời, trang không tự reload, worker cũ vẫn chạy               | PASS       |
| E2E: bấm cập nhật lên bản mới, cache cũ bị dọn (Chrome không có DevTools)      | PASS       |
| E2E: gợi ý cài, "Để sau" giữ qua reload, các bước cho iPhone                   | PASS       |
| E2E toàn bộ 5 lần liên tiếp: 19 passed, 1 skipped                              | PASS       |
| `pnpm format:check`, `typecheck`, `lint`, `build`                              | PASS       |
| Thật: cài trên Android                                                         | NOT TESTED |
| Thật: thêm vào Màn hình chính trên iPhone                                      | NOT TESTED |

0,77 MB, 37 file. Cài thật cần HTTPS, chưa có trước TECH-004.

## Failures

- `manifest.ts` không build được với `output: 'export'`: phải khai báo `dynamic = 'force-static'`.
- Test cập nhật đỏ vì cổng 5301: `http.server` tôi mở ở TECH-001 chưa tắt được. Lỗi của người làm, đã tắt.
- Test cập nhật kẹt ở "Đang cập nhật…" khoảng 1/3 số lần, có đợt 5/6. Đo được: `SKIP_WAITING` tới worker mới,
  `skipWaiting()` đã gọi, nhưng worker vẫn `installed` sau 90 giây. Chạy Chrome không gắn DevTools thì đúng 6/6,
  khoảng 1,1 giây. **Kết luận: do Playwright gắn CDP vào worker.** Vì sao CDP gây ra thì chưa xác định.
  Đã sửa hai phía: bước này chạy bằng Chrome không CDP; và thêm lối thoát 10 giây vì Chromium có thể giữ worker
  mới lâu ngay cả với người chơi thật.

## Scenarios

- SCENARIO-001: PASS phần Chrome nhận là cài được và mở prompt; cài thật NOT TESTED.
- SCENARIO-002: PASS.
- SCENARIO-003: PASS.
- SCENARIO-004: PASS ở mức unit (install lỗi thì không để lại gì). Không E2E mất mạng giữa chừng.
- SCENARIO-005: PASS.
