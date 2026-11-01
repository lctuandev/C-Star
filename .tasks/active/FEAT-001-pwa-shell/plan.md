# FEAT-001-pwa-shell — Plan

Trạng thái: PLANNING

## Objective

Game cài được ra màn hình chính và chơi được không cần mạng, theo ADR-002. Yêu cầu của owner.

## Scope

- `manifest` tiếng Việt, `standalone`, `portrait`; icon 192, 512, maskable, apple-touch; metadata iOS.
- Service worker viết tay theo mẫu `apps/web/public/sw.js` của Alo, hàm định tuyến thuần để kiểm thử được.
- Script sau build sinh danh sách precache từ toàn bộ file đầu ra, tên cache gắn phiên bản build.
- Đăng ký service worker chỉ ở production.
- Cập nhật: bản mới ở trạng thái chờ, menu hiện lời mời, bấm mới áp dụng, không tự reload.
- Gợi ý cài đặt nhẹ nhàng ở menu: Android dùng `beforeinstallprompt`, iOS là hướng dẫn thêm vào Màn hình chính.
- Icon tạm, thay bằng icon thật ở M5.

## Non-goals

- Save (FEAT-008), thông báo đẩy, chiến lược cache cho 3D (TECH-002).

## Affected systems

`apps/web` (`app/manifest`, `features/pwa`, `public/sw.js`), script build, E2E.

## Implementation steps

1. Manifest, icon, metadata.
2. Service worker và script sinh precache, kèm test cho hàm định tuyến.
3. Đăng ký và luồng cập nhật có chờ.
4. Gợi ý cài đặt.
5. E2E offline; kiểm tra bằng Lighthouse và trên điện thoại thật.

## Acceptance criteria

- Chrome Android hiện cài đặt được; iOS Safari thêm vào Màn hình chính chạy `standalone`.
- Sau một lần mở có mạng: tắt mạng, tải lại, game mở được đầy đủ.
- Không còn file nào của bản build rơi ra ngoài precache.
- Có bản mới: không tự reload; bấm cập nhật thì sang bản mới; cache cũ bị dọn.
- Development không dùng service worker.

## Risks

- Service worker lỗi có thể giữ người chơi ở bản cũ: phải có test cập nhật.
- Hành vi cài đặt trên iOS không tự động hóa được: kiểm tra tay trên máy thật.
- Service worker ở Next static export cần đúng scope và header: xác nhận ở TECH-004.

## Dependencies

TECH-001.
