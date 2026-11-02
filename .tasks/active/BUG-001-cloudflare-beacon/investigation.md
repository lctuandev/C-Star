# Investigation — BUG-001-cloudflare-beacon

## Triệu chứng

Sau khi phát hành `cefc40d`, test `keeps the promises of the policy` chạy với `E2E_EXTERNAL_URL=https://c-star.lctuan.space` báo đỏ: trình duyệt tải `https://static.cloudflareinsights.com/beacon.min.js/...` ở cả `/` và `/policy`.

Trang `/policy` ghi "không dùng công cụ theo dõi", nên trên site thật câu này đang sai.

## Nguyên nhân

Cloudflare tự chèn script Web Analytics vào HTML khi trả về qua proxy. Bản build và nginx không chứa script này: HTML ở `127.0.0.1:6000` không có.

## Vì sao audit trước không thấy

- Audit của FEAT-044 chỉ đọc bản build và dùng `curl` với user agent mặc định.
- Cloudflare chỉ chèn khi yêu cầu trông như trình duyệt. `curl` thường không nhận script, `curl` với user agent Chrome và `Accept: text/html` thì nhận.
- E2E trong bộ chạy thường dùng bản build cục bộ, không qua Cloudflare.

Kết luận "không tải gì từ máy chủ ngoài" vì vậy chỉ đúng với bản build, không đúng với site thật.

## Lỗi phụ

Test `the coffee fits a small phone` đọc `naturalWidth` ngay khi ảnh vừa hiện. Máy cục bộ tải kịp, site thật thì chưa, nên ra 0. Ảnh không lỗi: đọc lại sau vài giây thì test qua, và file trên site trùng SHA-256 với file trong repo.
