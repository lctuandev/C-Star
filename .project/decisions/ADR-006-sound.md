# ADR-006 — Tiếng thu sẵn và nhạc sinh bằng code

## Status

ACCEPTED (2026-11-01). Mở rộng quyết định "không có file âm thanh" của FEAT-026.

## Context

Owner thấy game thiếu tiếng: gõ chữ khi hội thoại, nhạc, và tiếng riêng cho từng trường hợp, từng lựa chọn. Bản cũ chỉ có ba tiếng tổng hợp và tiếng đèn.

## Decision

- **Tiếng thu sẵn** cho thứ cần chất thật: click, tick gõ chữ, tiền xu, thông báo. Dùng lại các file CC0 trong thư viện âm thanh của Alo Khách Ơi, mono 22 kHz, tổng 276 KB, ghi nguồn ở `docs/sound-credits.md`.
- **Nhạc nền sinh bằng Web Audio từ code** (`score.ts`, `music.ts`): không tốn dung lượng, và đổi theo truyện. Nhạc đi cùng tâm lý nhân vật qua 6 giai đoạn, mỗi giai đoạn chậm hơn, tối hơn và lệch hơn giai đoạn trước: tháng 1 vui tươi nảy nhịp, tháng 2 nhạc thang máy, tháng 3–4 sang giọng thứ và mất trống, tháng 5–6 mệt mỏi đứt câu, tháng 7 trống rỗng, tháng 8 gần như chỉ còn một nốt trầm. Căng thẳng cao hoặc kiệt sức đẩy nhạc tối sớm một giai đoạn. Nhà riêng ấm lúc đầu rồi cũng lạnh dần, khủng hoảng thì căng, mỗi kết thúc có màu riêng.
- **Mọi tiếng đều suy ra từ thay đổi của state** ở `cueFor`, rules không biết gì về âm thanh. Mỗi lựa chọn trong truyện có tiếng riêng theo đúng nội dung (`CHOICE_CUES`): vỗ tay, kéo ghế, viết, gõ cửa, gọi điện, thở dài... Có test bắt buộc lựa chọn mới phải có tiếng. Lựa chọn chưa được gán thì nghe theo hậu quả của nó.
- **Ngày lương không có lương vẫn im lặng tuyệt đối**, không thêm tiếng nào: sự im lặng đó là ý đồ của GDD §7.
- Cue nào dùng file đều có bản tổng hợp dự phòng: không tải được file thì game vẫn có tiếng.
- Nhạc và tiếng gõ chữ tắt được riêng trong Cài đặt. Trên master có limiter để nhiều tiếng chồng nhau không bị vỡ.

## Why

- Click và tick tổng hợp nghe giả ngay, trong khi file chỉ tốn vài KB.
- Nhạc thu sẵn vài phút tốn nhiều MB trong precache, và không đổi theo tháng được.

## Consequences

- Precache thêm 0,3 MB.
- **Claude không nghe được âm thanh.** Mức to, không vỡ và không có lỗi đã đo bằng E2E, còn hay hay dở phải do owner nghe.

## Affected Systems

`apps/web/src/features/audio`, `apps/web/public/audio`, cài đặt.

## Related Tasks

FEAT-036-sound-and-music.

## Date

2026-11-01
