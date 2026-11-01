# Current Project State

Handoff cho phiên làm việc tiếp theo. Lịch sử từng task nằm ở `.tasks/completed/<TASK-ID>/`.

## Project

Công ty C\* (tên làm việc): game đơn dark comedy theo cốt truyện, về nhân viên bị công ty nợ lương hơn sáu
tháng. Web, PWA chơi được offline, điện thoại dọc là chính. Không có server (ADR-001). Đọc `CLAUDE.md`,
`docs/Cong_Ty_C_GDD_v0.1.md`, `.project/roadmap.md`, `.project/architecture/overview.md`.

## State (2026-11-01)

- **Game hoàn chỉnh**: 44 cảnh, 6 kết thúc, văn phòng 3D bake ánh sáng, 10 nhân vật có tên, âm thanh, cài đặt, save v4, PWA offline, màn cảnh báo, điền tên người chơi, bố cục riêng cho điện thoại, tablet và PC.
- Art dựng bằng Blender từ code: `tools/art-pipeline`, ADR-005.
- Repo: <https://github.com/lctuandev/C-Star>, nhánh `main`, **public**. Chưa deploy.
- Toàn bộ roadmap xong trừ phần cần owner, ghi ở `backlog.md`.
- Số liệu, điều kiện ending, giọng văn, câu chữ cảnh báo đều chưa được owner duyệt.

## Active Task

Không có. M6 xong.

## Blockers

Deploy thật (TECH-004) chờ owner chọn tên miền và xác nhận `docs/content-review.md`. Image đã sẵn sàng, có E2E.

## Open Decisions (owner)

- Xác nhận sáu mục ở `docs/content-review.md`, nhất là tên "C\*".
- Bốn cái tên owner đưa cho lãnh đạo (FEAT-034, Fiction Check) chưa dùng: game dùng chức danh và tên hư cấu cho tới khi owner xác nhận chúng hoàn toàn do tưởng tượng.
- Chọn tên miền để deploy (`deploy/` đã sẵn sàng).
- Chơi thử trên điện thoại thật: giọng văn, số liệu, 3D có mượt không.

## Next Step

Chờ phản hồi của owner sau khi chơi thử.
