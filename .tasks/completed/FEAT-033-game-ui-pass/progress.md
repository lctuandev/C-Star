# FEAT-033-game-ui-pass — Progress

## 2026-11-01

- Owner yêu cầu đổi tông và hỗ trợ màn hình lớn giữa chừng: làm cùng lượt, vì bố cục tràn màn hình giải quyết cả hai.
- Cảnh chuyển từ dải giữa HUD và bảng sang tràn màn hình, `fitView` giữ khung hình trong phần được chừa lại.
- Bản `h-dvh overflow-hidden` có thể cắt mất lựa chọn trên điện thoại nhỏ: các bảng tự cuộn bên trong.
- Manifest đổi `orientation` từ `portrait` sang `any`, nếu không PWA trên tablet bị khóa dọc.
