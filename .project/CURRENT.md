# Current Project State

Handoff cho phiên làm việc tiếp theo. Lịch sử từng task nằm ở `.tasks/completed/<TASK-ID>/`.

## Project

Công ty C\* (tên làm việc): game đơn dark comedy theo cốt truyện, về nhân viên bị công ty nợ lương hơn sáu
tháng. Web, PWA chơi được offline, điện thoại dọc là chính. Không có server (ADR-001). Đọc `CLAUDE.md`,
`docs/Cong_Ty_C_GDD_v0.1.md`, `.project/roadmap.md`, `.project/architecture/overview.md`.

## State (2026-11-01)

- **Game hoàn chỉnh**: 47 cảnh, 6 kết thúc, văn phòng 3D bake ánh sáng, 10 nhân vật có tên, âm thanh từng hành động và nhạc đổi theo tháng (ADR-006), cài đặt, save v4, PWA offline, màn cảnh báo, điền tên người chơi, bố cục riêng cho điện thoại, tablet và PC.
- Art dựng bằng Blender từ code: `tools/art-pipeline`, ADR-005.
- Đang chạy công khai: <https://c-star.lctuan.space> (Docker `127.0.0.1:6000`, Cloudflare Tunnel, cách phát hành ở `.tasks/completed/TECH-004-production-deploy/result.md`). Site đang ở commit `6dcc9cb`.
- Repo: <https://github.com/lctuandev/C-Star>, nhánh `main`, **public**.
- Toàn bộ roadmap xong trừ phần cần owner, ghi ở `backlog.md`.
- Số liệu, điều kiện ending, giọng văn, câu chữ cảnh báo đều chưa được owner duyệt.

## Active Task

Không có. M6 xong.

## Blockers

Không có.

## Open Decisions (owner)

- Xác nhận sáu mục ở `docs/content-review.md`, nhất là tên "C\*".
- Chơi thử trên điện thoại thật: giọng văn, số liệu, 3D có mượt không, và nghe thử âm thanh: chưa ai nghe bằng tai.

## Next Step

Chờ phản hồi của owner sau khi chơi thử.
