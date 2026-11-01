# Result — FEAT-002-disclaimer-gate

## What changed

Mọi route nằm sau `DisclaimerGate` ở root layout: chưa xác nhận phiên bản hiện tại thì chỉ thấy màn cảnh báo, kể cả vào
bằng link trực tiếp hay offline. "Game mới" luôn hỏi lại. Câu chữ chỉ ở `packages/content`, đổi thì tăng `version` và mọi
người phải xác nhận lại. Luật ở `game-core` (`shouldShowDisclaimer`). Menu có "Game mới", "Về game" và dòng nhắc.

## Decisions

Cổng thay cho redirect. Chặn ở client là đủ cho một lời cảnh báo, không phải cơ chế bảo mật.

## Known issues

Câu chữ là bản nháp của Claude, owner chưa duyệt, và chưa qua luật sư.
