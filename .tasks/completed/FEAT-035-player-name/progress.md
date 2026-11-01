# FEAT-035-player-name — Progress

## 2026-11-01

- Tên nằm trong `GameState` vì thuộc về lượt chơi và phải được lưu; save lên v4, có migration và fixture.
- Đơn ứng tuyển là route `/apply`, không phải state trong menu: `DisclaimerGate` gỡ menu khi đang hỏi nên state của menu không sống qua màn cảnh báo.
- Làm sạch tên trong `game-core`: bỏ ký tự điều khiển và dấu ngoặc nhọn để tên không thể giả làm placeholder.
