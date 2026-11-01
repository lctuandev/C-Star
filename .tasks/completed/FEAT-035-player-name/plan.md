# FEAT-035-player-name — Plan

Trạng thái: COMPLETED

## Objective

Người chơi điền tên khi vào game.

## Scope

Đơn ứng tuyển sau màn cảnh báo, tên trong GameState, save v4 kèm migration, `{name}` trong thoại, nhãn người nói, phiếu lương.

## Non-goals

Đổi luật kinh tế hay điều kiện ending.

## Affected systems

`packages/content`, `packages/game-core`, `apps/web`, `tools/art-pipeline`.

## Acceptance criteria

Tên hiện trong truyện, còn sau khi tải lại; không điền vẫn chơi được; save cũ không hỏng.

## Risks

Xem Fiction Check.

## Dependencies

FEAT-029, FEAT-033.
