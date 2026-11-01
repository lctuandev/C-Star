# Rà soát 53 cảnh

Nhãn theo đề xuất của GPT: REVISE (sửa câu), REWRITE (viết lại vì sai logic), MOVE (đổi thời điểm), ADD (thêm hậu quả cho lựa chọn cũ). Cảnh không nêu ở đây là KEEP.

## Thời gian

| Cảnh | Nhãn | Trước | Sau | Vì sao |
| --- | --- | --- | --- | --- |
| `ch3-no-news` | REVISE | "Tám mươi mốt ngày" | "Năm tuần rồi" | Tháng 4 tuần 1 mới cách kỳ lương đầu bị lỡ khoảng 5 tuần |
| `ch3-promise` | REVISE | "Bốn tháng rồi, không một dòng" | "Hai tháng rồi" | Công ty mới im lặng từ cuối tháng 2 |
| `ch3-next-week` | REVISE | "lương tháng trước bao giờ có" | "phần lương còn lại của tháng trước" | Tuần trước vừa nhận 10 triệu |
| `ch4-khoa-leaves` | REVISE | "Ba mươi mấy tuần" | "Mười mấy tuần" | Tháng 5 mới được khoảng 11 tuần |
| `ch5-company-reply` | REVISE | "hơn sáu tháng" | "gần sáu tháng" | Tuần 3 tháng 7 mới được 5 tháng 3 tuần làm không công. Sang tháng 8 thì đúng là hơn sáu tháng |
| Weekly sync | MOVE | Hiện từ tháng 3 tuần 1 | Từ tháng 4 | Người chơi thấy câu đó trước cảnh giới thiệu nó ở `ch3-weekly-sync` |
| Băng rôn 3D | MOVE | Từ tháng 4 tuần 1 | Từ cảnh `ch3-dragon` (tuần 2) | Lên trước ngày ra mắt một tuần |
| Ảnh 2D | MOVE | Tháng 2–3 đã thấy băng rôn | Thêm giai đoạn `signs` | Ảnh giữa game dùng cho cả tháng 2 |
| `ch4-the-dollars` | REVISE | "tối hôm trước" (bản nháp FEAT-040) | "tuần trước" | Cảnh Roger ở tuần trước |

## Logic

| Cảnh | Nhãn | Vấn đề | Cách sửa |
| --- | --- | --- | --- |
| Ticket, Tám với đồng nghiệp | REWRITE | Khoa vẫn gửi ticket, vẫn rủ team building sau khi đã nghỉ | Cờ `khoaLeft`, câu thoại và ticket theo điều kiện, có câu mới về cái bàn trống |
| `ch5-wrong-number` | REWRITE | Dân điền bảng của nhóm kể cả khi không ở trong nhóm | Hai biến thể theo `danJoined` |
| `ch5-offer` | REWRITE | "Uyên đã rời bạn khỏi nhóm" kể cả khi chưa từng vào nhóm | Câu trung tính, đúng ở cả hai trường hợp |
| `ending-good` | REWRITE | "Trả nốt tiền cho người đã cho mượn" kể cả khi chưa vay ai | Hai biến thể theo khoản vay |
| `ending-good` | REWRITE | Ảnh Khoa có cái phích, trong khi có nhánh Khoa bỏ phích lại văn phòng | Theo `khoaSaidGoodbye`. Nhánh còn lại: phích vẫn ở trên bàn ở `ch6-empty-office` |
| `ending-believer` | REWRITE | Roger đã nghi ngờ mà vẫn nói "Anh đã bảo mà" | Biến thể theo `rogerDoubts` |
| `ch5-company-reply` | REWRITE | Nhánh bảng sai làm mất hồi âm email | Bảng sai rồi vẫn tới hồi âm |
| `ch6-last-day` | REWRITE | "Hôm nay là ngày phải có câu trả lời" mà không rõ trả lời cái gì | Bản cam kết đồng hành, ký trước 5 giờ. Lời lẽ khớp với email gia hạn của vòng lặp |
| Sổ lương | REWRITE | 10 triệu ghi "LUONG T2" lại hiện ở dòng tháng 3 | Tiền vào tháng cũ nhất còn thiếu |
| Tổng đã nhận | REWRITE | Thiếu KPI tháng 1 | Cộng thêm |

## Lời thoại

| Ai | Nhãn | Vấn đề | Cách sửa |
| --- | --- | --- | --- |
| Cô Kế toán | REVISE | Người chơi gọi "cô", cô xưng "chị" | Xưng "cô" mọi nơi |
| Dân | REVISE | Người kể gọi Dân là "ông", vốn là cách Dân tự nói | Người kể gọi "Dân" |
| `ch4-performance-review` | REVISE | Gật đầu dưới gầm bàn | Giơ ngón cái dưới gầm bàn |
| `ch6-empty-office` | REVISE | Ảnh chụp từ trước mà "Hôm đầu có hơn một trăm người trong ảnh" | Bạn từng thấy hơn một trăm gương mặt |
| `ch6-last-day` | REVISE | Hai cảnh liền nhau cùng mở đầu "Sáng thứ Hai" | Cảnh sau bắt đầu lúc chín giờ, có người lau dòng chữ inox vì Chủ tịch sắp tới |

## Liên kết nguyên nhân và hệ quả

- `ch4-the-dollars` mở bằng bốn lá đơn nghỉ việc: "1–2 triệu đô" là phản ứng giữ người.
- `ch5-closed-door`: nếu người chơi đã gửi email, "một người gửi email" chính là họ.
- `ch6-empty-office`: anh Huni nói Chủ tịch tới vì có quá nhiều email gửi lên, nên chương 5 dẫn thẳng tới chương 6.
- `ch5-offer`: Phó giám đốc nêu lý do chọn người chơi, tùy họ từng vỗ tay, từng hỏi lương, hay từng chọn nói chuyện riêng với HR.

## Lựa chọn có thêm hậu quả (ADD)

Xem bảng tự động "Lựa chọn và hậu quả về sau" trong `docs/kich-ban-day-du.md`. Đáng nhớ nhất:

- Cho Khoa mượn 1 triệu ở tháng 3: tháng 8 Khoa chuyển trả, nội dung "TUAN SAU CHAC CHAN LUON", lời hứa "tuần sau" duy nhất được giữ.
- Khuyên Khoa "cố thêm một tháng" mà chưa từng giúp: Khoa biến mất không lời chào.
- Hỏi HR trong nhóm chung ở tháng 2: tháng 7 chị HR nhắc lại đúng câu đó.
- Ký hợp đồng 11 giây: cuối tháng 6 đọc tới trang 14.
- Gửi tiền về cho mẹ: tháng 7 mẹ nói số tiền đó vẫn để nguyên.

## Giữ nguyên khác với GPT

- Khung chương của GPT đặt chương 4 ở tháng 4–6: giữ khung của owner.
- `Bảng chấm công` có hai nguồn: GPT đề nghị tách bản cá nhân và bản đối chiếu. Không tách, chỉ sửa mô tả cho đúng cả hai nguồn. Trùng giấy tờ không cộng đôi vì mỗi giấy tờ có một ID.
