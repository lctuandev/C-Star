# FEAT-004-dialogue-ui — Plan

Trạng thái: COMPLETED

## Objective

Người chơi đọc truyện và chọn đáp án bằng một ngón tay trên điện thoại dọc (`ux-direction.md` §3).

## Scope

- `/play`: nền theo địa điểm, hộp thoại ở phần dưới, trong tầm ngón cái.
- Chữ chạy, chạm một lần hiện hết, chạm lần nữa đi tiếp. Giảm chuyển động thì không chạy chữ.
- Lựa chọn, lựa chọn khóa kèm lý do. Lịch sử thoại. Phím Space, Enter, 1–4 trên máy tính.
- `useGameStore`: nơi duy nhất UI gọi `applyAction`.
- Tên và chân dung tạm cho nhân vật. Cảnh mở đầu thật của Chương 1.

## Non-goals

Lịch tuần (FEAT-005), HUD (FEAT-006), save (FEAT-008), minh họa thật (M3 hoặc FEAT-016).

## Affected systems

`packages/content` (nhân vật, địa điểm, cảnh đầu), `packages/game-core` (`Scene.place`), `apps/web` (`features/play`,
`features/dialogue`).

## Implementation steps

1. Nhân vật, địa điểm, cảnh mở đầu.
2. `useGameStore`.
3. Hộp thoại, chữ chạy, lựa chọn, lịch sử, phím.
4. E2E trên nội dung thật, hai viewport, và 360 px.

## Acceptance criteria

- Chơi trọn cảnh mở đầu bằng cách chỉ chạm hộp thoại và lựa chọn.
- Chạm khi chữ đang chạy chỉ hiện hết chữ, không nhảy câu.
- Chữ thoại tối thiểu 16 px, nút tối thiểu 44 px, đọc được ở 360 px, không cuộn ngang.
- Lựa chọn khóa không bấm được và hiện lý do.

## Risks

Chữ chạy quá chậm gây khó chịu: tốc độ mặc định nhanh, FEAT-027 cho chỉnh.

## Dependencies

FEAT-003.
