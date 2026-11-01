# Plan — FEAT-039-staged-art

## Objective

Thế giới phải đổi theo cốt truyện: băng rôn "Vượt thác hóa rồng" xuất hiện trong văn phòng 3D, và ảnh nền 2D (dùng khi tắt 3D hoặc máy yếu) cũng đổi theo tháng thay vì đứng yên.

## Scope

- Decal và mesh `DYN_banner` trong `tools/art-pipeline`, hiện từ tháng 4 (`officeMood.banner`).
- Render văn phòng, bàn làm việc, hành lang ở bốn giai đoạn `early`, `signs`, `mid`, `late` (`signs` thêm ở FEAT-041: tháng 2–3 chưa có băng rôn).
- `Backdrop` chọn ảnh theo `officeStageOf(month)`, phai màu theo `drainOf(month)`.

## Non-goals

Không đổi layout văn phòng, không thêm nhân vật, không đổi ngân sách của ADR-005.

## Affected systems

`tools/art-pipeline`, `apps/web/public/art`, `apps/web/src/features/office`, `apps/web/src/features/play/PlayScreen.tsx`.

## Implementation steps

1. Decal băng rôn, mesh động trong `office.py`, bake lại.
2. `render_art.py`: `STAGES`, `dress`, `staff`.
3. Web: `officeStageOf`, `drainOf`, `Backdrop`, test.

## Acceptance criteria

- Tháng 1 đến 3 không có băng rôn, từ tháng 4 có.
- Ảnh 2D các giai đoạn khác nhau rõ, tháng sau tối và vắng hơn tháng trước.
- Art qua `validate --public`, ngân sách không đổi.

## Risks

Chín ảnh thay vì ba làm tăng dung lượng precache: kiểm tra ngân sách offline của ADR-002.

## Dependencies

TECH-005, FEAT-029 đến FEAT-033.
