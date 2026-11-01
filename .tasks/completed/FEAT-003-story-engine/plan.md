# FEAT-003-story-engine — Plan

Trạng thái: COMPLETED

## Objective

Chạy được cốt truyện dạng dữ liệu: cảnh, thoại, lựa chọn, điều kiện, hiệu ứng. Viết truyện không phải sửa code, và
truyện sai thì không build được (ADR-001, `architecture/gameplay.md` §3).

## Scope

- `GameState` đầu tiên, seed và RNG nằm trong state.
- `applyAction(state, action, world)`: hàm thuần, hành động sai bị từ chối và state không đổi.
- Đồ thị truyện: thoại, lựa chọn có điều kiện và lý do khóa, hiệu ứng, nút rẽ nhánh theo điều kiện.
- `viewOf`: thứ UI cần vẽ, kể cả lựa chọn bị khóa và lý do.
- `replay`: chạy lại từ seed và chuỗi hành động, nền cho lượt chơi tự động.
- Schema zod và validator trong `packages/content`, chạy lúc build.

## Non-goals

- UI (FEAT-004), lịch tuần (FEAT-005), tiền và chỉ số (FEAT-006, 007): chỉ cần hiệu ứng `setFlag`, các loại khác thêm ở
  task của chúng.
- Save (FEAT-008). Nội dung truyện thật (FEAT-009).

## Affected systems

`packages/game-core` (`state`, `story`, `actions`), `packages/content` (`story`, `scripts`).

## Implementation steps

1. Kiểu dữ liệu, `createGameState`, điều kiện, hiệu ứng.
2. Engine: vào cảnh, đi tiếp, chọn, `viewOf`, `applyAction`, `replay`.
3. Schema và validator, nối vào build của `content`.

## Acceptance criteria

- Cùng seed và cùng chuỗi hành động cho cùng state, kể cả sau khi qua JSON.
- Bấm một lựa chọn hai lần không nhân đôi hiệu ứng: lần sau bị từ chối.
- Lựa chọn khóa hiện kèm lý do và không chọn được.
- Validator bắt: nút cụt, `next` sai, không tới được, không thoát được, tất cả lựa chọn đều có thể khóa, thiếu lý do khóa,
  nhân vật lạ, flag đọc mà không ai đặt, vòng lặp rẽ nhánh.
- Truyện sai làm `pnpm build` đỏ.

## Risks

Đồ thị cần đủ mạnh cho Chương 4–6 mà không phình to: thêm loại hiệu ứng và điều kiện dạng dữ liệu khi cần.

## Dependencies

TECH-001.
