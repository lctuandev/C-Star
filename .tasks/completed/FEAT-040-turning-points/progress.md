# Progress — FEAT-040-turning-points

- Luật xong: outlook, sổ lương, summary, save v5 có fixture.
- Viết sáu cảnh và epilogue. Test người chơi ngẫu nhiên báo `ch4-khoa-leaves/khoa-gone` không còn tới được: cảnh cầu thang luôn cộng quan hệ nên ngưỡng 20 luôn đúng. Đổi sang cờ `khoaConfided`, nên lời tạm biệt giờ tùy câu trả lời ở cầu thang.
- Đọc lại toàn bộ bản sinh tự động, sửa: Khoa nói "ba mươi mấy tuần" ở tháng 5, "tối hôm trước" cách một tuần, gật đầu dưới gầm bàn, tường ảnh không thể đổi theo thời gian, nhánh bảng sai làm mất phản hồi email.
- `summaryOf` bỏ sót khoản trả ở tháng cuối vì chỉ cộng các tháng đã qua kỳ lương: sửa, thêm test. Kết thúc trả hết nợ thì KPI bị giữ là 0.
- `negotiate` thêm phần thưởng thật (cờ `heldOutForPay`, được trả 1/3 lương cuối tháng): không có nó thì lựa chọn này chỉ là lời thoại.
- `rogerDoubts` chỉ bật ở câu `no-need-to-defend`, khác với bản đầu (hai câu).
