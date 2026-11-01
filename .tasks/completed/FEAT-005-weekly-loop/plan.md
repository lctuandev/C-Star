# FEAT-005-weekly-loop — Plan

Trạng thái: COMPLETED

## Objective

Nhịp chơi tháng–tuần: mỗi tuần 3 lượt hành động, cảnh cốt truyện chen vào đúng lúc (GDD §4).

## Scope

`phase`, `calendar` trong state; `GameWorld`; hành động tuần dạng dữ liệu; lịch cảnh (`Beat`); `beginRun`; màn hình tuần;
validator cho lịch và hành động.

## Non-goals

Mini-game KPI (FEAT-012), khủng hoảng (FEAT-014).

## Acceptance criteria

- Hết lượt mới sang tuần sau, luật nằm hết trong `game-core`.
- Cảnh của tuần chạy đúng lúc, một lần, chờ được điều kiện.
- Hành động bị khóa hiện lý do, luôn còn một hành động mở (validator ép).
- Hết nội dung thì dừng đúng chỗ.

## Risks

Một lượt chơi dài: 7 tháng × 4 tuần × 3 lượt = 84 hành động. Đo lại khi có đủ chương.
