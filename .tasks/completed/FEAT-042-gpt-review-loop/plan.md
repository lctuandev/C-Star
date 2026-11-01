# Plan — FEAT-042-gpt-review-loop

## Objective

Owner yêu cầu gửi kịch bản đầy đủ cho GPT review để các lựa chọn hợp lý, cốt truyện mạch lạc, rồi sửa theo kết quả, lặp lại cho tới khi GPT thấy ổn. Làm tới đâu push, deploy tới đó. Trong lúc đó owner yêu cầu thêm: lời thoại đời hơn, vài nhân viên nói kiểu Gen Z; nhiệm vụ tuần dễ hiểu hơn; bỏ tiếng đèn ở đầu game.

## Scope

Nội dung truyện, điều kiện kết thúc, cân bằng lựa chọn, màn tuần và ticket, âm thanh nền.

## Non-goals

Không thêm cảnh. Không đổi khung 6 chương theo tháng. Không làm theo góp ý nào làm mất chất hài hoặc mâu thuẫn với brief của owner: ghi lý do ở `review-1.md`.

## Affected systems

`packages/content`, `packages/game-core` (`ActionView.effects`), `apps/web/src/features/{week,tickets,audio}`.

## Implementation steps

1. Gửi kịch bản theo 3 phần, đọc đủ.
2. Lọc góp ý, sửa, test, push, deploy.
3. Gửi lại phần đã đổi, lấy kết luận.
4. Lặp lại tới khi không còn P0, P1.

## Acceptance criteria

GPT kết luận ĐẠT, hoặc chỉ còn những điểm đã có lý do từ chối ghi trong tài liệu.

## Risks

GPT đọc bản Markdown nên có thể nhầm nhánh với lỗi. GPT luôn tìm được điều để góp ý: dừng khi không còn P0, P1 có căn cứ.

## Dependencies

FEAT-041.
