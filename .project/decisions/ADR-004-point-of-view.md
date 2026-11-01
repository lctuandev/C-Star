# ADR-004 — Góc nhìn và lớp hiển thị

## Status

ACCEPTED (2026-11-01). Claude chốt theo đề xuất, vì owner yêu cầu làm liên tục không dừng hỏi. Owner có thể đổi: chỉ cần tắt 3D, game không mất gì.

## Context

Kịch bản gốc nghiêng về Third Person 3D low-poly nhưng chưa chốt. Các lựa chọn: First Person, Third Person,
Visual Novel, Management. 3D thêm yêu cầu hiệu năng điện thoại và dung lượng tải offline (ADR-002).

## Decision

- **Third Person 3D low-poly**, bằng React Three Fiber. Mô hình dựng bằng Blender từ code, xem ADR-005 (thay cho khối hình trong code ở bản đầu).
- **Chạm để đi thay cho joystick**: chạm nhãn một địa điểm, nhân vật đi tới và làm hành động đó. Một ngón tay trên điện thoại dọc.
- **3D chỉ là lớp hiển thị.** Luật ở `game-core` không đổi. Danh sách hành động dạng nút luôn còn đó.
- **Cảnh tràn màn hình, nhưng khung hình nằm gọn trong phần giao diện chừa lại** (`fitView`, đổi ở FEAT-033). Bản đầu cắt canvas giữa HUD và bảng điều khiển.
- **Ba chế độ:** Tự động (mặc định), Luôn 3D, 2D. Tự động sẽ giảm chi tiết dưới 30 FPS, lùi về 2D dưới 18 FPS hoặc khi không có WebGL, không tải được model.

## Why

- Trụ cột của game là cốt truyện và lựa chọn. Slice 2D trả lời được câu "có vui không" với chi phí nhỏ nhất.
- Lớp 2D vẫn đầy đủ, nên 3D là phần thêm: máy yếu vẫn chơi trọn game.
- Owner đã có kinh nghiệm R3F và pipeline low-poly từ Alo, nên 3D vẫn khả thi khi cần.

## Alternatives Considered

### Option A — Visual Novel, bỏ 3D

- Rẻ, nhẹ, offline dễ. Mất cảm giác đi lại trong văn phòng ngột ngạt.

### Option B — Làm 3D ngay từ đầu

- Bị loại: đổ công vào asset trước khi biết game có vui không.

### Option C — First Person

- Khó điều khiển trên điện thoại dọc, là đối tượng chính.

### Option D — Management

- Là một game khác: quản lý nhóm, không phải sống qua cốt truyện của một người.

## Consequences

- Chunk 3D 904 KB, gzip 238 KB, chỉ tải khi cần ở lần chạy đầu, nhưng service worker vẫn precache nó. Tổng precache xem ADR-005.
- Chưa đo trên điện thoại thật: lý do phải có chế độ Tự động. Xem TECH-002.
- Nhân vật là hình đồ chơi với mặt tối giản (đổi ở FEAT-029): vẫn đúng tinh thần "biểu tượng, không phải người thật", và có hồn hơn hẳn.

## Affected Systems

`apps/web`, asset, ngân sách offline.

## Related Tasks

- TECH-002-3d-office-spike
- FEAT-016, 017, 018, 019

## Date

2026-11-01
