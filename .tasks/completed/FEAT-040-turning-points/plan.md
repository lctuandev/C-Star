# Plan — FEAT-040-turning-points

## Objective

Tăng kịch tính theo góp ý của GPT mà owner chuyển cho: nhiều bước ngoặt và lựa chọn có giá hơn, người chơi thấy rõ công ty đã nợ mình bao nhiêu, và kết thúc kể tiếp đời nhân vật một năm sau.

## Scope

- Hai chỉ số mới `outlook.trust` (niềm tin vào công ty) và `outlook.awareness` (hiểu quyền lợi), lưu trong `GameState`.
- Sổ lương `paidByMonth`, `ledgerOf`, `heldKpiOf`, `summaryOf` trong `game-core`. Save v5.
- Sáu cảnh mới: `ch4-khoa-stairs`, `ch4-roger-crack`, `ch4-performance-review`, `ch5-wrong-number`, `ch5-closed-door`, `ch6-empty-office`.
- Viết lại đợt trả chọn lọc trong `ch4-second-tranche`.
- Hai lựa chọn khóa theo chỉ số: `negotiate` (chương 5), `walk-away` (chương 4).
- Đoạn "Một năm sau" cho cả sáu kết thúc.
- Tiếng cho mọi lựa chọn mới, Sổ lương trong Hồ sơ, bảng tổng kết ở màn kết thúc.

## Non-goals

- NPC tránh mặt người chơi trong 3D và biểu cảm theo từng câu thoại: chưa làm, ghi ở backlog.
- Không đổi điều kiện của sáu kết thúc.
- Lời nghe lén không thành giấy tờ trong Hồ sơ (contracts/content.md §4).

## Khác với góp ý của GPT

- Khoa rời công ty ở tháng 5, nên cuộc nói chuyện ở cầu thang đặt ngay trước đó, không phải sau.
- Trả lương chọn lọc giữ ở chương 4 theo đúng brief của owner.
- Hóa đơn và hệ thống tiền đã có sẵn, không làm lại.

## Affected systems

`packages/game-core`, `packages/content`, `apps/web/src/features/{save,dossier,endings,audio}`, `apps/e2e/tools/play.ts`, save contract.

## Implementation steps

1. Luật: outlook, sổ lương, summary, migration v5.
2. Hiệu ứng trên các lựa chọn cũ.
3. Cảnh mới, epilogue, tiếng.
4. Giao diện Hồ sơ và kết thúc.
5. Sinh lại `docs/kich-ban-day-du.md`.

## Acceptance criteria

- Mọi dòng thoại đều tới được (test người chơi ngẫu nhiên), không có ngõ cụt (validator).
- Save v4 mở được và ra đúng v5.
- Sáu kết thúc đều có "Một năm sau".
- Mọi lựa chọn có tiếng.

## Risks

Điều kiện mở khóa `negotiate` và `walk-away` là phỏng đoán, cần chơi thử.

## Dependencies

FEAT-038, ADR-006.
