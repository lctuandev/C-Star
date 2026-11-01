# Result — FEAT-008-save-and-continue

## What changed

Autosave sau mỗi hành động vào IndexedDB, "Tiếp tục" ở menu, xác nhận trước khi đè lượt đang chơi, save hỏng được giữ và
xuất được, xuất và nhập bằng file ở "Về game", báo khi không lưu được. `SAVE_VERSION` 1 kèm fixture.

## Known issues

- Hai tab cùng chơi: bản ghi sau thắng.
- Cất save hỏng vào ô `broken` chỉ giữ một bản.
