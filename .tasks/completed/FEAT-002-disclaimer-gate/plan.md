# FEAT-002-disclaimer-gate — Plan

Trạng thái: COMPLETED

## Objective

Trước khi vào game, người chơi phải đọc và xác nhận rằng nội dung là hư cấu, không phải thông tin thật và
không nhắm vào ai. Yêu cầu của owner, ADR-003.

## Scope

- Màn cảnh báo toàn màn hình, một nút xác nhận, câu chữ từ `contracts/content.md` §5.
- Câu chữ và số phiên bản đặt ở `packages/content`, là nguồn duy nhất.
- Luật hiện/ẩn là hàm thuần trong `game-core`, có test.
- Lưu phiên bản đã xác nhận trên thiết bị.
- Hiện khi: lần đầu mở, câu chữ đổi phiên bản, mỗi lần bắt đầu game mới.
- Chặn route chơi: vào thẳng `/play` hay có save cũ mà chưa xác nhận thì về màn cảnh báo.
- Một dòng ngắn ở menu, xem lại đầy đủ được ở "Về game" (bản đơn giản, FEAT-027 làm tiếp).

## Non-goals

- Màn "Về game" đầy đủ (FEAT-027).
- Nội dung nhắc lại ở màn kết (FEAT-023).
- Tư vấn pháp lý cho câu chữ: owner tự quyết định có hỏi luật sư hay không.

## Affected systems

`packages/content`, `packages/game-core`, `apps/web` (route, `features/disclaimer`), E2E.

## Implementation steps

1. Thêm câu chữ, phiên bản vào `content`; hàm `shouldShowDisclaimer` vào `game-core`, kèm test.
2. Màn cảnh báo theo `ux-direction.md` §5.
3. Lưu xác nhận, xử lý khi không ghi được bộ nhớ.
4. Chặn route, nối vào "Game mới".
5. E2E trên hai viewport, kể cả offline.

## Acceptance criteria

- Không có đường nào vào màn chơi nếu chưa xác nhận phiên bản hiện tại, kể cả link trực tiếp hay reload.
- Đã xác nhận thì mở app không bị hỏi lại, nhưng "Game mới" thì có.
- Tăng phiên bản câu chữ: người đã xác nhận phải xác nhận lại.
- Không ghi được bộ nhớ: vẫn vào được game sau khi xác nhận, lần sau hỏi lại.
- Chạy được offline, đọc được ở 360 px, nút tối thiểu 44 px.
- Chỉ có một nơi chứa câu chữ.

## Risks

- Chặn chỉ ở client vì không có server: đủ cho một lời cảnh báo, không phải cơ chế bảo mật.
- Lời cảnh báo không thay được việc giữ nội dung hư cấu (ADR-003).

## Dependencies

TECH-001. Nối được vào "Game mới" khi FEAT-005 có; trước đó nối vào nút vào game tạm.
