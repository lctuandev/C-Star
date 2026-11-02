# Progress — BUG-001-cloudflare-beacon

- E2E trên site thật sau khi phát hành `cefc40d` bắt được script `cloudflareinsights`.
- Thêm `no-transform` ở nginx, sửa test QR đọc ảnh quá sớm, thử trên cổng phụ 6011 để không đụng site.
- Commit `3088b75`, owner đồng ý phát hành. Script biến mất, E2E trên site thật qua 22/22.

Không lệch kế hoạch. Không cần owner tắt trong dashboard Cloudflare, vì `no-transform` đã đủ.
