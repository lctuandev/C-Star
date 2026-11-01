# FEAT-006-money-and-bills — Plan

Trạng thái: COMPLETED

## Objective

Sinh tồn tài chính: tiền, hóa đơn, sổ nợ công ty, và phiếu lương cuối tháng (GDD §5.1).

## Scope

`money`, phiếu lương trong state, hóa đơn cố định và bất ngờ theo seed, `payroll` theo tháng, HUD tiền, `PayslipScreen`.

## Non-goals

Khủng hoảng hết tiền và khoản vay (FEAT-014).

## Acceptance criteria

- Tiền không bao giờ âm, phần thiếu vào `arrears` và trả trước ở kỳ sau.
- Sổ nợ tăng đúng phần lương không trả, chỉ giảm bằng hiệu ứng `companyPays`.
- Tải lại vẫn thấy đúng phiếu lương đó.

## Risks

Số tiền là phỏng đoán, chờ owner chơi thử.
