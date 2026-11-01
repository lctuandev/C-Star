# ADR-003 — Hư cấu hoàn toàn và lời cảnh báo trước khi vào game

## Status

ACCEPTED (2026-11-01)

## Context

Owner yêu cầu trước khi vào game phải có ghi chú rằng nội dung không phải thông tin thật và không nhắm vào
ai. Kịch bản lấy cảm hứng từ chuyện nợ lương, và kịch bản gốc còn để ngỏ mức liên hệ với thực tế.

Lời cảnh báo không tự bảo vệ được nếu nội dung vẫn nhận diện được một công ty hay một người cụ thể. Vì vậy
quyết định này gồm hai phần: **cảnh báo** và **bản thân nội dung phải hư cấu**.

## Decision

1. Chọn mức **hư cấu hoàn toàn**. Bỏ hai phương án "châm biếm sát thực tế" và "bán tự truyện".
2. Mọi nội dung tuân theo `.project/contracts/content.md`: không tên, logo, số liệu, địa chỉ hay sự kiện thật.
3. Có **màn cảnh báo bắt buộc** trước khi vào game (FEAT-002), không thể bỏ qua bằng link trực tiếp.
4. Câu chữ nằm ở một nơi duy nhất, `packages/content`, có số phiên bản. Đổi câu chữ thì tăng phiên bản, người
   chơi cũ phải xác nhận lại.
5. "C\*" chỉ là tên làm việc. Trước khi phát hành công khai phải chốt tên hư cấu và rà soát nội dung (TECH-003).

## Why

- Hư cấu hoàn toàn khớp với chính nội dung cảnh báo owner yêu cầu: nói không có thật mà viết sát thật là tự mâu thuẫn.
- Nhân vật dạng biểu tượng cũng là điều kịch bản gốc đề xuất.

## Alternatives Considered

### Option A — Châm biếm sát thực tế, đổi tên và chi tiết

- Bị loại: càng sát càng dễ nhận diện, lời cảnh báo mất tác dụng.

### Option B — Chỉ một dòng nhỏ ở cuối trang

- Bị loại: không đạt yêu cầu "trước khi vào game".

## Consequences

### Positive

- Có một ranh giới rõ để kiểm tra mỗi khi viết nội dung.

### Negative

- Mỗi task nội dung thêm một bước kiểm tra hư cấu.
- ADR này không phải tư vấn pháp lý. Nếu phát hành rộng hoặc tên "C\*" gợi tới một công ty có thật, owner nên hỏi
  luật sư trước.

## Affected Systems

`packages/content`, `apps/web` (điều hướng), mọi task nội dung.

## Related Tasks

- FEAT-002-disclaimer-gate
- TECH-003-content-review

## Date

2026-11-01
