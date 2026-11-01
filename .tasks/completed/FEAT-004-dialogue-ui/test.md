# Test — FEAT-004-dialogue-ui

## 2026-11-01

| Check                                                                             | Result |
| --------------------------------------------------------------------------------- | ------ |
| Web: chạm hiện hết rồi mới đi tiếp, lựa chọn chờ hết câu, khóa kèm lý do          | PASS   |
| Web: phím Space, Enter, số; không ăn phím chữ; giảm chuyển động                   | PASS   |
| Web: trình đọc màn hình nhận cả câu và người nói ngay từ đầu                      | PASS   |
| Web: `useGameStore` giữ lịch sử, hành động bị từ chối không đổi gì                | PASS   |
| E2E: chơi cảnh mở đầu bằng một ngón tay, lịch sử, bàn phím, giảm chuyển động      | PASS   |
| E2E: 360 × 640, lựa chọn trong khung nhìn, nút từ 44 px, chữ từ 16 px, không cuộn ngang | PASS |
| E2E toàn bộ: 44 passed                                                            | PASS   |
| `pnpm typecheck`, `lint`, `build`                                                 | PASS   |

## Failures

- Lỗi thật, tự phát hiện khi viết test: `aria-label` trên hộp thoại đè nội dung, trình đọc màn hình chỉ đọc "Đọc tiếp".
  Thêm `role="status"` chứa cả câu và người nói.
- jsdom không có `matchMedia`: thêm vào `vitest.setup.ts`, có chặn cho test chạy ở môi trường node.
- Test bàn phím chờ sai câu (hoa thường). Lỗi của test.

## Scenarios

SCENARIO-019 đến 023: PASS. SCENARIO-013 đến 018 của FEAT-003 giờ đã chạy trên trình duyệt.
