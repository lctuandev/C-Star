# @cstar/art-pipeline

Blender → GLB → tối ưu → kiểm ngân sách → web (ADR-005). Mọi thứ dựng từ code, chạy lại được, không có file `.blend`
trong repo. Kết quả nằm ở `apps/web/public/art/` và được commit: CI và máy không có Blender vẫn build được game.

Cần: Blender 5.x trên `PATH`, Python 3 có Pillow, Node 24, `pnpm install`.

## Lệnh

| Lệnh (`pnpm --filter @cstar/art-pipeline …`) | Làm gì                                                                |
| -------------------------------------------- | --------------------------------------------------------------------- |
| `art`                                        | Toàn bộ dưới đây, khoảng 25 phút trên CPU 8 nhân                       |
| `textures`                                   | Vẽ lại atlas decal từ `textures/decal-text.json`                       |
| `office:build`                               | Dựng văn phòng và nhà riêng, bake lightmap bằng Cycles → `out/`        |
| `office:denoise`                             | Khử nhiễu lightmap bằng Open Image Denoise                             |
| `office:export`                              | Mã hóa lightmap, xuất GLB thô                                          |
| `people:build`, `people:export`              | Nhân vật có xương                                                      |
| `optimize`                                   | Meshopt, WebP, gộp trùng                                               |
| `validate`                                   | Kiểm `budgets/*.json`, vượt thì exit 1. `--public` kiểm file đã commit |
| `publish:art`                                | Chép GLB vào web, ghi `office-plan.json`                               |
| `render`, `encode`                           | Render nền, chân dung, ảnh bìa rồi nén WebP                            |
| `icons`                                      | Sinh favicon và icon PWA từ `docs/brand/logo-mark.svg`                 |

Xem hình trong game: chạy web rồi `pnpm --filter @cstar/e2e shots` (biến `E2E_EXTERNAL_URL`), ảnh nằm ở
`apps/e2e/test-results/shots/`.

## Cấu trúc

```text
blender/kit.py             Dựng lưới theo hệ tọa độ của game: hộp, trụ, loft, ảnh dán, vật liệu
blender/lightmap.py        Trải UV dùng chung, bake ánh sáng (không gồm màu)
blender/office_props.py    Từng món đồ, đo bằng mét
blender/office.py          Mặt bằng: đặt đồ, đèn, va chạm. Nguồn sự thật của `office-plan.json`
blender/characters.py      Một cơ thể, nhiều trang phục, xương dựng đứng
blender/render_art.py      Ảnh 2D, dùng cùng tư thế với `pose.ts`
cameras.json               Camera của game và của ảnh render
textures/                  Atlas decal; chữ nằm ở decal-text.json, được fiction test đọc
budgets/                   Trần cho từng model
```

## Quy ước

- Tọa độ trong script là tọa độ game: Y hướng lên, camera ở phía +Z. Blender chỉ thấy ở `Geo.to_object`.
- Tường gần và trần chỉ để bake, không xuất ra game.
- Đồ đổi theo tháng tên `DYN_*`, vẫn nằm trong bake: bóng của nó ở lại khi nó biến mất, đó là chủ ý.
- Thêm đồ chắn đường thì gọi `plan.solid(...)`: `nav.ts` tìm đường từ danh sách đó.
- Muốn đổi chữ trên tường: sửa `decal-text.json`, không sửa script vẽ.
