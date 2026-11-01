# Test — FEAT-008-save-and-continue

## 2026-11-01

| Check                                                                         | Result |
| ----------------------------------------------------------------------------- | ------ |
| Web: định dạng, fixture mọi phiên bản, từ chối file lạ, file phá luật, bản mới | PASS   |
| Web: autosave tuần tự, người chơi nhanh hơn đĩa thì bản mới nhất ghi cuối     | PASS   |
| Web: save hỏng được cất riêng, ghi lỗi có báo và tự hồi phục                  | PASS   |
| game-core: `resumeRun` không kẹt khi cảnh hoặc câu đã bị đổi tên              | PASS   |
| E2E: tải lại giữa câu, trong tuần, ở phiếu lương, không mất, không nhân đôi   | PASS   |
| E2E: Tiếp tục không hỏi cảnh báo, Game mới phải xác nhận                      | PASS   |
| E2E: save hỏng báo rõ, xuất được, không bị ghi đè kể cả vào bằng link trực tiếp | PASS |
| E2E: xuất ở máy này, nhập ở máy khác; file lạ bị từ chối                      | PASS   |
| E2E: chặn IndexedDB thật, game vẫn chơi được và có báo                        | PASS   |
| Unit tổng web 105. E2E 72 passed                                              | PASS   |
| `pnpm typecheck`, `lint`, `build`                                             | PASS   |

## Scenarios

SCENARIO-030 đến 034: PASS.
