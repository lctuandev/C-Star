# ADR-004 — Góc nhìn và lớp hiển thị

## Status

PROPOSED (2026-11-01). Chờ owner chốt ở điểm dừng cuối M1.

## Context

Kịch bản gốc nghiêng về Third Person 3D low-poly nhưng chưa chốt. Các lựa chọn: First Person, Third Person,
Visual Novel, Management. Đây là quyết định tốn kém nhất của dự án: 3D là cả cột mốc M3, thêm yêu cầu asset,
hiệu năng điện thoại và dung lượng tải offline (ADR-002).

## Decision đề xuất

- **M1 và M2 làm giao diện 2D**: cảnh tĩnh, chân dung nhân vật, hộp thoại. Không phụ thuộc lớp hiển thị vì
  luật nằm trong `game-core`.
- **Hướng đề xuất: Third Person 3D**, làm ở M3 sau khi slice đã vui, bằng React Three Fiber như Alo.
- Trước M3 chạy TECH-002 để đo trên điện thoại tầm trung và chốt ngân sách asset.

## Why

- Trụ cột của game là cốt truyện và lựa chọn. Slice 2D trả lời được câu "có vui không" với chi phí nhỏ nhất.
- Nếu Visual Novel đã đủ hay, bỏ M3 tiết kiệm được phần việc lớn nhất mà không mất gì đã làm.
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

Chốt sau M1. Chọn Visual Novel thì M3 chuyển thành một task đồ họa 2D. Chọn Third Person thì thêm một file rule
3D vào `.claude/rules/`.

## Affected Systems

`apps/web`, asset, ngân sách offline.

## Related Tasks

- TECH-002-3d-office-spike
- FEAT-016 đến FEAT-019

## Date

2026-11-01
