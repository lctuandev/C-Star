# ADR-002 — PWA chơi được hoàn toàn offline

## Status

ACCEPTED (2026-11-01)

## Context

Owner yêu cầu game có PWA. Alo Khách Ơi chỉ có offline shell vì game cần server. C\* không có server, nên
có thể đi xa hơn: đã mở một lần là chơi hết game không cần mạng.

## Decision

- Build Next.js dạng **static export**, đầu ra là site tĩnh ở `apps/web/out` (đã xác minh ở TECH-001).
- **Service worker viết tay** theo mẫu `apps/web/public/sw.js` của Alo, với một khác biệt: precache **toàn bộ**
  file của bản build. Một script chạy sau build sinh danh sách file và gắn phiên bản build vào tên cache.
- Tải mới bằng service worker chờ sẵn: **không tự reload giữa lượt chơi**. Người chơi thấy lời mời cập nhật
  ở menu, bấm mới áp dụng.
- `manifest` đặt `display: standalone`, `orientation: portrait`, `lang: vi`, có icon thường và maskable.
- Save nằm trên IndexedDB, không bao giờ qua cache của service worker (`.project/contracts/save.md`).

## Why

- Sinh file precache từ bản build thì không thể quên một asset khi thêm nội dung.
- Không tự reload vì tải lại giữa cảnh hội thoại làm mất mạch truyện.

## Alternatives Considered

### Option A — Offline shell như Alo

- Bị loại: chỉ hợp với game cần server.

### Option B — Thư viện PWA (Serwist, Workbox)

- Khả thi, nhưng thêm phụ thuộc phải theo kịp Next trong khi mẫu viết tay đã chạy ổn ở Alo. Xét lại nếu 3D
  làm chiến lược cache phức tạp hơn nhiều.

## Consequences

### Positive

- Chơi trên tàu xe, mạng yếu, không tốn dữ liệu sau lần đầu.

### Negative

- Lần tải đầu phải có toàn bộ game, nên asset 3D phải giữ trong ngân sách (TECH-002).
- Service worker sai có thể ghim người chơi ở bản cũ: phải có test cập nhật (FEAT-001).
- iOS có thể dọn dữ liệu site ít dùng nếu chưa cài ra màn hình chính: xuất/nhập save là lối thoát.

## Affected Systems

`apps/web`, quy trình build, triển khai.

## Related Tasks

- FEAT-001-pwa-shell
- FEAT-008-save-and-continue

## Date

2026-11-01
