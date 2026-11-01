# Test — FEAT-017-third-person-controls

## 2026-11-01

| Check                                       | Result |
| ------------------------------------------- | ------ |
| Unit: bước đi, tới nơi, một lệnh đi mỗi lần  | PASS   |
| Unit: hành động chạy đúng một lần            | PASS   |
| E2E: chạm địa điểm, đi tới, hành động được tính | PASS |

SCENARIO-053: PASS.

## Failures

- Lỗi thật: nhà cách văn phòng 30 mét trong thế giới 3D. Sau cảnh ở nhà, camera nhảy về ngay nhưng nhân vật đi bộ qua khoảng không, chạm vào địa
  điểm bị trễ gần 10 giây. Đo bằng vòng render trên phone và laptop rồi mới thấy: FPS tốt, context sống, nhưng hành động đến rất muộn.
  Sửa: khoảng cách trên 20 mét là cắt cảnh, không đi bộ.
