# Plan — FEAT-043-story-completion

## Objective

Owner yêu cầu hoàn thiện cốt truyện. Đo trên dữ liệu thấy quan hệ với Uyên (15 cảnh), Khoa, Roger, chị HR, cô Kế toán được cộng trừ suốt game mà không đổi được gì, ngoài con số ở Hồ sơ. Niềm tin cũng gần như không có tác dụng. Task này cho mỗi thứ một hậu quả và khép các tuyến còn hở.

## Scope

- Mỗi mối quan hệ đổi được ít nhất một đoạn truyện, có test giữ quy tắc này.
- Khép tuyến: 9 triệu ban đầu, người bạn mời việc, phiếu lương bị thiếu, chị HR, nhóm Vượt thác, hộp sữa sau lần kiệt sức, Dân sau cùng.
- Một lượt đọc độc lập toàn bộ kịch bản.

## Non-goals

Không thêm cảnh mới, không đổi điều kiện sáu kết thúc.

## Affected systems

`packages/content`, `apps/web/src/features/audio/sound-cues.ts`.

## Implementation steps

1. Đo. 2. Viết hậu quả. 3. Thêm người chơi cô độc vào test ngẫu nhiên. 4. Đọc độc lập, sửa.

## Acceptance criteria

`story-links.test.ts` không còn quan hệ nào vô tác dụng, mọi dòng thoại đều tới được, không còn lỗi ở lượt đọc độc lập.

## Risks

Nhánh dành cho người chơi lạnh nhạt dễ không ai thấy: có người chơi cô độc trong test.

## Dependencies

FEAT-042.
