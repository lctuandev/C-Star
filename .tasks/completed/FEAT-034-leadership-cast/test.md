# Test — FEAT-034-leadership-cast

## 2026-11-01

| Check | Result |
| --- | --- |
| Validator: 44 cảnh | PASS |
| Bot ngẫu nhiên 300 lượt thấy hết mọi câu, không kẹt | PASS |
| Bot có chủ đích tới đủ sáu ending | PASS |
| Unit: lời hứa, weekly sync, tháng không phiếu lương, giữ KPI | PASS |
| Fiction test gồm chữ trên tường, lời hứa | PASS |
| Owner đọc duyệt giọng văn | NOT TESTED |

## Failures

- Bot chơi trọn game chọn "rời đi ngay" ở lời mời việc tháng 4 rồi không bao giờ tới ending lặp. Sửa bộ lọc của bot, không đổi kỳ vọng của test.
- Bot ngẫu nhiên không còn thấy hết câu vì nửa số lượt rời đi sớm. Tăng số lượt từ 90 lên 300, không nới kỳ vọng.
