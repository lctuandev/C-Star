# Test — FEAT-031-office-in-game

## 2026-11-01

| Check | Result |
| --- | --- |
| E2E: model không tải được thì lùi 2D | PASS |
| E2E: truyện không chờ model | PASS |
| E2E: mất context WebGL, một context duy nhất, tắt 3D | PASS |
| Unit: màu rút theo tháng, ngưỡng FPS | PASS |
| FPS trên điện thoại thật | NOT TESTED |

## Failures

- Camera lắc nhẹ làm nhãn địa điểm rung liên tục: Playwright không bấm được, và người thật cũng khó bấm hơn. Sửa: không lắc ở màn bản đồ và khi giảm chuyển động.
- Test chặn model qua `page.route` không có tác dụng vì service worker trả từ cache. Sửa: chặn worker trong nhóm test đó.
