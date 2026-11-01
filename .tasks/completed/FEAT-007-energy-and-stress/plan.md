# FEAT-007-energy-and-stress — Plan

Trạng thái: COMPLETED

## Objective

Năng lượng và căng thẳng thay đổi theo hành động và sự kiện, thấy được trên HUD (GDD §5.2).

## Scope

`mood` trong state, hiệu ứng `addEnergy`, `addStress`, `chance`, điều kiện `stat`, thanh chỉ số trên HUD. Không đủ sức thì
hành động bị khóa. Không trả lương thì tăng căng thẳng.

## Non-goals

Kiệt sức là khủng hoảng ở FEAT-014.

## Acceptance criteria

Chỉ số luôn trong 0–100 dù làm gì. Thay đổi hiện ngay trên HUD.
