# Plan — FEAT-044-policy-and-donate

## Objective

Trang chủ có dòng chính sách nhỏ ở dưới, và nút mời tác giả ly cà phê bằng mã VietQR của owner.

## Scope

Trang `/policy`, liên kết ở chân trang chủ, hộp thoại QR.

## Non-goals

Không tích hợp cổng thanh toán, không theo dõi ai đã ủng hộ, không có quyền lợi trong game.

## Affected systems

`packages/content/src/policy.ts`, `apps/web/src/app/policy`, `apps/web/src/features/landing`, `apps/web/public/donate`.

## Implementation steps

1. Tìm hiểu quy định. 2. Kiểm tra site thật sự không theo dõi. 3. Viết trang. 4. Nén QR, giải mã đối chiếu với bản gốc. 5. Test giữ lời hứa của chính sách.

## Acceptance criteria

Mọi điều trong chính sách đúng với bản build. QR nén đọc ra giống hệt bản gốc. Vừa màn hình 320 px.

## Risks

Chính sách chưa qua luật sư. Tài khoản ngân hàng cá nhân hiện công khai trên site và trong repo, theo yêu cầu của owner.

## Dependencies

Không.
