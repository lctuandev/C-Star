# Test — FEAT-002-disclaimer-gate

## 2026-11-01

| Check                                                                                | Result     |
| ------------------------------------------------------------------------------------ | ---------- |
| Unit: `shouldShowDisclaimer` lần đầu, đã xác nhận, đổi phiên bản, game mới           | PASS       |
| Unit: câu chữ đủ ý, đọc dưới 10 giây, schema                                         | PASS       |
| Web: cổng, xác nhận, giá trị hỏng, game mới, bộ nhớ bị chặn                          | PASS       |
| Web: chỉ một nơi chứa câu chữ (quét `apps/web/src`)                                  | PASS       |
| E2E: lần đầu, quay lại, game mới, link trực tiếp, đổi phiên bản, bộ nhớ chặn, 360 px | PASS       |
| E2E: offline, chuyển trang và game mới qua cổng                                      | PASS       |
| E2E toàn bộ 3 lần liên tiếp: 35 passed, 1 skipped                                    | PASS       |
| `pnpm format:check`, `typecheck`, `lint`, `build`                                    | PASS       |
| Owner duyệt câu chữ                                                                  | NOT TESTED |

## Failures

- Lỗi thật của FEAT-001, lộ ra khi có route thứ hai: `next/link` gửi `HEAD` trước khi prefetch, worker chỉ xử lý `GET`
  nên offline thì rơi ra mạng. Worker giờ trả lời `HEAD` từ cache, không có body. Có test unit và E2E chuyển trang
  offline.
- Sau khi sửa, Playwright báo `HEAD` đó là `ERR_ABORTED`: trang tự bỏ prefetch, không phải thiếu file. Test chỉ tính lỗi
  mạng thật; phần chuyển trang offline mới là phép thử.
- Test "mọi file trong cache" so `about.html` với `/about`: lỗi của test, đã so đúng địa chỉ phục vụ.

## Scenarios

SCENARIO-006 đến 012: PASS.
