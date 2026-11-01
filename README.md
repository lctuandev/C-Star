# Công ty C\*

<img src="docs/brand/logo.png" alt="Logo C*" width="128">

Tên làm việc. Game web đơn theo cốt truyện, thể loại dark comedy, về nhân viên bị công ty nợ lương hơn sáu
tháng. Toàn bộ là hư cấu: mọi công ty, nhân vật và sự kiện đều do tưởng tượng, không phải thông tin thật và
không nhắm vào cá nhân hay tổ chức nào.

## Trạng thái

Chơi trọn được: 37 cảnh, 6 kết thúc, PWA offline, văn phòng 3D có ánh sáng bake, nhân vật có xương, chạy trên điện thoại, tablet và PC. Bản chạy thật: <https://c-star.lctuan.space>. Xem [.project/CURRENT.md](.project/CURRENT.md).

## Chạy dự án

Cần Node 24 và pnpm 11.

```bash
pnpm install
pnpm dev
```

Mở <http://localhost:5200>. Kiểm tra: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`. Lần đầu chạy E2E
cần `pnpm --filter @cstar/e2e exec playwright install chromium`.

Đồ họa dựng bằng Blender từ code, xem [tools/art-pipeline](tools/art-pipeline/README.md). Kết quả đã commit, không cần Blender để chạy game.

## Tài liệu

- [GDD](docs/Cong_Ty_C_GDD_v0.1.md)
- [Roadmap](.project/roadmap.md)
- [Kiến trúc](.project/architecture/overview.md)
- [Quyết định](.project/decisions/)

## Quy trình

Làm theo [CLAUDE.md](CLAUDE.md), cùng flow với Alo Khách Ơi: Plan → Implement → Verify → Fix → Regression → Complete.

| Lệnh         | Việc                                                  |
| ------------ | ----------------------------------------------------- |
| `/plan`      | Tạo Task ID và tài liệu trong `.tasks/active/`        |
| `/implement` | Làm task đang active                                  |
| `/test`      | Chạy và ghi kết quả vào `test.md`                     |
| `/review`    | Rà trước khi hoàn thành                               |
| `/fix`       | Sửa bug theo quy trình điều tra                       |
| `/status`    | Xem tình trạng hiện tại                               |
| `/continue`  | Tiếp tục ở phiên mới                                  |
