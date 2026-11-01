# FEAT-034-leadership-cast — Plan

Trạng thái: COMPLETED

## Objective

Bổ sung tầng lãnh đạo và các chi tiết owner yêu cầu.

## Scope

Chủ tịch ít xuất hiện; Phó giám đốc thay vai Sếp, màn "đào được 1–2 triệu đô" tháng 6; anh Tín tin mù quáng; anh Minh tỉnh táo; lời hứa this week/next week; vay người thân, vay tín dụng; rời sớm thì bị kêu "tiếc".

## Non-goals

Đổi luật kinh tế hay điều kiện ending.

## Affected systems

`packages/content`, `packages/game-core`, `apps/web`, `tools/art-pipeline`.

## Acceptance criteria

Có mặt ở đủ các chương, validator xanh, bot tới đủ sáu ending.

## Risks

Xem Fiction Check.

## Dependencies

FEAT-029, FEAT-033.

## Fiction Check

Owner đưa bốn cái tên riêng kèm mô tả rất cụ thể. Chúng nghe như người có thật, trong khi game kể họ nợ lương nhân viên, và
`contracts/content.md` §1 cấm tên và đặc điểm nhận dạng của người có thật. Vì vậy trong game chỉ dùng vai trò và tính cách: Chủ tịch, Phó giám đốc,
anh Tín (trưởng phòng), anh Minh (phó phòng), không ghi quốc tịch. Các tên đó cũng không được ghi vào repo này, vì repo đang public.
Tín và Minh là tên phổ biến, cố ý gợi "tin" và "minh mẫn". Đổi tên chỉ cần sửa `characters.ts`, nếu owner xác nhận tên gốc hoàn toàn hư cấu.
