# FEAT-003-story-engine — Progress

## 2026-11-01

- Đồ thị theo từng cảnh, `next` chỉ đi trong cùng cảnh. Chuyển cảnh là việc của lịch (FEAT-005).
- Nút rẽ nhánh là loại nút riêng `RouteNode`, không phải dòng thoại có text rỗng.
- Thêm luật validator: mọi nút phải đi tới được cuối cảnh, và một câu không thể có toàn lựa chọn khóa được. Hai luật này
  chống kẹt người chơi, kịch bản sau này dựa vào.
- `applyAction` trả về `{ ok, state }`, chưa trả danh sách sự kiện như `overview.md` §4. Thêm khi UI cần.
