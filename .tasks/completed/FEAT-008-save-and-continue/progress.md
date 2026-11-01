# FEAT-008-save-and-continue — Progress

## 2026-11-01

- Schema và migration ở `apps/web/src/features/save`, không ở `game-core`, vì `game-core` không phụ thuộc zod. Luật khi nạp
  lại (`resumeRun`) vẫn ở `game-core`.
- Một transaction IndexedDB là nguyên tử, nên không cần ghi hai bản để "giữ bản tốt gần nhất". Hợp đồng save §4 vẫn đúng.
- Thêm bước xác nhận khi "Game mới" đè lượt đang chơi: plan có, và đây là thao tác không hoàn tác được.
- Bộ nhớ không đọc được không bị coi là save hỏng: có thể chẳng có save nào để bảo vệ.
