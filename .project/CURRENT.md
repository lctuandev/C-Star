# Current Project State

Handoff cho phiên làm việc tiếp theo. Lịch sử từng task nằm ở `.tasks/completed/<TASK-ID>/`.

## Project

Công ty C\* (tên làm việc): game đơn dark comedy theo cốt truyện, về nhân viên bị công ty nợ lương hơn sáu
tháng. Web, PWA chơi được offline, điện thoại dọc là chính. Không có server (ADR-001). Đọc `CLAUDE.md`,
`docs/Cong_Ty_C_GDD_v0.1.md`, `.project/roadmap.md`, `.project/architecture/overview.md`.

## State (2026-11-01)

- **Game hoàn chỉnh**: 37 cảnh, 6 kết thúc, văn phòng 3D có lùi về 2D, âm thanh, cài đặt, save, PWA offline, màn cảnh báo.
- Repo: <https://github.com/lctuandev/C-Star>, nhánh `main`, **public**. Chưa deploy.
- Toàn bộ roadmap xong trừ phần cần owner, ghi ở `backlog.md`.
- Số liệu, điều kiện ending, giọng văn, câu chữ cảnh báo đều chưa được owner duyệt.

## Active Task

Không có. Đang chờ owner.

## Blockers

Deploy thật (TECH-004) chờ owner chọn tên miền và xác nhận `docs/content-review.md`. Image đã sẵn sàng, có E2E.

## Open Decisions (owner)

- Xác nhận sáu mục ở `docs/content-review.md`, nhất là tên "C\*".
- Chọn tên miền để deploy (`deploy/` đã sẵn sàng).
- Chơi thử trên điện thoại thật: giọng văn, số liệu, 3D có mượt không.

## Next Step

Chờ phản hồi của owner sau khi chơi thử.
