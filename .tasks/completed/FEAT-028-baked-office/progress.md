# FEAT-028-baked-office — Progress

## 2026-11-01

- Lần render đầu đọc ra văn phòng ngay nhưng xám xịt. Owner yêu cầu đổi tông, nên dựng lại bảng màu: chàm, xanh ngọc, mù tạt, san hô.
- Lỗi: trần và tường gần của nhà riêng dựng nhầm tại gốc tọa độ, vì `at()` chỉ áp cho một builder. Hiện ra là dải đen giữa sàn văn phòng.
- Hướng nắng sai dấu, rồi quá thấp: nắng rọi vào mặt vách mà camera không thấy. Nâng lên để rơi xuống sàn và mặt bàn.
- Biểu đồ KPI lơ lửng trên cửa kính: thu hẹp cửa sổ thứ hai để có tường treo.
