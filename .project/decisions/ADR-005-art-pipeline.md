# ADR-005 — Đồ họa dựng và bake bằng Blender

## Status

ACCEPTED (2026-11-01). Thay phần "dựng hoàn toàn từ khối hình trong code, không có file asset" của ADR-004.
Các quyết định khác của ADR-004 giữ nguyên.

## Context

Owner yêu cầu nâng cấp đồ họa. Bản hiện tại là khối hình do code dựng: không đọc được là văn phòng, chế độ 2D chỉ
có nền trống. Máy owner có Blender 5.2, và Alo Khách Ơi đã có pipeline Blender → GLB → tối ưu → ngân sách
(`tools/world-pipeline`, ADR-042 của Alo). Điện thoại tầm trung vẫn là mục tiêu chính.

## Decision

- **`tools/art-pipeline`**: script Blender dựng mọi thứ từ code, chạy lại được, không cần thao tác tay. Kết quả được
  commit vào `apps/web/public/art/`. CI không cần Blender, chỉ kiểm ngân sách trên file đã commit.
- **Ánh sáng bake bằng Cycles vào lightmap.** Toàn cảnh tĩnh dùng `MeshBasicMaterial` + `lightMap`: có GI thật mà
  chi phí chạy chỉ là một lần lấy mẫu texture, rẻ hơn cả Lambert hiện tại.
- **Đồ vật đổi theo tháng vẫn nằm trong bake**, là node riêng để ẩn hiện. Bóng của chúng ở lại trên bàn: vệt sạch chỗ
  máy cà phê từng đứng là đúng tinh thần game.
- **Nhân vật là skinned mesh, xương đặt thẳng đứng** để trục cục bộ trùng trục thế giới. Hoạt ảnh viết bằng code: gọn,
  kiểm thử được, không có dữ liệu animation trong GLB.
- **Blender render luôn phần 2D**: chân dung, nền từng địa điểm, màn mở đầu. Máy yếu chơi 2D vẫn thấy cùng một thế giới.
- **Ngân sách**: văn phòng dưới 1,8 MB, 80k tam giác, lightmap 2048; nhân vật dưới 400 KB. Vượt thì build đỏ (`budgets/`). Văn phòng có 42 draw call trong file, nhưng phần lớn là đồ ẩn hiện, cùng lúc chỉ vẽ khoảng 25.
- Mô hình tự dựng 100%, không dùng asset bên thứ ba: khỏi rà license, và không có gì giống thương hiệu có thật.

## Why

- Nội thất là nơi GI tạo khác biệt lớn nhất, và lightmap không tốn thêm GPU lúc chạy.
- Dùng lại cách làm đã chứng minh ở Alo, owner không cần biết Blender.
- Render sẵn 2D giải quyết luôn chế độ dự phòng, thay vì vẽ một bộ art thứ hai.

## Alternatives Considered

### Option A — Nâng cấp ngay trong code R3F (bóng thời gian thực, PBR, hậu kỳ)

- Bị loại: tốn GPU đúng chỗ điện thoại yếu nhất, và không có GI.

### Option B — Dùng asset CC0 (Kenney, Quaternius)

- Bị loại: phải rà license từng gói, phong cách không đồng nhất, nhân vật đại trà.

### Option C — KTX2 cho texture

- Bị loại ở bước này: thêm decoder wasm vào precache, ETC1S làm lightmap bị vạch. Dùng WebP. Xem lại nếu bộ nhớ GPU là vấn đề khi đo trên máy thật.

## Consequences

### Positive

- Đồ họa và chế độ 2D cùng lên một bậc từ một nguồn. Game có thể tái dựng từ code.

### Negative

- Precache tăng từ 2 MB lên 3,9 MB, trong đó art 1,8 MB. Vẫn chưa đo trên điện thoại thật.
- Lightmap 2048 chiếm khoảng 21 MB bộ nhớ GPU khi đã giải nén: đây là con số cần xem đầu tiên nếu máy yếu bị văng.
- Đổi layout văn phòng phải chạy lại bake vài phút.
- Lightmap cố định: ánh sáng không đổi theo giờ, tâm trạng từng tháng làm bằng tông màu.

## Affected Systems

`apps/web/src/features/office`, `apps/web/public/art`, `tools/art-pipeline`, ngân sách offline của ADR-002.

## Related Tasks

TECH-005, FEAT-028 đến FEAT-033.

## Date

2026-11-01
