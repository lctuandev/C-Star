# FEAT-008-save-and-continue — Plan

Trạng thái: COMPLETED

## Objective

Tắt game lúc nào cũng được, mở lại đúng chỗ đó, không mất gì và không nhân đôi gì (`contracts/save.md`).

## Scope

- Autosave sau mỗi hành động, ghi vào IndexedDB, ghi tuần tự.
- Định dạng có `saveVersion`, schema kiểm tra khi đọc, migration, fixture từng phiên bản.
- Menu có "Tiếp tục". "Game mới" khi đang có lượt chơi phải xác nhận.
- Save hỏng: báo rõ, không ghi đè, cho xuất file.
- Xuất và nhập save bằng file ở "Về game".
- `resumeRun` trong `game-core`: save trỏ tới cảnh đã bị đổi tên không làm kẹt người chơi.

## Non-goals

Nhiều ô save, đồng bộ giữa thiết bị (`roadmap.md` §8).

## Affected systems

`apps/web/src/features/save`, `game-store`, menu, `/about`, `/play`, `packages/game-core`.

## Implementation steps

1. Định dạng, schema, migration, fixture.
2. Backend IndexedDB, hàng đợi autosave.
3. Menu, xác nhận game mới, save hỏng, xuất và nhập.
4. E2E: tải lại giữa chừng, offline, save hỏng, bộ nhớ bị chặn.

## Acceptance criteria

- Tải lại ở mọi pha: giữa cảnh, trong tuần, ở phiếu lương, không mất và không nhân đôi hiệu ứng.
- Save hỏng không bao giờ bị ghi đè nếu người chơi chưa đồng ý, và xuất được.
- Bộ nhớ đầy hoặc bị chặn: game vẫn chạy, có báo.
- Mỗi `saveVersion` có fixture, test nạp lại được.
- Chạy được offline.

## Risks

Hai tab cùng ghi: bản ghi sau thắng. Chấp nhận với game đơn, ghi vào known issues.

## Dependencies

FEAT-003, FEAT-005.
