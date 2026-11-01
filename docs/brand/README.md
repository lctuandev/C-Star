# Logo C\*

Chữ C vẽ như ống đèn huỳnh quang văn phòng (GDD §7). Dấu `*` màu vàng phiếu lương vừa là ngôi sao trong "C Star", vừa là
dấu chú thích ở cuối hợp đồng. Một cánh tối hơn là bóng đèn sắp cháy, cũng là chi tiết "có gì đó không ổn".

| File                             | Dùng cho                               |
| -------------------------------- | -------------------------------------- |
| `logo-mark.svg`                  | Bản gốc, nền trong suốt, sửa ở đây, rồi chạy `pnpm --filter @cstar/art-pipeline icons` |
| `logo.svg`, `logo.png`           | Logo trên nền tối, bo góc              |
| `apps/web/src/app/icon.svg`      | Favicon                                |
| `apps/web/src/app/apple-icon.png` | Icon màn hình chính trên iOS           |
| `apps/web/public/icons/`         | Icon PWA 192, 512, maskable            |

Màu: `#9ff0dc` (đèn), `#ffc83d` (dấu sao), `#8d6a1c` (cánh sắp cháy), `#0d1220` (nền). Bản maskable thu nhỏ còn 62 % để nằm trong vùng cắt
tròn của launcher.

## Nguồn gốc

Vẽ tay bằng SVG, 2026-11-01. Đã thử sinh bằng AI (Pollinations) nhưng hai ảnh nhận được đều không dùng được: không ra
chữ C, hoặc chữ vỡ. Trong repo không có ảnh AI nào.

Sẽ rà lại cùng tên game ở TECH-003: logo chưa được tra trùng với thương hiệu có thật.
