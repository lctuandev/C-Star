# Current Project State

Handoff cho phiên làm việc tiếp theo. Lịch sử từng task nằm ở `.tasks/completed/<TASK-ID>/`.

## Project

Công ty C\* (tên làm việc): game đơn dark comedy theo cốt truyện, về nhân viên bị công ty nợ lương hơn sáu
tháng. Web, PWA chơi được offline, điện thoại dọc là chính. Không có server (ADR-001). Đọc `CLAUDE.md`,
`docs/Cong_Ty_C_GDD_v0.1.md`, `.project/roadmap.md`, `.project/architecture/overview.md`.

## State (2026-11-01)

- TECH-001 xong: monorepo chạy được, chưa có gameplay. `pnpm dev` ở cổng 5200.
- Repo: <https://github.com/lctuandev/C-Star>, nhánh `main`.
- GDD v0.1 viết từ kịch bản ChatGPT của owner. Các phần `[Đề xuất]` và con số chưa được owner duyệt.
- Roadmap M0–M5 xong. Plan chi tiết có cho FEAT-001 và FEAT-002.

## Active Task

**FEAT-001-pwa-shell** — PLANNING, chưa bắt đầu.

Hàng đợi M0: FEAT-002-disclaimer-gate. Hai task độc lập, thứ tự nào cũng được.

## Blockers

Không có. Các câu hỏi dưới đây không chặn M0.

## Open Decisions (owner)

- Góc nhìn: chốt sau khi chơi thử M1 (ADR-004). Đề xuất Third Person 3D, làm sau slice 2D.
- Tên phát hành: "C\*" chỉ là tên làm việc, phải chốt trước khi công khai (ADR-003, TECH-003).
- Duyệt số liệu và điều kiện ending trong GDD khi có slice chơi được.

## Next Step

`/implement` FEAT-001: manifest, service worker, precache toàn bộ `apps/web/out`.
