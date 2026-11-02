# Công ty C\* — Kịch bản đầy đủ

Sinh tự động từ dữ liệu game bằng `pnpm --filter @cstar/content story:doc`: đây đúng là những gì đang có trong game. Đừng sửa tay, hãy sửa trong `packages/content`.

Trong ngoặc nghiêng là hậu quả của câu thoại hay lựa chọn. `[tên người chơi]` là tên điền ở đơn ứng tuyển.

## Mục lục

- Timeline
- Tuyến nhân vật
- Lựa chọn và hậu quả về sau
- Chương 1 — Dream Big (tháng 1)
- Chương 2 — Payment Delay (tháng 2)
- Chương 3 — KPI Never Sleeps (tháng 3–4)
- Chương 4 — Six Months Later (tháng 5–6)
- Chương 5 — The Awakening (tháng 7)
- Chương 6 — The Last Day (tháng 8)
- Khủng hoảng
- Sáu kết thúc
- Phần lặp lại mỗi tuần, mỗi tháng
- Nhân vật, giấy tờ, số liệu

## Timeline

Mỗi tháng có 4 tuần, mỗi tuần 3 lượt. "Ngày lương" là mùng 5 của tháng sau, nên tiền lương tháng N đến sau tuần 4 của tháng N.

| Chương | Tháng | Chuyện chính | Tiền công ty trả trong tháng |
| --- | --- | --- | --- |
| 1 | 1 | Nhận việc, được trả đủ. Người chơi yêu nơi này. | Đủ 15 triệu và KPI 4,5 triệu |
| 2 | 2 | Máy cà phê biến mất, kế toán ấp úng, ngày lương không có "ting". | Không có gì |
| 3 | 3 | KPI bắt đầu, lời hứa "this week", Khoa đi vay, weekly sync. | 10 triệu (2/3 lương T2) |
| 3 | 4 | Công ty im lặng, chiến dịch Vượt thác hóa rồng, người đầu tiên nghỉ, lời mời việc nơi khác. | 5 triệu nếu vào Vượt thác |
| 4 | 5 | Trả 1/3 chọn lọc chia rẽ cả phòng, Khoa rời đi, ai cũng vay mượn, Uyên bắt đầu gom người. | 5 triệu nếu vào Vượt thác (danh sách ưu tiên) hoặc được sếp để ý (khoản ứng riêng) |
| 4 | 6 | Nhóm so số liệu họp, anh Roger lung lay, "1–2 triệu đô" và IPO, KPI bị giam mà vẫn đánh giá hiệu suất. | Không có gì |
| 5 | 7 | Bảng đối chiếu, bảng cũng có thể sai, email đòi quyền lợi, chị HR dò ai lập bảng, công ty lần đầu lo lắng, lời mời làm Trưởng nhóm, cuộc gọi của mẹ. | 5 triệu nếu vào Vượt thác, nhận chức hoặc ra điều kiện |
| 6 | 8 | Văn phòng vắng, Khoa trả nợ, Chủ tịch tới, Bản cam kết đồng hành, 15 triệu đổi lấy tờ "không khiếu nại", quyết định cuối. | 15 triệu nếu ký tờ "không khiếu nại"; phần còn lại tùy kết thúc |

Tiền trả muộn được tính vào tháng lương cũ nhất còn thiếu, đúng như nội dung chuyển khoản. Cách tính mốc: người chơi nhận email trước tháng 1, nên cuối tháng 6 là "hơn sáu tháng" kể từ email đó. Kỳ lương đầu bị lỡ là lương tháng 2, nên tuần 3 tháng 7 công ty đã lỡ năm kỳ (T2 đến T6), và tới tháng 8 là sáu kỳ (T2 đến T7).

### Thứ tự các cảnh

| Tháng | Lúc nào | Cảnh | Ở đâu | Điều kiện |
| --- | --- | --- | --- | --- |
| 1 | tuần 1 | `ch1-first-day` | văn phòng |  |
| 1 | tuần 2 | `ch1-town-hall` | phòng họp |  |
| 1 | tuần 3 | `ch1-fruit-friday` | hành lang, pantry |  |
| 1 | tuần 4 | `ch1-team-lunch` | hành lang, pantry |  |
| 1 | ngày lương | `ch1-payday` | bàn làm việc |  |
| 2 | tuần 1 | `ch2-new-month` | hành lang, pantry |  |
| 2 | tuần 3 | `ch2-small-signs` | bàn làm việc |  |
| 2 | tuần 4 | `ch2-hard-times` | phòng họp |  |
| 2 | ngày lương | `ch2-payday-silence` | bàn làm việc |  |
| 3 | tuần 1 | `ch3-kpi-launch` | phòng họp |  |
| 3 | tuần 2 | `ch3-first-tranche` | bàn làm việc |  |
| 3 | tuần 3 | `ch3-next-week` | hành lang, pantry |  |
| 3 | tuần 4 | `ch3-side-rumor` | hành lang, pantry |  |
| 3 | tuần 4 | `ch3-weekly-sync` | phòng họp |  |
| 3 | ngày lương | `ch3-badge` | bàn làm việc |  |
| 4 | tuần 1 | `ch3-no-news` | hành lang, pantry |  |
| 4 | tuần 1 | `ch3-new-project` | phòng họp |  |
| 4 | tuần 2 | `ch3-dragon` | phòng họp |  |
| 4 | tuần 3 | `ch3-chart` | hành lang, pantry |  |
| 4 | tuần 4 | `ch3-other-offer` | nhà riêng |  |
| 4 | ngày lương | `ch3-promise` | bàn làm việc |  |
| 5 | tuần 1 | `ch4-second-tranche` | bàn làm việc |  |
| 5 | tuần 2 | `ch4-khoa-stairs` | hành lang, pantry |  |
| 5 | tuần 3 | `ch4-khoa-leaves` | hành lang, pantry |  |
| 5 | tuần 3 | `ch4-borrowing` | hành lang, pantry |  |
| 5 | tuần 4 | `ch4-different-debts` | hành lang, pantry |  |
| 5 | ngày lương | `ch4-date-passes` | bàn làm việc |  |
| 6 | tuần 1 | `ch4-group` | hành lang, pantry |  |
| 6 | tuần 1 | `ch4-roger-crack` | bàn làm việc |  |
| 6 | tuần 2 | `ch4-the-dollars` | phòng họp |  |
| 6 | tuần 3 | `ch4-dan-doubts` | bàn làm việc |  |
| 6 | tuần 4 | `ch4-kpi-held` | bàn làm việc |  |
| 6 | tuần 4 | `ch4-performance-review` | phòng họp |  |
| 6 | ngày lương | `ch4-six-months` | nhà riêng |  |
| 7 | tuần 1 | `ch5-compare` | hành lang, pantry |  |
| 7 | tuần 1 | `ch5-wrong-number` | hành lang, pantry | vào nhóm so số liệu |
| 7 | tuần 2 | `ch5-choose-way` | bàn làm việc |  |
| 7 | tuần 3 | `ch5-company-reply` | phòng họp |  |
| 7 | tuần 3 | `ch5-closed-door` | hành lang, pantry |  |
| 7 | tuần 4 | `ch5-offer` | phòng họp |  |
| 7 | ngày lương | `ch5-payday` | nhà riêng |  |
| 8 | tuần 1 | `ch6-empty-office` | văn phòng |  |
| 8 | tuần 1 | `ch6-last-day` | văn phòng |  |

## Tuyến nhân vật

| Nhân vật | Đầu game | Giữa game | Cuối game |
| --- | --- | --- | --- |
| Anh Roger | Tin Chủ tịch thật lòng (`ch1-team-lunch`) | Lần đầu không nói "next week" (`ch4-roger-crack`) | Tùy người chơi: im lặng trước Chủ tịch, ký cùng nhóm hay về nước; hoặc vẫn "hopefully" |
| Khoa | Cười, tin tuần sau có lương (`ch1-first-day`) | Vay tiền, ngồi ở cầu thang (`ch3-side-rumor`, `ch4-khoa-stairs`) | Rời đi tháng 5. Trả 1 triệu ở tháng 8 nếu từng được cho mượn; quán cà phê nếu đã nói lời tạm biệt |
| Uyên | Cẩn thận vì công ty cũ đóng cửa (`ch1-team-lunch`) | Gom người, gom giấy tờ (`ch4-different-debts`, `ch4-group`) | Sai một lần và học cách để người khác soát cùng (`ch5-wrong-number`). Bị người chơi nêu tên, hoặc được đứng cùng (`ch5-company-reply`, `ch6-empty-office`) |
| Anh Huni | Người hướng dẫn tử tế (`ch1-first-day`) | Cho mượn tiền rồi không kham nổi (`ch4-borrowing`) | Tự quyết định: ký đầu danh sách hoặc nộp đơn (`ch6-empty-office`, các kết thúc) |
| Dân | Nhiều tin đồn (`ch1-first-day`) | Người quen hỏi lại "Công ty nào?" (`ch4-dan-doubts`) | Tin sai vào bảng, rồi lần đầu hỏi mà không kèm tin đồn (`ch5-wrong-number`, The Investigator) |
| Phó GĐ Jeon | Tầm nhìn, gia đình (`ch1-town-hall`) | "1–2 triệu đô" mỗi khi có người định đi (`ch4-the-dollars`) | Lần đầu lo lắng, chiêu mộ người hay hỏi lương (`ch5-closed-door`, `ch5-offer`) |

## Lựa chọn và hậu quả về sau

Sinh tự động từ dữ liệu. Test `story-links.test.ts` bắt lỗi nếu có lựa chọn được ghi lại mà về sau không dùng tới.

| Lựa chọn hoặc sự việc | Xảy ra ở | Có hậu quả ở |
| --- | --- | --- |
| ký hợp đồng không đọc | `ch1-offer` | `ch4-six-months` |
| đã đọc kỹ hợp đồng | `ch1-offer` | `ch1-offer`, `ch2-payday-silence` |
| ngồi cạnh Dân | `ch1-first-day` | `ch4-dan-doubts` |
| ngồi cạnh Uyên | `ch1-first-day` | `ch3-first-tranche` |
| ngồi cạnh Khoa | `ch1-first-day` | `ch4-khoa-leaves` |
| vỗ tay to nhất | `ch1-town-hall` | `ch5-offer` |
| hỏi lương ở buổi họp đầu năm | `ch1-town-hall` | `ch2-payday-silence`, `ch5-offer` |
| đã mời cả nhóm ăn trưa | `ch1-payday` | `ch4-khoa-stairs`, `ch6-empty-office` |
| gửi tiền về cho mẹ | `ch1-payday` | `ch5-payday` |
| để dành lương đầu | `ch1-payday` | `ch3-badge` |
| hỏi cô Kế toán chuyện lương | `ch2-small-signs` | `ch4-kpi-held` |
| hỏi HR trong nhóm chung | `ch2-payday-silence` | `ch5-company-reply` |
| nhắn riêng HR | `ch2-payday-silence` | `ch5-company-reply` |
| im lặng ngày lương đầu tiên bị lỡ | `ch2-payday-silence` | `ch5-company-reply` |
| hỏi sếp lương giữa buổi họp KPI | `ch3-kpi-launch` | `ch5-offer` |
| đăng ký chỉ tiêu cao nhất | `ch3-kpi-launch` | `ch3-badge` |
| bắt đầu ghi chép (mở "Lưu giấy tờ") | `ch3-first-tranche` | `ch3-promise`, `ch4-the-dollars`, `ch6-last-day`, `hành động investigate` |
| đã cho Khoa mượn tiền | `ch3-side-rumor` | `ch4-khoa-leaves`, `ch4-khoa-stairs`, `ch6-empty-office` |
| đứng về phía Uyên | `ch3-new-project` | `ch4-group` |
| từ chối lời mời việc của người bạn | `ch3-other-offer` | `ending-survivor` |
| nghỉ sớm | `ch3-other-offer`, `ch4-six-months`, `crisis-broke` | `ending-survivor`, `kết thúc survivor` |
| vào nhóm Vượt thác | `ch3-dragon` | `ch4-second-tranche`, `ch4-date-passes`, `ch5-payday`, `ch6-empty-office` |
| đã hỏi tiêu chí trả lương | `ch4-second-tranche` | `ch4-different-debts` |
| Khoa đã nói lời tạm biệt | `ch4-khoa-leaves` | `ending-good`, `ch6-empty-office` |
| Khoa đã nghỉ | `ch4-khoa-leaves` | `ticket server-full`, `hành động chat` |
| vào nhóm so số liệu | `ch4-group`, `ch5-offer`, `ch6-last-day`, `ch6-empty-office` | `ch4-dan-doubts`, `ch5-compare`, `ch5-company-reply`, `ch6-last-day`, `ch5-wrong-number`, `kết thúc good`, `kết thúc collective`, `kết thúc investigator` |
| Dân vào nhóm | `ch4-dan-doubts` | `ch5-wrong-number`, `ending-collective` |
| quyết định hành động | `ch4-six-months` | `ch5-choose-way` |
| đã nghe màn 1–2 triệu đô | `ch4-the-dollars` | `ending-survivor` |
| Khoa tin bạn (sẽ tự nói lời tạm biệt) | `ch4-khoa-stairs` | `ch4-khoa-leaves` |
| anh Roger bắt đầu nghi ngờ | `ch4-roger-crack` | `ch4-the-dollars`, `ch5-offer`, `ch6-last-day`, `ending-collective`, `ending-believer` |
| đã gửi email đòi quyền lợi | `ch5-choose-way` | `ch5-company-reply`, `ch5-closed-door`, `kết thúc good` |
| đã hỏi người có chuyên môn | `ch5-choose-way` | `ch6-last-day` |
| chọn nói chuyện riêng với HR | `ch5-choose-way` | `ch5-offer` |
| đã nêu tên Uyên với chị HR | `ch5-company-reply` | `ch5-offer`, `ch5-closed-door`, `ending-survivor`, `ch6-empty-office` |
| đã nhận có phần trong bảng đối chiếu | `ch5-company-reply` | `ch5-closed-door`, `ch6-empty-office` |
| được cô Kế toán đưa phiếu lương | `ch5-company-reply` |  |
| nhận chức Trưởng nhóm | `ch5-offer` | `ch5-payday`, `ending-survivor` |
| đã ra điều kiện đòi trả nợ | `ch5-offer` | `ch5-payday` |
| đã kể thật với mẹ | `ch5-payday` | `ch6-last-day`, `ending-good`, `ending-believer` |
| bảng của nhóm còn lỗi | `ch5-wrong-number` | `ch5-company-reply` |
| đã đề nghị đối thoại chính thức | `ch5-closed-door` | `ch5-offer` |
| hỏi Chủ tịch bao giờ trả lương | `ch6-last-day` | `ending-collective` |
| đã ký tờ "không khiếu nại" | `ch6-last-day` | `ch6-last-day`, `ending-survivor` |
| đã chụp lại tờ "không khiếu nại" | `ch6-last-day` |  |
| chọn rời đi | `ch6-last-day` | `kết thúc survivor` |
| ký cam kết ở lại | `ch6-last-day` | `kết thúc believer` |
| chọn theo đuổi quyền lợi | `ch6-last-day` | `ending-empty-promise`, `kết thúc good`, `kết thúc collective`, `kết thúc investigator` |
| đã bán máy ảnh | `crisis-broke` | `crisis-broke` |
| vay tiền mẹ | `crisis-broke` | `ch5-payday` |
| vay trên điện thoại | `crisis-broke` | `ch5-payday` |

## Mở đầu

### ch1-offer

*nhà riêng*

Thứ Hai, 7 giờ 12 phút. Điện thoại rung. Một email có tiêu đề: "Chúc mừng! Hành trình phi thường của bạn bắt đầu từ đây".

Ba tháng tìm việc. Trong tài khoản còn đúng 9 triệu, đủ thêm một tháng nữa nếu ăn mì.

Công ty C*. Vị trí: Chuyên viên. Lương: 15 triệu, cộng tiền KPI bằng 30% lương mỗi tháng. Phúc lợi: "văn hóa gia đình, cơ hội không giới hạn, trái cây thứ Sáu".

**Bạn:** Trái cây thứ Sáu. Mình chưa từng được đối xử tử tế như vậy.

- ▸ Bấm "Chấp nhận" ngay, sợ họ đổi ý *(ký hợp đồng không đọc)*
- ▸ Đọc hết hợp đồng trước đã *(hiểu quyền lợi +15; đã đọc kỹ hợp đồng; có giấy tờ "Hợp đồng lao động")*

*Nếu chọn "Đọc hết hợp đồng trước đã":*

Trang 14, cỡ chữ 6: "Thời điểm thanh toán có thể được điều chỉnh để phù hợp với lộ trình phát triển chung".

**Bạn:** Chắc là mẫu chung thôi. Công ty lớn ai lại ghi thế để làm thật.

*Các nhánh trên gặp lại ở đây:*

*Nếu đã đọc kỹ hợp đồng:*

Bạn ký. Bản PDF nằm gọn trong thư mục "Giấy tờ". Bạn không biết đây là việc khôn ngoan nhất mình làm trong năm nay.

*Nếu không:*

Bạn ký trong 11 giây. Một kỷ lục mới của phòng Nhân sự, họ gửi ngay một sticker tràng pháo tay.

**Chị HR:** Chào mừng **[tên người chơi]** đến với đại gia đình C*! Thứ Hai tuần sau đi làm nhé. Nhớ mang theo đam mê!

## Chương 1 — Dream Big (tháng 1)

Người chơi nhận việc, làm quen đồng nghiệp, nghe tầm nhìn của công ty. Chưa có nợ: tháng đầu nhận đủ lương và tiền KPI 30%. Mọi thứ tươi mới, nhạc vui.

### ch1-first-day

*tháng 1, tuần 1 · văn phòng*

*Nếu đang chơi lại sau khi gia hạn:*

Chị HR nhìn bạn như chưa từng gặp, và đưa cho bạn đúng cái áo thun bạn đang mặc.

*Các nhánh trên gặp lại ở đây:*

Sảnh công ty có một bức tường cây, một máy pha cà phê to bằng cái tủ lạnh, và dòng chữ inox: "CHÚNG TA KHÔNG ĐI LÀM. CHÚNG TA ĐI XÂY TƯƠNG LAI".

**Chị HR:** Em đây rồi! Chị gửi em bộ quà chào mừng: áo thun, sổ tay, và một cuốn "Sổ tay giá trị cốt lõi" dày 96 trang.

**Chị HR:** Giá trị số một là Tận Tâm. Giá trị số hai là Tận Tụy. Giá trị số ba thì đang được ban lãnh đạo cân nhắc.

Chị HR dẫn bạn tới khu làm việc. Ba người ngẩng lên khỏi màn hình. Có ba ghế trống, và bạn phải chọn một.

**Chị HR:** Em ngồi đâu cũng được, ở đây mình phẳng lắm. Trừ phòng sếp ra.

- ▸ Ngồi cạnh Dân, người đang mở ba cửa sổ tin tức tài chính *(ngồi cạnh Dân; quan hệ Dân +10)*
- ▸ Ngồi cạnh Uyên, người có tập hồ sơ dán nhãn rất ngay ngắn *(ngồi cạnh Uyên; quan hệ Uyên +10)*
- ▸ Ngồi cạnh Khoa, người đang cười với cái màn hình *(ngồi cạnh Khoa; quan hệ Khoa +10)*

*Nếu chọn "Ngồi cạnh Dân, người đang mở ba cửa sổ tin tức tài chính":*

**Dân:** Lính mới hả? Khôn đấy. Ngồi đây là nghe được tin sớm. Công ty sắp gọi vốn, đợt này to lắm, ông cứ nghe tôi.

*Nếu chọn "Ngồi cạnh Uyên, người có tập hồ sơ dán nhãn rất ngay ngắn":*

**Uyên:** Chào bạn. Nhớ lưu lại email xác nhận công việc nhé. Không có gì đâu, mình quen tay thôi.

*Nếu chọn "Ngồi cạnh Khoa, người đang cười với cái màn hình":*

**Khoa:** Ủa bạn mới hả? Công ty mình chill lắm luôn! Năm ngoái đi team building, ngủ lều, sếp còn hát nguyên bài tự sáng tác nữa á!

Cả ba bắt tay bạn. Ai cũng tử tế theo một kiểu hơi mệt mỏi.

**Anh Roger:** Chào em, anh là Roger, trưởng phòng. Anh rời Ấn Độ sang đây tám năm trước vì một người: Chủ tịch Jeon. Em vào đúng công ty, đúng thời điểm rồi đấy. Tầm nhìn của ông ấy, người thường phải mất mười năm mới hiểu. Anh mất tám năm.

**Anh Huấn:** Chào **[tên người chơi]**, anh là Huấn, phó phòng, mọi người gọi là Huni cho gọn. Có gì cứ hỏi anh, từ chỗ gửi xe tới cách xin nghỉ phép. Mà trưa nhớ ra ngoài ăn nhé, đừng ngồi lì ở bàn.

**Chị HR:** À, tài khoản của em mất ba ngày mới có. Trong lúc chờ, em đọc Sổ tay giá trị cốt lõi nhé. Tuần sau có họp toàn công ty, sếp sẽ chia sẻ tầm nhìn.

### ch1-town-hall

*tháng 1, tuần 2 · phòng họp*

Cả công ty chen vào phòng họp lớn. Máy chiếu hiện chữ TẦM NHÌN 2030, cỡ chữ to hơn cả bạn.

Anh Roger xin cả phòng yên lặng. Màn hình chuyển sang cuộc gọi video: Chủ tịch Jeon Kim-jung, chủ của công ty này và nhiều công ty khác, đang ngồi trên xe.

"Chào các bạn ở..." Ông liếc sang người bên cạnh. "...C*! Tôi rất tự hào về các bạn. Tôi phải sang công ty khác bây giờ."

Cuộc gọi dài mười một giây. Anh Roger lau mắt. Phó giám đốc Jeon Gwang-hoe bước lên trước màn hình.

**Phó GĐ Jeon Gwang-hoe:** Các bạn ơi. Ở C*, chúng ta không làm việc vì tiền. Tiền chỉ là hệ quả. Chúng ta ở đây để thay đổi cách cả ngành này vận hành.

**Phó GĐ Jeon Gwang-hoe:** Biểu đồ này đi lên. Tôi sẽ không nói nó là biểu đồ gì, nhưng nó đi lên. Đó là chúng ta.

**Phó GĐ Jeon Gwang-hoe:** Và tôi muốn nói điều này từ trái tim: ở đây không có nhân viên. Chúng ta là một gia đình. Có ai muốn chia sẻ gì không?

Cả phòng im lặng. Khoa vỗ tay một mình rồi thấy ngại. Bạn thấy mắt sếp lướt về phía mình.

- ▸ Vỗ tay thật to *(niềm tin +5; vỗ tay to nhất; quan hệ Phó GĐ Jeon Gwang-hoe +8)*
- ▸ Giơ tay: "Dạ cho em hỏi, lương mình trả ngày mấy ạ?" *(hỏi lương ở buổi họp đầu năm; căng thẳng +5; quan hệ Phó GĐ Jeon Gwang-hoe -5)*
- ▸ Cúi xuống ghi chép vào sổ tay

*Nếu chọn "Vỗ tay thật to":*

**Phó GĐ Jeon Gwang-hoe:** Đấy. Năng lượng như thế. Bạn này tên gì? Thôi không cần, tôi nhớ rồi.

*Nếu chọn "Giơ tay: Dạ cho em hỏi, lương mình trả ngày mấy ạ?":*

**Phó GĐ Jeon Gwang-hoe:** Câu hỏi hay. Rất thực tế. Nhưng các bạn phải nhìn xa hơn ngày mùng 5. Tất nhiên là có lương, chúng ta là một gia đình mà.

Cả phòng cười. Không ai trả lời con số. Sau này bạn sẽ nhớ lại rằng đó là lần đầu tiên.

*Nếu chọn "Cúi xuống ghi chép vào sổ tay":*

Bạn viết "tầm nhìn" vào sổ, gạch chân hai lần, rồi vẽ một cái biểu đồ đi lên. Trông bạn rất có tinh thần.

**Phó GĐ Jeon Gwang-hoe:** Cảm ơn cả nhà. Quý này chúng ta bứt phá. Mọi người về làm việc đi, tầm nhìn không tự xây được đâu.

### ch1-fruit-friday

*tháng 1, tuần 3 · hành lang, pantry*

Thứ Sáu. Ở góc hành lang có một khay trái cây thật: xoài, nho, cả dâu tây. Bạn đứng nhìn nó một lúc lâu.

**Dân:** Ăn đi ông. Đợt trước còn có sầu riêng cơ. Công ty mà gọi được vòng này thì còn hơn nữa.

**Uyên:** Khay năm ngoái to gấp đôi.

**Khoa:** Trời ơi Uyên khó tính quá! Trái cây cũng có mùa mà!

Bạn lấy một quả dâu. Ngọt thật. Bạn nghĩ: có lẽ mình đã chọn đúng nơi. *(căng thẳng -5)*

### ch1-team-lunch

*tháng 1, tuần 4 · hành lang, pantry*

Trưa thứ Sáu cuối tháng, cả nhóm kéo nhau xuống quán cơm dưới tòa nhà. Anh Huni gọi món cho cả bàn, anh Roger trả tiền nước và kể về lần đầu gặp Chủ tịch.

**Anh Roger:** Ông ấy nhìn anh và nói: "Công ty cần những người tin". Từ hôm đó tới giờ anh chưa nghỉ một ngày phép nào.

**Anh Huấn:** Anh ấy không đùa đâu. Thôi ăn đi các em, nguội hết bây giờ. Mà **[tên người chơi]** ở lâu rồi sẽ thấy, ở đây vui nhất là đồng nghiệp.

**Bạn:** Nhân lúc mọi người đang vui, mình hỏi thêm về ai nhỉ?

- ▸ Hỏi Dân về mấy cửa sổ tin tức tài chính *(quan hệ Dân +6)*
- ▸ Hỏi Uyên vì sao cái gì cũng dán nhãn *(quan hệ Uyên +6)*
- ▸ Hỏi Khoa sao lúc nào cũng cười *(quan hệ Khoa +6)*

*Nếu chọn "Hỏi Dân về mấy cửa sổ tin tức tài chính":*

**Dân:** Tôi để dành được ít vốn, ông ạ. Đi làm là để có tin, có tin mới có tiền. Công ty này mà lên sàn thì ông nhớ tôi đã nói trước.

*Nếu chọn "Hỏi Uyên vì sao cái gì cũng dán nhãn":*

**Uyên:** Công ty cũ của mình đóng cửa sau một đêm. Từ đó mình dán nhãn mọi thứ. Không có gì đâu, quen tay thôi.

*Nếu chọn "Hỏi Khoa sao lúc nào cũng cười":*

**Khoa:** Mới ra trường mà vô được công ty xịn, hong cười sao được! Ba mẹ mình khoe khắp xóm luôn, in cả email trúng tuyển dán tủ lạnh nữa!

### ch1-payday

*ngày lương tháng 1 (mùng 5 tháng 2) · bàn làm việc*

Ngày mùng 5. 10 giờ 41 phút. Điện thoại kêu một tiếng "ting" mà sau này bạn sẽ nhớ như nhớ một người cũ.

+15.000.000 đ. Nội dung: "CT C STAR TRA LUONG T1". Bạn đọc lại ba lần. Con số đẹp hơn mọi biểu đồ của sếp.

Ting. +4.500.000 đ. Nội dung: "CT C STAR KPI T1". Đủ 30% lương, đúng như hợp đồng. Công ty này giữ lời thật. *(có thêm 4.500.000 đ)*

**Bạn:** Tháng đầu tiên. Làm gì với nó nhỉ?

- ▸ Mời cả nhóm ăn trưa *(mất 600.000 đ; căng thẳng -8; đã mời cả nhóm ăn trưa; quan hệ Dân +5; quan hệ Uyên +5; quan hệ Khoa +5)*
- ▸ Gửi về cho mẹ một ít *(mất 2.000.000 đ; căng thẳng -5; gửi tiền về cho mẹ)*
- ▸ Để dành hết, phải biết lo xa *(để dành lương đầu)*

*Nếu chọn "Mời cả nhóm ăn trưa":*

Cả nhóm ăn cơm tấm, Khoa gọi thêm trứng. Uyên bảo lần đầu có lính mới mời trước. Bạn thấy mình thuộc về nơi này.

*Nếu chọn "Gửi về cho mẹ một ít":*

Mẹ nhắn lại: "Con giữ mà ăn uống cho đàng hoàng". Rồi mười phút sau: "Công ty tốt không con?". Bạn trả lời: "Tốt lắm mẹ".

*Nếu chọn "Để dành hết, phải biết lo xa":*

Bạn chuyển hết sang tài khoản tiết kiệm, thấy mình trưởng thành hẳn. Cuối cùng cũng có một quyết định tài chính mà sau này không hối hận.

Bạn mở lịch, đánh dấu ngày mùng 5 tháng sau, rồi vẽ thêm một trái tim nhỏ.

## Chương 2 — Payment Delay (tháng 2)

Những dấu hiệu đầu tiên: máy cà phê biến mất, kế toán ấp úng, công ty kêu khó khăn và xin đợi thêm. Kết chương là ngày lương đầu tiên không có tiếng "ting".

### ch2-new-month

*tháng 2, tuần 1 · hành lang, pantry*

Thứ Hai. Máy pha cà phê to bằng cái tủ lạnh không còn ở sảnh. Chỗ đó giờ là một tờ giấy A4 dán tường.

"Nhằm tối ưu không gian trải nghiệm, công ty chuyển sang mô hình cà phê cá nhân. Hãy mang theo đam mê và phích nước của bạn."

**Dân:** Tối ưu đấy. Công ty lớn nào trước khi gọi vốn cũng phải tinh gọn. Đây là tín hiệu tốt, ông tin tôi.

**Uyên:** Mình chụp lại tờ này. Không có gì đâu, mình quen tay thôi.

**Khoa:** Mình có phích rồi nè! Phích công ty tặng năm ngoái đó, xịn lắm!

### ch2-small-signs

*tháng 2, tuần 3 · bàn làm việc*

Bạn đi ngang phòng kế toán. Cô Kế toán đang nghe điện thoại, tay che ống nói, mắt nhìn vào một bảng tính đỏ gần hết.

**Cô Kế toán:** ...dạ em hiểu, nhưng đợt 2 của tháng trước mới là đợt 1 của tháng này, anh hiểu ý em không ạ...

Cô ngẩng lên, thấy bạn, và đóng laptop lại nhẹ nhàng như đóng một quan tài.

**Cô Kế toán:** Em cần gì không?

- ▸ "Dạ tháng này lương có đúng ngày không cô?" *(hỏi cô Kế toán chuyện lương; quan hệ Cô Kế toán +5)*
- ▸ "Dạ em tìm bút thôi ạ"

*Nếu chọn "Dạ tháng này lương có đúng ngày không cô?":*

**Cô Kế toán:** Lương là bên cô xử lý theo quy trình. Quy trình thì bên trên xử lý. Bên trên thì, em biết đấy, ở bên trên.

*Nếu chọn "Dạ em tìm bút thôi ạ":*

**Cô Kế toán:** Bút hả. Em lấy đi. Bút thì còn.

Bạn quay về chỗ. Có một cảm giác rất nhỏ, như khi bạn nhận ra mình để quên chìa khóa nhưng chưa chắc.

### ch2-hard-times

*tháng 2, tuần 4 · phòng họp*

Cuối tháng, Phó giám đốc gọi cả phòng vào họp nhanh. Không có slide. Lần đầu tiên bạn thấy anh không cười trước khi nói.

**Phó GĐ Jeon Gwang-hoe:** Thị trường đang rất khó khăn, các bạn đọc báo cũng thấy. Không riêng gì mình. Lương tháng này có thể chậm vài ngày. Anh em đợi thêm một chút nhé.

**Anh Roger:** Công ty lớn nào chẳng có lúc khó. Đây là lúc biết ai là người nhà. Chủ tịch đã vượt qua nhiều hơn thế này.

**Anh Huấn:** Anh chưa thấy con số nào nên anh không dám nói gì thêm. Tháng này ai có khoản nào gấp thì cứ nói với anh trước nhé.

- ▸ Vài ngày thôi mà, đợi được *(quan hệ Anh Roger +3)*
- ▸ Về xem lại các khoản phải trả tháng này *(căng thẳng +3)*

*Nếu chọn "Vài ngày thôi mà, đợi được":*

Ai cũng gật đầu. Vài ngày thì có gì đâu. Bạn cũng nghĩ thế.

*Nếu chọn "Về xem lại các khoản phải trả tháng này":*

Bạn mở sổ ra, cộng tiền nhà, tiền điện, tiền ăn. Lần đầu tiên trong tháng bạn để ý xem ngày mùng 5 rơi vào thứ mấy.

### ch2-payday-silence

*ngày lương tháng 2 (mùng 5 tháng 3) · bàn làm việc*

Ngày mùng 5. 10 giờ 41 phút. Bạn đặt điện thoại ngửa mặt lên bàn. Không có gì xảy ra.

12 giờ. Bạn mở ứng dụng ngân hàng, kéo xuống để tải lại. Rồi kéo lần nữa. Rồi đăng xuất, đăng nhập lại, cho chắc.

15 giờ. Không có tiếng "ting". Bạn chưa bao giờ nghe sự im lặng to đến thế. *(căng thẳng +5; niềm tin -10)*

**Khoa:** Ủa mọi người ơi, có ai nhận lương chưa vậy? Hay app ngân hàng mình bị lag?

**Dân:** Chưa ông. Chắc đang chờ lệnh chuyển tiền của nhà đầu tư, tiền quốc tế nó có độ trễ.

**Chị HR:** Thông báo chung: Như đã chia sẻ, do tình hình khó khăn chung, lương tháng này sẽ được xử lý trong thời gian sớm nhất. Mong cả nhà đợi thêm một chút. Cảm ơn sự đồng hành của cả nhà!

Một trăm hai mươi người bấm "đã xem". Không ai bấm gì khác. Bạn nhìn vào ô nhập tin nhắn.

- ▸ Hỏi trong nhóm chung: "Sớm nhất là ngày nào ạ?" *(hỏi HR trong nhóm chung; căng thẳng +4; quan hệ Chị HR -8; quan hệ Uyên +6)*
- ▸ Nhắn riêng chị HR cho lịch sự *(nhắn riêng HR; quan hệ Chị HR +2)*
- ▸ Không nói gì, chắc mai có *(im lặng ngày lương đầu tiên bị lỡ; căng thẳng +3)*

*Nếu chọn "Hỏi trong nhóm chung: Sớm nhất là ngày nào ạ?":*

**Chị HR:** Hiện tại công ty đang cố gắng ạ.

**Bạn:** Cố gắng có chuyển khoản được không chị?

Tin nhắn được ba mươi lượt thả tim, tất cả đều từ những tài khoản không dám trả lời. Chị HR nhắn riêng: "Em ơi, có gì mình trao đổi riêng nhé".

*Nếu chọn "Nhắn riêng chị HR cho lịch sự":*

**Chị HR:** Chị hiểu em lo. Chị không có ngày cụ thể để nói với em, cũng không muốn nói một ngày rồi lại phải xin lỗi. Mà em đừng chia sẻ chuyện này ra ngoài nhé, ảnh hưởng tinh thần chung.

*Nếu chọn "Không nói gì, chắc mai có":*

Bạn gõ "dạ vâng ạ", xóa đi, rồi đặt điện thoại xuống. Ở đầu bên kia hành lang, Khoa cũng vừa làm đúng như vậy.

**Uyên:** Hôm nay ngày mùng 5. Mình ghi lại nhé: công ty thông báo lúc 15 giờ 20, không có ngày cụ thể. Bạn cũng nên ghi.

*Nếu hỏi lương ở buổi họp đầu năm:*

**Uyên:** Hôm họp đầu năm, bạn là người duy nhất hỏi lương trả ngày mấy. Cả phòng cười. Mình có ghi lại câu đó.

*Các nhánh trên gặp lại ở đây:*

*Nếu đã đọc kỹ hợp đồng:*

Bạn chợt nhớ trang 14, cỡ chữ 6. Bạn mở thư mục "Giấy tờ", và lần đầu tiên đọc lại nó một cách nghiêm túc.

*Các nhánh trên gặp lại ở đây:*

Tối đó bạn mở lịch. Trái tim nhỏ bạn vẽ vẫn còn đó. Bạn vẫn còn tiền tháng trước. Chắc là không sao. Chắc là tuần sau.

## Chương 3 — KPI Never Sleeps (tháng 3–4)

Lương vẫn trễ, KPI thì bắt đầu. Công ty trả 2/3 tháng lương một lần rồi im lặng, không thông báo gì về kế hoạch trả. Nhân viên bất mãn. Chiến dịch Vượt thác hóa rồng, và lối thoát đầu tiên: một lời mời việc nơi khác.

### ch3-kpi-launch

*tháng 3, tuần 1 · phòng họp*

Họp toàn công ty. Máy chiếu hiện dòng chữ: THỬ THÁCH 100 NGÀY BỨT PHÁ. Không có dòng nào về tiền.

**Phó GĐ Jeon Gwang-hoe:** Tình hình thị trường có chút thách thức. Nhưng thách thức là cơ hội mặc đồ lao động. Từ tháng này, mỗi người có KPI riêng.

**Phó GĐ Jeon Gwang-hoe:** KPI không phải để gây áp lực. KPI để các bạn thấy mình đang lớn lên từng ngày.

Có tiếng ghế xê dịch. Lần này nhiều người nhìn nhau hơn là nhìn màn hình.

- ▸ "Dạ thế lương tháng trước thì sao anh?" *(hiểu quyền lợi +6; niềm tin -4; quan hệ Phó GĐ Jeon Gwang-hoe -8; quan hệ Uyên +6; quan hệ Dân +3; hỏi sếp lương giữa buổi họp KPI)*
- ▸ "Dạ em đăng ký chỉ tiêu cao nhất ạ" *(niềm tin +5; quan hệ Phó GĐ Jeon Gwang-hoe +10; quan hệ Uyên -4; đăng ký chỉ tiêu cao nhất)*
- ▸ Im lặng ghi chỉ tiêu vào sổ

*Nếu chọn "Dạ thế lương tháng trước thì sao anh?":*

**Phó GĐ Jeon Gwang-hoe:** Các bạn phải nhìn xa hơn vấn đề trước mắt. Lương là chuyện của tháng. Bứt phá là chuyện của thập kỷ.

*Nếu chọn "Dạ em đăng ký chỉ tiêu cao nhất ạ":*

**Phó GĐ Jeon Gwang-hoe:** Đấy, tinh thần của người sẽ đi cùng công ty tới IPO. Cả nhà vỗ tay cho bạn này.

*Các nhánh trên gặp lại ở đây:*

**Chị HR:** Về vấn đề lương, công ty sẽ có thông tin trong tuần sau ạ. Cả nhà tiếp tục cố gắng nhé!

### ch3-first-tranche

*tháng 3, tuần 2 · bàn làm việc*

Ting. Tim bạn đập một nhịp. 10.000.000 đ, hai phần ba tháng lương. Nội dung: "TAM UNG DOT 1 LUONG T2". *(công ty trả 10.000.000 đ)*

**Cô Kế toán:** Đợt 1 là hai phần ba của tháng 2. Đợt 2 sẽ chuyển khi đợt 1 của tháng 3 hoàn tất, trừ phần đã ứng cho đợt 1 của đợt trước. Em hiểu chứ?

**Bạn:** Dạ... chắc là không ạ.

**Cô Kế toán:** Không sao. Cô cũng không. Cô chỉ nhập số thôi.

*Nếu ngồi cạnh Uyên:*

Ngồi cạnh Uyên từ ngày đầu, bạn thấy tập hồ sơ của cô dày lên từng tháng. Hôm nay cô quay ghế sang phía bạn.

*Các nhánh trên gặp lại ở đây:*

**Uyên:** Mình ghi từng khoản, từng lời hứa, đủ ngày giờ. Hồi công ty cũ đóng cửa, mình không có nổi một tờ giấy để đối chiếu. Lần này thì khác. Bạn làm cùng không?

- ▸ Được, mình bắt đầu từ hôm nay *(hiểu quyền lợi +15; bắt đầu ghi chép (mở "Lưu giấy tờ"); quan hệ Uyên +12)*
- ▸ Làm thế có căng quá không, để xem sao đã *(quan hệ Uyên -3)*

*Nếu chọn "Được, mình bắt đầu từ hôm nay":*

Uyên gửi bạn một mẫu ghi chép rất gọn. Từ giờ, trong tuần bạn có thể dành một lượt để lưu lại giấy tờ của mình.

*Nếu chọn "Làm thế có căng quá không, để xem sao đã":*

Uyên gật đầu, không nói gì thêm. Bạn thấy nhẹ người, và hơi có lỗi với chính mình của ba tháng sau.

### ch3-next-week

*tháng 3, tuần 3 · hành lang, pantry*

Bạn gặp Phó giám đốc ở hành lang, lúc anh đang vội đi đâu đó. Cơ hội hiếm hoi để hỏi riêng.

**Bạn:** Dạ anh ơi, phần lương còn lại của tháng trước bao giờ có ạ?

**Phó GĐ Jeon Gwang-hoe:** This week nhé em. Anh vừa nói chuyện với bên kia xong. Chậm nhất là next week.

**Anh Roger:** Em thấy chưa, anh đã bảo mà. Chủ tịch chưa bỏ ai bao giờ. Mình cứ làm tốt phần mình, tiền là chuyện của những người có tầm nhìn.

**Anh Huấn:** Anh cũng chưa có lương, nên anh không nói "this week" với em được. Em nhớ giữ giấy tờ của mình cho cẩn thận nhé. Anh nói với tư cách người đi làm lâu năm thôi.

- ▸ Cảm ơn anh Huni, và về xem lại thư mục giấy tờ *(quan hệ Anh Huấn +8; hiểu quyền lợi +8)*
- ▸ Anh Roger ở đây tám năm rồi, chắc anh ấy biết *(quan hệ Anh Roger +8; quan hệ Phó GĐ Jeon Gwang-hoe +3)*

*Nếu chọn "Cảm ơn anh Huni, và về xem lại thư mục giấy tờ":*

Anh Huấn gật đầu rồi quay lại với chồng việc của cả phòng. Anh ấy yêu nơi này thật, bạn nhìn là biết. Anh không hứa với bạn điều gì. Có lẽ anh cũng không biết nên tin vào điều gì nữa.

*Nếu chọn "Anh Roger ở đây tám năm rồi, chắc anh ấy biết":*

Anh Roger vỗ vai bạn hai cái. Bạn thấy vững lòng được đúng tới giờ ăn trưa.

### ch3-side-rumor

*tháng 3, tuần 4 · hành lang, pantry*

Góc hành lang. Khay trái cây thứ Sáu giờ chỉ còn một nải chuối, và một tờ giấy: "Mỗi người một quả, vì sự bền vững".

**Dân:** Tin nội bộ: nhà đầu tư đã ký biên bản ghi nhớ. Tức là họ nhớ. Tuần sau tiền về, tôi nói rồi đấy.

**Khoa:** Mọi người ơi, tháng này ai dư hong, cho mình mượn tạm tiền nhà với, toang thật rồi. Tuần sau có lương là mình trả liền!

Khoa vẫn cười. Nhưng đây là lần đầu bạn thấy Khoa cười mà mắt không cười theo.

- ▸ Cho Khoa mượn 1 triệu *(mất 1.000.000 đ; quan hệ Khoa +18; quan hệ Uyên +3; đã cho Khoa mượn tiền)* — *cần: tiền trong ví từ 1000000*
- ▸ Xin lỗi, mình cũng đang kẹt *(quan hệ Khoa -2)*

*Nếu chọn "Cho Khoa mượn 1 triệu":*

**Khoa:** Cảm ơn bạn nha. Thật đó. Tuần sau, chắc chắn luôn.

*Nếu chọn "Xin lỗi, mình cũng đang kẹt":*

**Khoa:** Hong sao đâu! Mình hỏi chơi thôi! Tuần sau có rồi mà!

### ch3-weekly-sync

*tháng 3, tuần 4 · phòng họp*

Chiều thứ Sáu, weekly sync với anh Roger. Mỗi người báo cáo tiến độ một lượt. Tới lượt bạn, bạn báo xong việc rồi khẽ hỏi chuyện lương.

**Anh Roger:** Anh có hỏi rồi. Next week, hopefully.

**Bạn:** Dạ "hopefully" là sao anh?

**Anh Roger:** Là mình phải có niềm tin, em ạ. Tuần sau mình sync tiếp.

Anh vừa nói vừa bấm tải lại hộp thư, dù chẳng có email nào mới.

**Anh Huấn:** Từ giờ thứ Sáu nào em cũng sẽ nghe câu đó. Anh Roger không nói dối đâu, anh ấy tin thật. Em cứ báo cáo cho đủ, việc mình làm thì mình làm đàng hoàng.

### ch3-badge

*ngày lương tháng 3 (mùng 5 tháng 4) · bàn làm việc*

Ngày mùng 5. Không có "ting". Thay vào đó là một email: "Chúc mừng! Bạn được vinh danh CHIẾN BINH THÁNG 3".

Đính kèm là một huy hiệu PNG 512 × 512. Bạn thử đưa nó cho chủ nhà trong tưởng tượng.

*Nếu đăng ký chỉ tiêu cao nhất:*

Bạn đăng ký chỉ tiêu cao nhất, nên huy hiệu của bạn có thêm một ngôi sao. Ngôi sao cũng là PNG.

*Các nhánh trên gặp lại ở đây:*

*Nếu để dành lương đầu:*

Tối đó bạn mở khoản tiết kiệm từ tháng đầu, lần đầu rút ra để đóng tiền nhà. Bạn thầm cảm ơn chính mình của tháng 1.

*Các nhánh trên gặp lại ở đây:*

**Chị HR:** Công ty ghi nhận sự cống hiến của từng thành viên! Về lương, hiện tại công ty đang cố gắng ạ.

### ch3-no-news

*tháng 4, tuần 1 · hành lang, pantry*

Góc pantry dạo này đông hơn phòng họp. Không ai còn nói chuyện dự án. Nhóm chat công ty thì im, hỏi gì cũng chỉ nhận về một trái tim của chị HR.

**Dân:** Tôi không sợ chậm, tôi sợ không ai nói gì. Nhà đầu tư nào cũng có báo cáo. Bọn mình làm ở đây mà không biết công ty còn bao nhiêu tiền. Tôi hỏi ba người về cái biên bản ghi nhớ rồi, chưa ai tận mắt thấy.

**Khoa:** Chủ nhà nhắn mà mình seen hoài cũng kỳ, trả lời thì biết nói gì. Cười hoài cũng mệt á.

Một bạn thực tập nhắn vào nhóm chung: "Cho em hỏi tuần sau là tuần nào ạ, em hỏi thật". Hai phút sau tin nhắn bị thu hồi.

**Uyên:** Năm tuần rồi, không có một thông báo nào về kế hoạch trả. Có người còn đang tính nghỉ, mà nghỉ thì tiền ai trả.

**Anh Huấn:** Anh hỏi lên trên ba lần rồi, đều chưa có câu trả lời. Anh xin lỗi, anh không có gì hơn để nói với các em.

- ▸ Than với nhóm một lúc rồi về làm tiếp *(căng thẳng -3; quan hệ Khoa +3)*
- ▸ Hỏi thẳng trong nhóm chung: "Công ty có kế hoạch trả lương chưa ạ?" *(căng thẳng +5; quan hệ Chị HR -6; quan hệ Anh Huấn +4)*

*Nếu chọn "Than với nhóm một lúc rồi về làm tiếp":*

Than xong thấy nhẹ người được một lúc. Rồi ai về chỗ nấy, mở ticket lên, như chưa có chuyện gì.

*Nếu chọn "Hỏi thẳng trong nhóm chung: Công ty có kế hoạch trả lương chưa ạ?":*

Tin nhắn của bạn được 43 lượt thả tim trong năm phút, từ những người chưa bao giờ dám hỏi. Chị HR đã xem. Không ai trả lời.

### ch3-new-project

*tháng 4, tuần 1 · phòng họp*

Sếp gọi nhóm của bạn vào phòng họp nhỏ. Trên bàn không có nước, vì mô hình nước cá nhân đã được triển khai.

**Phó GĐ Jeon Gwang-hoe:** Anh giao cho các em dự án Bứt Phá. Đối tác rất lớn. Làm xong là mọi vấn đề của công ty được giải quyết, kể cả vấn đề mà các em đang nghĩ tới.

**Uyên:** Dạ dự án này có ngân sách cho lương của nhóm không anh?

**Phó GĐ Jeon Gwang-hoe:** Uyên à, em đang nhìn vào ngón tay chứ không nhìn vào mặt trăng.

Cả phòng quay sang bạn, vì bạn là người duy nhất chưa nói gì.

- ▸ Đứng về phía Uyên: "Dạ em cũng muốn biết ạ" *(quan hệ Uyên +10; quan hệ Phó GĐ Jeon Gwang-hoe -6; đứng về phía Uyên)*
- ▸ Đỡ lời sếp: "Dạ em nghĩ cứ làm đã rồi tính" *(quan hệ Phó GĐ Jeon Gwang-hoe +8; quan hệ Uyên -8; quan hệ Khoa +4)*

*Nếu chọn "Đứng về phía Uyên: Dạ em cũng muốn biết ạ":*

Sếp mỉm cười, ghi gì đó vào sổ, và kết thúc cuộc họp sớm 40 phút. Không ai biết như thế là tốt hay xấu.

**Uyên:** Cảm ơn bạn. Ít nhất lần này mình không phải người duy nhất hỏi.

*Nếu chọn "Đỡ lời sếp: Dạ em nghĩ cứ làm đã rồi tính":*

Sếp vỗ vai bạn. Uyên gập sổ lại. Trên đường về, không ai nói gì với ai.

### ch3-dragon

*tháng 4, tuần 2 · phòng họp*

Sáng thứ Hai, cửa phòng họp dán một tấm băng rôn đỏ có hình con cá chép: "CHIẾN DỊCH VƯỢT THÁC HÓA RỒNG".

**Chị HR:** Cả nhà ơi! Công ty lập nhóm tiên phong Vượt Thác Hóa Rồng, dành cho những ai muốn cống hiến nhiều hơn. Tăng ca tự nguyện, họp 7 giờ sáng, và cuối tuần là của chung.

**Chị HR:** Benefit đặc biệt: thành viên nhóm được nhận trước một phần lương! Một phần thôi nhé cả nhà, phần còn lại là động lực.

Cả phòng im lặng một nhịp. Bạn đọc lại câu đó trên slide. Lương tháng trước, cho việc bạn đã làm xong, nay là một benefit.

**Anh Roger:** Anh đăng ký cả phòng rồi nhé. Đùa thôi, nhưng ai là người của công ty thì tự biết phải làm gì. Cá chép nào mà chẳng phải vượt thác.

**Anh Huấn:** Anh không cấm ai, ai cũng có hóa đơn cả. Anh chỉ thấy lạ là tiền mình làm ra rồi mà giờ phải xin bằng cách làm thêm.

- ▸ Không đăng ký. Mình đã vượt đủ thác trong giờ làm rồi *(quan hệ Anh Roger -5; quan hệ Anh Huấn +4)*
- ▸ Đăng ký. Tiền nhà thì không chờ được *(vào nhóm Vượt thác; niềm tin +6; công ty trả 5.000.000 đ; sức khỏe -12; căng thẳng +5; quan hệ Phó GĐ Jeon Gwang-hoe +5; quan hệ Anh Roger +8)*

*Nếu chọn "Không đăng ký. Mình đã vượt đủ thác trong giờ làm rồi":*

Bạn về chỗ. Trên nhóm chat, danh sách thành viên dài dần. Uyên chụp lại tấm băng rôn. Không có gì đâu, quen tay thôi.

*Nếu chọn "Đăng ký. Tiền nhà thì không chờ được":*

Ting. 5.000.000 đ, nội dung "BENEFIT VUOT THAC". Vẫn chỉ một phần ba tháng lương, và trong sổ của bạn nó chỉ là phần còn thiếu của tháng 2. Tối đó bạn ở lại tới 10 giờ: lần đầu tiên bạn làm thêm để được trả tiền cho việc đã làm.

### ch3-chart

*tháng 4, tuần 3 · hành lang, pantry*

Sáng nay bàn đối diện trống. Cây xương rồng còn đó, người thì không. Không có email chia tay nào cả.

**Dân:** Thằng bên kỹ thuật nghỉ rồi. Nghỉ thế này thì coi như tự bỏ tiền được nợ, dại. Đợi thêm một tháng là có.

**Uyên:** Bạn ấy có hỏi mình cách lấy lại giấy tờ trước khi đi. Nghỉ việc không xóa được khoản đã làm, nhưng không có giấy thì khó đòi.

**Bạn:** Lần đầu tiên, có ai đó rời đi mà mình thấy ghen tị thay vì lo cho họ. *(căng thẳng +4)*

### ch3-other-offer

*tháng 4, tuần 4 · nhà riêng*

Một người bạn cũ nhắn: bên họ đang thiếu người. Lương thấp hơn một chút, không có tầm nhìn nào hết, nhưng trả đúng ngày. Họ cần câu trả lời trong tuần.

**Bạn:** Bốn tháng rồi. Đi bây giờ thì khoản đang bị nợ tính sao? Mà ở lại thì nó chỉ dài thêm.

- ▸ Từ chối. Nghỉ lúc này thì chưa biết phải đòi khoản còn thiếu thế nào *(từ chối lời mời việc của người bạn)*
- ▸ Nhận lời. Rời đi ngay, trước khi con số dài thêm

*Nếu chọn "Nhận lời. Rời đi ngay, trước khi con số dài thêm":*

Bạn gõ "ok mình nhận nha" rồi chưa bấm gửi. Đi tối nay thì những tháng đang bị nợ sẽ đi theo bạn dưới dạng một con số, mà trong tay chưa có tờ giấy nào ghi con số đó. Bạn nhắn hỏi Uyên, người duy nhất ở công ty bạn biết chắc sẽ nói thật.

**Uyên:** Đi được thì đi, mình không cản. Nhưng đi cho tỉnh: bảng lương, bảng công, hợp đồng, xin đủ rồi hãy đi. Ra khỏi cửa rồi là không ai trả lời bạn nữa đâu.

**Bạn:** Tin nhắn vẫn nằm trong ô soạn thảo. Gửi hay không?

- ▸ Gửi. Mình cần chỗ trả lương đúng ngày hơn là một lời giải thích *(nghỉ sớm; kết thúc lượt chơi)*
- ▸ Xóa đi. Ở lại thêm, ít nhất tới khi đủ giấy tờ *(từ chối lời mời việc của người bạn; hiểu quyền lợi +5)*

*Nếu chọn "Từ chối. Nghỉ lúc này thì chưa biết phải đòi khoản còn thiếu thế nào":*

Bạn nhắn lại "cảm ơn nha". Người bạn trả lời bằng một cái mặt cười hơi buồn.

*Nếu chọn "Xóa đi. Ở lại thêm, ít nhất tới khi đủ giấy tờ":*

Bạn xóa từng chữ rồi nhắn lại "cảm ơn nha, để lần khác". Không phải vì bạn còn tin. Lần này bạn ở lại vì có việc phải làm.

*Nếu chọn "Gửi. Mình cần chỗ trả lương đúng ngày hơn là một lời giải thích":*

Anh Huấn là người ký giấy cho bạn. "Đi đi em, chuyện này không có gì phải ngại." Anh Roger thì không ra chào: anh nói bạn đã bỏ rơi tầm nhìn.

### ch3-promise

*ngày lương tháng 4 (mùng 5 tháng 5) · bàn làm việc*

**Chị HR:** Thông báo chung: công ty đã ghi nhận các thắc mắc của cả nhà. Khi có thông tin, công ty sẽ thông báo. Cảm ơn sự kiên nhẫn phi thường của cả nhà!

**Khoa:** Vậy là... sắp có thông tin rồi đúng không mọi người?

**Uyên:** Hai tháng rồi, họ vẫn chưa đưa ra một ngày cụ thể. Mình lưu email này lại. Ít nhất sau này biết họ đã nói gì, vào lúc nào.

*Nếu bắt đầu ghi chép (mở "Lưu giấy tờ"):*

Bạn thêm một dòng vào sổ ghi chép của mình: ngày, giờ, người gửi, nội dung. Tay bạn viết rất đều. *(có giấy tờ "Sổ ghi lời hứa")*

*Các nhánh trên gặp lại ở đây:*

Bạn mở lịch ra. Trái tim nhỏ của tháng đầu tiên vẫn còn đó. Bạn định xóa nó đi, rồi thôi.

## Chương 4 — Six Months Later (tháng 5–6)

Lương giảm còn 1/3 và chỉ vài người có, không ai nói vì sao, nên trong phòng bắt đầu có người không nhìn mặt nhau. Khoa ngừng cười rồi rời đi. Anh Roger lần đầu không nói "next week". Người nghỉ dần, ai cũng vay mượn. Nhóm so số liệu hình thành. Phó giám đốc tung "1–2 triệu đô" và IPO để giữ người. KPI bị giam, vậy mà vẫn đánh giá hiệu suất.

### ch4-second-tranche

*tháng 5, tuần 1 · bàn làm việc*

*Nếu quan hệ với Phó GĐ Jeon Gwang-hoe từ 8:*

Ting. 5.000.000 đ, giảm còn một phần ba tháng lương, không kèm thông báo nào. Chị HR nhắn riêng: "Khoản ứng riêng của em, đừng nói với ai nhé". *(công ty trả 5.000.000 đ)*

*Nếu vào nhóm Vượt thác:*

Ting. 5.000.000 đ, vẫn một phần ba tháng lương. Nội dung: "UNG DOT 1 CUA DOT 2 LUONG T2 BU T3". Bạn đọc ba lần và hiểu ít hơn sau mỗi lần. *(công ty trả 5.000.000 đ)*

*Nếu không:*

Sáng nay trong phòng có vài tiếng ting rải rác. Ai có thì cúi mặt nhìn điện thoại. Điện thoại của bạn nằm im. *(căng thẳng +5)*

**Uyên:** Mình hỏi bảy người: ba người có, bốn người không. Cùng phòng, cùng chức danh, cùng số tháng làm. Đợt này chỉ vài người có, nhiều người ba bốn tháng liền chưa nhận được đồng nào.

Cuối dãy bàn, một đồng nghiệp vừa liếc màn hình rồi úp vội điện thoại xuống khi thấy mọi người nhìn sang. Cả phòng bỗng rất chăm chú vào việc của mình.

**Bạn:** Có tiêu chí gì không? Ai có, ai không, là do đâu?

- ▸ Không hỏi nữa, cúi xuống làm việc *(căng thẳng +3)*
- ▸ Hỏi nhỏ những người vừa nhận được tiền *(quan hệ Dân +3)*
- ▸ Hỏi thẳng chị HR về tiêu chí thanh toán *(đã hỏi tiêu chí trả lương; quan hệ Chị HR -5; hiểu quyền lợi +6)*

*Nếu chọn "Hỏi nhỏ những người vừa nhận được tiền":*

Người ta lắc đầu, bảo cũng không biết vì sao mình có tên. "Đừng nói với ai nhé." Bạn nhìn họ, và thấy họ cũng sợ.

*Nếu chọn "Hỏi thẳng chị HR về tiêu chí thanh toán":*

**Chị HR:** Công ty có quy trình ưu tiên riêng em nhé, chị chưa thể chia sẻ chi tiết. Em đừng hiểu theo hướng có danh sách.

*Các nhánh trên gặp lại ở đây:*

**Cô Kế toán:** Đừng hỏi cô. Danh sách từ trên đưa xuống. Cô đã xin nghỉ phép một tuần chỉ để không phải giải thích.

**Dân:** Thấy chưa, dòng tiền bắt đầu chảy lại. Đây là chữ V, ông nhìn đáy rồi đấy. Chỉ là tôi chưa có tên trong đợt này thôi.

**Uyên:** Không có tiêu chí thì người ta sẽ tự nghĩ ra tiêu chí. Từ hôm nay trong phòng bắt đầu có người không nhìn mặt nhau.

**Anh Huấn:** Cứ lúc mọi người định nghỉ là lại có một ít, mà chỉ cho vài người. Thế là người có thì im, người không có thì ngại hỏi. Em nhớ ghi lại nhé.

### ch4-khoa-stairs

*tháng 5, tuần 2 · hành lang, pantry*

Giờ nghỉ trưa, bạn tìm thấy Khoa ngồi ở bậc cầu thang thoát hiểm, tay cầm điện thoại đã tắt màn hình. Hôm nay Khoa không xuống pantry.

**Bạn:** Khoa mà không đói á?

*Nếu quan hệ với Khoa tới 4:*

**Khoa:** Hong sao đâu, mình ổn mà! Bạn đi ăn đi.

Bạn gật đầu rồi đi. Hai người chưa bao giờ đủ thân để hỏi thêm câu nữa. Sau này bạn còn nghĩ lại cái gật đầu đó nhiều lần.

*Nếu không:*

*Nếu đã cho Khoa mượn tiền:*

**Khoa:** Một triệu hồi tháng 3 mình vẫn chưa trả bạn. Mình có ghi. Mình không quên đâu.

*Nếu đã mời cả nhóm ăn trưa:*

**Khoa:** Mình đang nhớ bữa cơm tấm tháng đầu bạn mời. Mình gọi thêm trứng đó. Giờ nghĩ lại thấy như chuyện của người khác.

*Các nhánh trên gặp lại ở đây:*

**Khoa:** Mình mới gọi về nhà. Ba mẹ hỏi chừng nào về. Hồi đó mình flex công ty ghê lắm, ba mẹ khoe khắp xóm. Giờ về rồi biết nói sao đây.

**Khoa:** Bạn có nghĩ mình thất bại không?

- ▸ "Cố thêm một tháng nữa đi" *(quan hệ Khoa +3; căng thẳng +2)*
- ▸ "Ở đây làm bạn kiệt sức thì nghỉ cũng đâu phải thất bại" *(quan hệ Khoa +5; Khoa tin bạn (sẽ tự nói lời tạm biệt))*
- ▸ "Công ty nợ lương, chứ bạn có nợ công ty đâu. Đừng nhận lỗi về mình" *(quan hệ Khoa +8; Khoa tin bạn (sẽ tự nói lời tạm biệt))*

*Nếu chọn "Cố thêm một tháng nữa đi":*

**Khoa:** Ừ. Chắc tuần sau có. Mình cũng nói vậy với chủ nhà.

*Nếu chọn "Ở đây làm bạn kiệt sức thì nghỉ cũng đâu phải thất bại":*

**Khoa:** Ừ ha. Nghe dễ quá trời.

*Nếu chọn "Công ty nợ lương, chứ bạn có nợ công ty đâu. Đừng nhận lỗi về mình":*

Khoa không trả lời. Khoa quay mặt đi một lúc lâu, rồi cười. Lần này mắt cũng cười, mà đỏ hoe.

### ch4-khoa-leaves

*tháng 5, tuần 3 · hành lang, pantry*

*Nếu đã cho Khoa mượn tiền HOẶC Khoa tin bạn (sẽ tự nói lời tạm biệt):*

**Khoa:** Mình đi nha, **[tên người chơi]**. Về quê phụ ba mẹ một thời gian. Bạn đừng nói với ai, mình... không muốn người ta thấy mình bỏ cuộc.

Khoa đang xếp đồ vào một thùng giấy. Cái phích công ty tặng nằm trên cùng. Lần đầu tiên bạn thấy Khoa không cười.

**Khoa:** Mình từng tin tuần sau có lương. Mười mấy tuần rồi đó. Mình gửi bạn bản chấm công của mình với mấy bạn đã đồng ý, ai cần thì có. Bạn đừng tin như mình nha. *(có giấy tờ "Bảng chấm công"; Khoa đã nói lời tạm biệt; Khoa đã nghỉ; căng thẳng +6)*

*Nếu không:*

Sáng thứ Hai, bàn Khoa trống trơn. Tên Khoa đã biến khỏi nhóm chat. Không ai biết từ lúc nào.

Trên bàn còn lại đúng một cái phích. Bạn định nhắn hỏi thăm, rồi thấy mình chẳng có gì để nói. *(Khoa đã nghỉ; căng thẳng +6)*

*Nếu ngồi cạnh Khoa:*

Ghế bên cạnh bạn từ ngày đầu giờ trống. Chiều đó bạn quay sang định nói gì đó, rồi nhớ ra.

*Nếu không:*

Chiều đó cả phòng yên hơn thường ngày một chút. Không ai nói vì sao.

### ch4-borrowing

*tháng 5, tuần 3 · hành lang, pantry*

Giờ nghỉ trưa, pantry im hơn thường ngày. Ai cũng ăn cơm mang từ nhà, và không ai hỏi nhau ăn gì nữa.

**Dân:** Tôi vừa mở cái thẻ tín dụng thứ ba. Gọi là đòn bẩy tài chính. Đợt gọi vốn này về là tôi tất toán hết, ông xem.

**Anh Huấn:** Hôm qua một bạn trong phòng mượn anh tiền đóng học cho con. Bạn ấy đứng khóc ở thang máy. Anh đưa được một ít, mà anh cũng đang vay bên nhà vợ. Tháng sau chắc anh không làm vậy được nữa.

**Uyên:** Mình hỏi mười một người thì chín người đang vay. Vay bố mẹ, vay bạn, vay trên điện thoại, lãi tính theo ngày.

Không ai than. Họ nói về nợ như nói về thời tiết. Bạn nghĩ tới những người ở quê, đang trả thay cho một công ty họ chưa từng nghe tên.

- ▸ Gật đầu, giữ chuyện của mình cho riêng mình *(căng thẳng +3)*
- ▸ Kể thật tình hình tiền bạc của mình *(quan hệ Anh Huấn +6; quan hệ Uyên +6; căng thẳng -2)*

*Nếu chọn "Gật đầu, giữ chuyện của mình cho riêng mình":*

Tối đó bạn mở ứng dụng vay trên điện thoại, đọc dòng lãi suất, rồi tắt đi. Chưa phải hôm nay.

*Nếu chọn "Kể thật tình hình tiền bạc của mình":*

**Anh Huấn:** Cảm ơn em đã nói. Không ai ở đây phải xấu hổ vì chuyện này cả. Người đang nợ lương đâu phải là mình.

### ch4-different-debts

*tháng 5, tuần 4 · hành lang, pantry*

Bạn và Uyên ngồi ở quán cóc đầu ngõ, cà phê 15 nghìn, thứ duy nhất quanh đây vẫn được trả tiền đúng giá.

*Nếu đã hỏi tiêu chí trả lương:*

**Uyên:** Chuyện bạn hỏi HR về tiêu chí, cả tầng biết rồi. Ba người kéo mình ra hỏi bạn là ai, giọng rất nhỏ.

*Các nhánh trên gặp lại ở đây:*

**Uyên:** Sau bảy người hôm trước, mình hỏi thêm bốn người nữa. Mười một người, không ai giống ai. Người được đợt 1, người chưa, người được ứng riêng. Chia nhỏ ra thì không ai biết mình bị nợ nhiều hay ít so với người khác.

**Bạn:** Tức là mỗi người đang nghĩ mình là trường hợp đặc biệt?

**Uyên:** Ừ. Và trường hợp đặc biệt thì không ai đi hỏi người khác. Mình đang định gom mọi người lại, chỉ để so số liệu thôi.

### ch4-date-passes

*ngày lương tháng 5 (mùng 5 tháng 6) · bàn làm việc*

Hết tháng 5. Vẫn không có một dòng nào về kế hoạch trả lương. Tháng trôi qua êm đềm như một tháng bình thường, vì với công ty thì đúng là vậy. *(niềm tin -8)*

**Chị HR:** Thông báo chung: nhằm đảm bảo quyền lợi tốt nhất, lộ trình thanh toán được điều chỉnh linh hoạt. Công ty trân trọng sự đồng hành của cả nhà!

*Nếu vào nhóm Vượt thác:*

**Chị HR:** Riêng nhóm Vượt Thác Hóa Rồng: benefit tháng này tạm dời sang đợt sau. Rồng thì phải kiên nhẫn cả nhà ơi!

*Các nhánh trên gặp lại ở đây:*

**Uyên:** Lần thứ bảy công ty đổi cách nói về lịch trả lương. Mình đếm rồi.

### ch4-group

*tháng 6, tuần 1 · hành lang, pantry*

*Nếu quan hệ với Uyên tới -10:*

Tối thứ Năm có sáu người ngồi ở quán cũ. Bạn biết chuyện khi thấy tấm ảnh trong nhóm chat. Không ai rủ bạn.

**Bạn:** Giờ nhắn Uyên còn kịp không?

- ▸ Thôi, họ không cần mình *(căng thẳng +3)*
- ▸ Nhắn Uyên, gửi kèm những giấy tờ mình đang có *(vào nhóm so số liệu; quan hệ Uyên +10; quan hệ Chị HR -6)* — *cần: số giấy tờ từ 2*

*Nếu chọn "Thôi, họ không cần mình":*

Bạn thả tim tấm ảnh, rồi tắt điện thoại.

*Nếu chọn "Nhắn Uyên, gửi kèm những giấy tờ mình đang có":*

**Uyên:** Giấy tờ này đúng. Thứ Năm tuần sau, quán cũ. Mang bản gốc nhé.

*Nếu không:*

*Nếu đứng về phía Uyên:*

**Uyên:** Hôm họp dự án Bứt Phá, bạn là người duy nhất hỏi cùng mình. Nên mình muốn có bạn ở đó.

*Các nhánh trên gặp lại ở đây:*

**Uyên:** Tối thứ Năm, quán cũ, sáu người đã nhận lời. Không phải để làm căng. Chỉ là mang giấy tờ tới, xem mình đang ở đâu. Bạn đi không?

- ▸ Đi. Mình sẽ mang theo mọi thứ mình có *(vào nhóm so số liệu; quan hệ Uyên +15; quan hệ Chị HR -6)*
- ▸ Thôi, mình không muốn dính vào chuyện này *(quan hệ Uyên -10)*

*Nếu chọn "Đi. Mình sẽ mang theo mọi thứ mình có":*

Tối thứ Năm, bảy người ngồi quanh một cái bàn nhựa, xếp giấy tờ thành chồng. Không ai nói to. Lần đầu tiên sau nhiều tháng, bạn không thấy mình đơn độc.

*Nếu chọn "Thôi, mình không muốn dính vào chuyện này":*

Uyên không nói gì, chỉ gật đầu rồi quay về chỗ. Tối thứ Năm bạn ở nhà, xem đi xem lại số dư tài khoản.

### ch4-roger-crack

*tháng 6, tuần 1 · bàn làm việc*

Bạn ở lại muộn. Cả tầng đã tắt đèn, chỉ còn bàn anh Roger sáng. Trên bàn là tấm ảnh tập thể cũ và một email in ra: "Welcome to the C* Family".

*Nếu quan hệ với Anh Roger tới -1:*

Anh ngẩng lên thấy bạn, úp tấm ảnh xuống bàn. "Em về đi, muộn rồi." Giữa hai người chưa bao giờ có chuyện gì ngoài tầm nhìn.

*Nếu không:*

**Anh Roger:** Tám năm trước anh đến đây với đúng một cái vali. Không biết tiếng, không biết đường. Chủ tịch là người đầu tiên cho anh cơ hội.

Điện thoại anh rung, một tin nhắn từ ngân hàng. Anh nhìn một lúc, rồi úp xuống bàn.

**Bạn:** Anh cũng chưa có lương ạ?

**Anh Roger:** Anh... cũng đang đợi.

Lần đầu tiên anh không nói "next week".

- ▸ Không hỏi thêm, chúc anh ngủ ngon *(căng thẳng -2)*
- ▸ "Anh có nghĩ mình nên rời đi không?" *(quan hệ Anh Roger -3)*
- ▸ "Anh đâu cần giải thích thay công ty những điều chính anh cũng chưa biết" *(quan hệ Anh Roger +4; anh Roger bắt đầu nghi ngờ)*

*Nếu chọn "Không hỏi thêm, chúc anh ngủ ngon":*

Anh gật đầu. Lúc ra thang máy bạn nhìn lại, anh vẫn ngồi đó, tấm ảnh trong tay.

*Nếu chọn "Anh có nghĩ mình nên rời đi không?":*

**Anh Roger:** Đi đâu hả em? Anh đã nói với cả nhà là anh làm ở một công ty sẽ thay đổi tất cả. Em về đi, muộn rồi.

*Nếu chọn "Anh đâu cần giải thích thay công ty những điều chính anh cũng chưa biết":*

**Anh Roger:** Anh đã giới thiệu công ty này cho rất nhiều người. Có người chuyển cả gia đình tới đây. Nếu những gì anh nói với họ không đúng... anh không biết phải nhìn mặt họ thế nào.

### ch4-the-dollars

*tháng 6, tuần 2 · phòng họp*

Tuần này có thêm bốn lá đơn nghỉ việc. Cả công ty được gọi lên phòng họp, lần đầu sau nhiều tháng. Trái cây quay lại, đúng một đĩa. Trên slide chỉ có một dòng: "$1–2 TRIỆU". *(đã nghe màn 1–2 triệu đô)*

**Phó GĐ Jeon Gwang-hoe:** Các bạn. Anh báo tin vui. Anh vừa đào được 1–2 triệu đô. Anh nhắc lại: 1–2 triệu đô. Các bạn hiểu điều đó nghĩa là gì không?

**Uyên:** Dạ anh ơi, là 1 triệu hay 2 triệu ạ? Với khoản đợt trước anh báo đã về chưa ạ?

**Phó GĐ Jeon Gwang-hoe:** Hai việc khác nhau, các bạn đừng nhầm lẫn giữa các giai đoạn. Quan trọng là đã có. Và đây mới là tin lớn: công ty đang hướng tới IPO.

**Phó GĐ Jeon Gwang-hoe:** Sau IPO, anh em sẽ được phát cổ phiếu nội bộ. Ai ráng ở lại là cổ đông của công ty mình đấy. Ai đi bây giờ thì rất tiếc.

**Anh Roger:** Phòng mình không ai đi cả! Cổ đông tương lai cả đấy! Đây là lúc chứng minh lòng trung thành, Chủ tịch đang nhìn chúng ta.

*Nếu anh Roger bắt đầu nghi ngờ:*

Anh Roger nói đúng những chữ đó, nhưng tuần trước bạn đã thấy anh ngồi một mình. Giọng anh to, mắt anh không nhìn ai. Tiếng vỗ tay thưa thớt.

*Nếu không:*

Có tiếng vỗ tay, phần lớn là của anh Roger. Anh chưa bao giờ đọc kỹ hợp đồng của mình, nhưng anh biết chắc Chủ tịch sẽ không bỏ anh.

**Anh Huấn:** Đợt trước anh ấy cũng đào được chừng đó, cách đây đúng sáu tháng. Anh ở lại vì anh em trong phòng, không phải vì cổ phiếu. Lương còn chưa có thì cổ phiếu là gì hả em. Em cứ tính chuyện của em nhé.

- ▸ Im lặng, và nhẩm xem con số đó trả được mấy tháng lương *(niềm tin -5; hiểu quyền lợi +4; quan hệ Anh Huấn +4; căng thẳng +2)*
- ▸ Ghi nguyên văn vào sổ, kèm ngày giờ *(có giấy tờ "Sổ ghi lời hứa")* — *cần: bắt đầu ghi chép (mở "Lưu giấy tờ")*
- ▸ Vỗ tay. Lần này biết đâu là thật *(niềm tin +6; quan hệ Phó GĐ Jeon Gwang-hoe +6; quan hệ Anh Roger +8; căng thẳng -3)*

*Nếu chọn "Im lặng, và nhẩm xem con số đó trả được mấy tháng lương":*

Đủ trả hết nợ lương cả công ty mà vẫn còn dư, nếu nó có thật. Bạn quyết định đợi tiếng "ting" rồi mới tính tiếp.

*Nếu chọn "Ghi nguyên văn vào sổ, kèm ngày giờ":*

Bạn viết: "1–2 triệu đô. Không rõ 1 hay 2. Không rõ bao giờ." Dòng ghi chép này nằm ngay dưới dòng "this week" của ba tháng trước.

*Nếu chọn "Vỗ tay. Lần này biết đâu là thật":*

Anh Roger gật đầu với bạn, mắt sáng lên. Đĩa trái cây hết trong bốn phút.

### ch4-dan-doubts

*tháng 6, tuần 3 · bàn làm việc*

*Nếu ngồi cạnh Dân:*

Sáu tháng ngồi cạnh Dân, bạn thuộc ba cửa sổ tin tức đó như thuộc đường về nhà. Sáng nay lần đầu Dân không đọc to tin nào.

*Các nhánh trên gặp lại ở đây:*

Dân ngồi lì trước ba cửa sổ tin tức. Cả ba đều không có tin gì về công ty. Hôm nay Dân không nói gì về chữ V.

**Dân:** Hôm qua tôi gọi cho người quen bên nhà đầu tư. Họ hỏi lại tôi: "Công ty nào?".

Lần đầu tiên bạn thấy Dân không có câu trả lời cho điều gì đó.

- ▸ Rủ Dân tham gia nhóm của Uyên *(Dân vào nhóm; quan hệ Dân +10)* — *cần: vào nhóm so số liệu VÀ quan hệ với Dân từ 12*
- ▸ Vỗ vai Dân: "Chắc chỉ là nhầm thôi" *(quan hệ Dân +3)*

*Nếu chọn "Rủ Dân tham gia nhóm của Uyên":*

**Dân:** Tôi có bảng theo dõi dòng tiền từ hai năm nay. Toàn bằng tin đồn, nhưng ngày tháng thì chuẩn. Để tôi mang tới.

*Nếu chọn "Vỗ vai Dân: Chắc chỉ là nhầm thôi":*

**Dân:** Ừ. Chắc thế. Chắc là nhầm.

### ch4-kpi-held

*tháng 6, tuần 4 · bàn làm việc*

Hợp đồng ghi tiền KPI bằng 30% lương. Tháng đầu tiên bạn nhận đủ. Từ đó tới nay chưa thấy lại, dù bạn vẫn chạy chỉ tiêu. Tháng trước thì đến cả phiếu lương cũng không có.

**Bạn:** Dạ cô ơi, tiền KPI của em nằm ở đâu ạ? Với bảng lương tháng trước em chưa nhận được.

**Cô Kế toán:** KPI của em có ghi nhận rồi. Nhưng đang được giữ.

**Bạn:** Giữ ở đâu ạ?

**Cô Kế toán:** Ở chỗ giữ. Còn bảng lương tháng đó đang được chuẩn hóa. Cô nói thật, cô nhập số mà cô cũng chưa thấy nó.

*Nếu hỏi cô Kế toán chuyện lương:*

**Cô Kế toán:** Em là người đầu tiên hỏi cô chuyện lương, từ hồi tháng 2, lúc cô bảo bên trên ở bên trên. Tới giờ bên trên vẫn ở bên trên.

*Các nhánh trên gặp lại ở đây:*

**Dân:** Giam KPI đấy ông. Nghe cứ như KPI của ông vừa phạm tội.

**Anh Huấn:** Không có bảng lương thì mình tự ghi. Tháng nào nhận bao nhiêu, ngày nào, ghi hết. Công ty không đưa giấy thì mình có giấy của mình. *(căng thẳng +4; quan hệ Anh Huấn +3)*

### ch4-performance-review

*tháng 6, tuần 4 · phòng họp*

Email gửi toàn công ty: "Đánh giá hiệu suất giữa năm. Nhân viên chuẩn bị báo cáo KPI cá nhân". Bạn nhìn email, rồi nhìn sổ lương.

**Phó GĐ Jeon Gwang-hoe:** Sáu tháng vừa qua chúng ta có những bước tiến rất đáng tự hào. Từng người sẽ được đánh giá công bằng, chi tiết tới từng ticket.

**Bạn:** Dạ, KPI của nhân viên có được thanh toán theo kết quả đánh giá không ạ? Tiền KPI các tháng trước vẫn đang được giữ.

Căn phòng im lặng. Công ty đo được từng ticket của bạn, nhưng chưa ai đo được bạn đã nhận bao nhiêu.

**Phó GĐ Jeon Gwang-hoe:** Ghi nhận hiệu suất và giải ngân là hai quy trình khác nhau. Chúng ta không nên để những vấn đề ngắn hạn ảnh hưởng tới mục tiêu dài hạn.

- ▸ Im lặng, chờ cuộc họp kết thúc *(căng thẳng +3)*
- ▸ Quay sang hỏi cô Kế toán về bảng tính KPI *(quan hệ Cô Kế toán +5)*
- ▸ Đặt hợp đồng lên bàn, đọc đúng dòng ghi KPI 30% *(quan hệ Phó GĐ Jeon Gwang-hoe -8; hiểu quyền lợi +6; căng thẳng +3)* — *cần: có "Hợp đồng lao động"*

*Nếu chọn "Im lặng, chờ cuộc họp kết thúc":*

Cuộc họp kết thúc đúng giờ, lần đầu tiên trong năm. Trên bảng vẫn còn dòng chữ "Tự hào".

*Nếu chọn "Quay sang hỏi cô Kế toán về bảng tính KPI":*

**Cô Kế toán:** Cô chỉ nhập số. Số thì cô có. Tiền thì cô không có.

*Nếu chọn "Đặt hợp đồng lên bàn, đọc đúng dòng ghi KPI 30%":*

Không ai nói gì trong đúng tám giây. Phó giám đốc cảm ơn bạn đã "rất sát sao", rồi chuyển sang slide tiếp theo. Dưới gầm bàn, Uyên khẽ giơ ngón cái.

### ch4-six-months

*ngày lương tháng 6 (mùng 5 tháng 7) · nhà riêng*

Hơn sáu tháng kể từ ngày nhận email "Hành trình phi thường của bạn bắt đầu từ đây". Bạn mở lại nó. Bạn đã từng thấy nó vui đến thế. *(niềm tin -6)*

Bạn cộng lại mọi tháng bị nợ. Hóa ra bạn không còn là nhân viên nữa. Bạn là nhà đầu tư thiên thần bất đắc dĩ của công ty này.

*Nếu ký hợp đồng không đọc:*

Bạn đã ký hợp đồng này trong 11 giây. Đêm nay bạn mở lại, đọc tới trang 14, cỡ chữ 6: "Thời điểm thanh toán có thể được điều chỉnh để phù hợp với lộ trình phát triển chung". Bạn mất sáu tháng để đọc tới đó.

*Các nhánh trên gặp lại ở đây:*

**Bạn:** Ngày đó mình đi tìm một công việc tốt. Giờ mình đang đi tìm tiền lương của chính mình. Làm gì tiếp đây?

- ▸ Thôi đợi. Từ giờ mình sẽ hành động *(hiểu quyền lợi +10; quyết định hành động; căng thẳng -6)*
- ▸ Đợi thêm một tháng nữa, biết đâu *(quan hệ Phó GĐ Jeon Gwang-hoe +4)*
- ▸ Hết tin rồi, cũng chẳng biết đòi ở đâu. Thôi nghỉ luôn *(nghỉ sớm; kết thúc lượt chơi)* — *cần: niềm tin vào công ty không quá 30 VÀ hiểu quyền lợi không quá 40*

*Nếu chọn "Hết tin rồi, cũng chẳng biết đòi ở đâu. Thôi nghỉ luôn":*

Bạn viết đơn nghỉ việc lúc nửa đêm, ba dòng. Không có gì để đòi, không có gì để tin. Bạn chỉ thấy mệt, và muốn ngủ.

*Nếu chọn "Thôi đợi. Từ giờ mình sẽ hành động":*

Bạn tạo một thư mục mới, đặt tên là "Của mình". Chỉ vậy thôi. Nhưng đêm đó bạn ngủ được.

*Nếu chọn "Đợi thêm một tháng nữa, biết đâu":*

Bạn đóng laptop. "Biết đâu" là từ đắt nhất bạn từng dùng, tính theo lãi suất.

## Chương 5 — The Awakening (tháng 7)

Người chơi đối chiếu số liệu, và thấy chính bảng của nhóm cũng có thể sai. Họ chọn cách lên tiếng, trong đó có email đòi quyền lợi làm bằng chứng. Công ty trả lời vòng vo, lần đầu lộ vẻ lo lắng sau cánh cửa phòng họp, rồi dụ dỗ bằng một chức danh.

### ch5-compare

*tháng 7, tuần 1 · hành lang, pantry*

*Nếu vào nhóm so số liệu:*

Tối nay nhóm lập một bảng đối chiếu: ai, tháng nào, được hứa gì, nhận bao nhiêu, còn thiếu bao nhiêu. Dòng cuối cùng có con số làm cả bàn im lặng. *(có giấy tờ "Bảng đối chiếu của nhóm"; quan hệ Uyên +6)*

**Uyên:** Mỗi dòng phải có nguồn. Sao kê ghi sao kê, hợp đồng ghi hợp đồng, ai nhớ bằng lời thì đánh dấu chưa xác minh. Đây chưa phải để kiện ai, chỉ để biết chính xác mình đang nói về cái gì.

*Nếu không:*

Bạn tự lập một bảng tính, một mình, lúc một giờ sáng. Hàng duy nhất là tên bạn. Nó trông nhỏ hơn bạn tưởng. *(căng thẳng +4)*

### ch5-wrong-number

*tháng 7, tuần 1 · hành lang, pantry*

*Nếu không:*

**Uyên:** Ai điền vào cột "tiền về" đây? Dòng này ghi công ty vừa nhận một khoản lớn. À, lại là tin của Dân ở pantry.

*Nếu Dân vào nhóm:*

**Dân:** Tin chắc đây: tuần trước công ty vừa nhận một khoản lớn từ nhà đầu tư. Tôi điền vào bảng rồi đấy, cột "tiền về".

**Uyên:** Khoan. Mình vừa đối chiếu: khoản đó về tài khoản một công ty khác trong tập đoàn. Với cả dòng tháng 4 mình cộng trùng một khoản ứng. Mình sai. Mình chưa bao giờ sai.

Cả bàn im lặng. Uyên nhìn cái bảng như nhìn một người vừa nói dối mình. Lần đầu tiên bạn thấy cô run tay. Tin nghe được hóa ra không phải giấy tờ, và giấy tờ cũng có thể sai.

**Uyên:** Muộn rồi. Mai là phải dùng tới bảng này. Soát lại từ đầu thì hết cả đêm.

- ▸ Ngồi lại soát từng dòng cùng Uyên *(sức khỏe -12; quan hệ Uyên +10; quan hệ Dân +4; hiểu quyền lợi +6)*
- ▸ Sửa đúng dòng đó thôi, gần đúng là được rồi *(bảng của nhóm còn lỗi)*

*Nếu chọn "Ngồi lại soát từng dòng cùng Uyên":*

**Uyên:** Cảm ơn bạn. Từ hồi công ty cũ đóng cửa sau một đêm, mình quen làm một mình. Có người soát lại, hóa ra nhẹ hơn nhiều.

*Nếu chọn "Sửa đúng dòng đó thôi, gần đúng là được rồi":*

Mọi người về lúc gần nửa đêm. Uyên vẫn nhìn cái bảng, nhưng không nói gì thêm. Ai cũng mệt rồi.

### ch5-choose-way

*tháng 7, tuần 2 · bàn làm việc*

*Nếu quyết định hành động:*

Thư mục "Của mình" đã dày lên từ cái đêm bạn thôi đợi.

*Các nhánh trên gặp lại ở đây:*

Trong tay bạn là những gì đã giữ được. Giờ phải chọn cách mở lời với công ty.

**Bạn:** Làm thế nào đây?

- ▸ Gửi email đòi quyền lợi, lưu làm bằng chứng nếu phải khởi kiện *(hiểu quyền lợi +15; đã gửi email đòi quyền lợi; có giấy tờ "Email đòi quyền lợi"; quan hệ Chị HR -10; quan hệ Phó GĐ Jeon Gwang-hoe -10; căng thẳng +6)* — *cần: số giấy tờ từ 3*
- ▸ Đi hỏi người có chuyên môn trước đã *(hiểu quyền lợi +15; đã hỏi người có chuyên môn; mất 500.000 đ)* — *cần: tiền trong ví từ 500000*
- ▸ Nói chuyện riêng với HR thêm lần nữa *(chọn nói chuyện riêng với HR; quan hệ Chị HR +4)*

*Nếu chọn "Gửi email đòi quyền lợi, lưu làm bằng chứng nếu phải khởi kiện":*

Bạn gửi email lúc 9 giờ đúng, nêu rõ từng khoản bị nợ, kèm tệp đính kèm, có yêu cầu xác nhận đã đọc. Bạn lưu lại bản gửi đi: công ty trả lời hay không, đây cũng là bằng chứng bạn đã đòi. Tay bạn hơi run. Nhưng không phải vì sợ.

*Nếu chọn "Đi hỏi người có chuyên môn trước đã":*

Người ta nghe bạn trình bày, xem qua giấy tờ, rồi hỏi: "Bạn có lưu lại không?". Đó là câu hỏi đúng nhất bạn được nghe trong bảy tháng. Người ta cũng nói thẳng: hồ sơ này còn thiếu, thiếu thì khó đi xa.

*Nếu chọn "Nói chuyện riêng với HR thêm lần nữa":*

**Chị HR:** Chị hiểu mà em. Chị sẽ ghi nhận ý kiến của em, nhưng chị không xác nhận được ngày nào nếu bên trên chưa có thông báo. Em đừng làm căng, ảnh hưởng tới lộ trình của em lắm.

### ch5-company-reply

*tháng 7, tuần 3 · phòng họp*

Chị HR mời bạn vào phòng họp nhỏ. Lần này trên bàn có nước. Bạn biết ngay là chuyện nghiêm trọng.

*Nếu hỏi HR trong nhóm chung:*

**Chị HR:** Chị vẫn nhớ câu em hỏi hôm lương trễ lần đầu: "Cố gắng có chuyển khoản được không". Bên chị có người chụp lại, gửi nhau cười. Giờ không ai cười nữa.

*Nếu nhắn riêng HR:*

**Chị HR:** Hôm lương trễ lần đầu em nhắn riêng chị, lịch sự lắm. Chị bảo em đừng chia sẻ ra ngoài, em cũng nghe. Giờ em ngồi đây thì chị hiểu mọi chuyện đã khác.

*Nếu im lặng ngày lương đầu tiên bị lỡ:*

Hôm lương trễ lần đầu bạn gõ "dạ vâng ạ" rồi xóa đi. Hơn bốn tháng sau bạn ngồi đối diện chị HR, và lần này bạn sẽ nói.

*Các nhánh trên gặp lại ở đây:*

**Chị HR:** Mọi người có thể cho công ty thêm một chút thời gian không em?

**Bạn:** Bọn em đã cho công ty mượn năm kỳ lương rồi chị.

**Chị HR:** Sự đồng hành đó công ty rất trân trọng ạ.

**Chị HR:** À, chị hỏi riêng em câu này, không ghi biên bản gì đâu. Cái bảng đối chiếu mọi người đang chuyền tay nhau ấy, ai đứng ra lập vậy em?

- ▸ Nêu tên: "Dạ... chắc là Uyên ạ" *(đã nêu tên Uyên với chị HR; quan hệ Chị HR +4; quan hệ Phó GĐ Jeon Gwang-hoe +6; căng thẳng +6)*
- ▸ Lảng đi: "Dạ em không rõ ạ"
- ▸ Nhận luôn: "Bọn em cùng làm, có phần của em trong đó" *(đã nhận có phần trong bảng đối chiếu; quan hệ Uyên +10; quan hệ Chị HR -6; quan hệ Phó GĐ Jeon Gwang-hoe -8; hiểu quyền lợi +4; căng thẳng +4)* — *cần: vào nhóm so số liệu*

*Nếu chọn "Nêu tên: Dạ... chắc là Uyên ạ":*

Cái tên ra khỏi miệng bạn nhẹ hơn bạn tưởng. Chị HR không ghi gì, đúng như đã nói. Chị chỉ gật đầu, rồi rót thêm nước cho bạn.

*Nếu chọn "Lảng đi: Dạ em không rõ ạ":*

**Chị HR:** Ừ, chị hỏi vậy thôi. Em uống nước đi.

*Nếu chọn "Nhận luôn: Bọn em cùng làm, có phần của em trong đó":*

**Bạn:** Mỗi dòng trong bảng đều có nguồn. Chị cần dòng nào em gửi dòng đó ạ.

Chị HR nhìn bạn một lúc, rồi gập sổ lại. Lần đầu tiên trong buổi sáng, chị không có câu nào để nói.

**Cô Kế toán:** Khoản của em bên cô ghi là "đang chờ đối soát". Hỏi đối soát với ai thì cô không biết, trên hệ thống chỉ có mỗi dòng đó.

*Nếu quan hệ với Cô Kế toán từ 5:*

Đợi chị HR ra ngoài, cô Kế toán đẩy sang một tờ giấy gập đôi: phiếu lương những tháng bạn chưa bao giờ nhận được. "Cô chỉ nhập số. Mà số của em thì em có quyền xem." *(được cô Kế toán đưa phiếu lương; có giấy tờ "Phiếu lương bị thiếu")*

*Các nhánh trên gặp lại ở đây:*

Trong một buổi sáng, bạn nhận được ba lời giải thích khác nhau: hệ thống, dòng tiền, và "vấn đề mang tính thời điểm".

*Các nhánh trên gặp lại ở đây:*

*Nếu bảng của nhóm còn lỗi:*

**Cô Kế toán:** À, có người báo với cô là bảng của nhóm em có một dòng sai. Bên trên nghe được rồi, nên giờ bên trên bảo cả bảng không đáng tin. *(căng thẳng +6)*

*Nếu đã gửi email đòi quyền lợi:*

Bức email hôm trước có hồi âm, đúng một dòng: "Công ty đã tiếp nhận". Tiếp nhận chứ chưa phải xác nhận số tiền. Bạn vẫn lưu nó cùng thư mục. Một dòng thôi, nhưng có ngày, có người gửi.

*Nếu không:*

Bạn về chỗ, nhìn ba lời giải thích, và nghĩ tới những thứ mà mình chưa có trên giấy.

### ch5-closed-door

*tháng 7, tuần 3 · hành lang, pantry*

Tối muộn, bạn quay lại lấy sạc điện thoại. Phòng họp nhỏ còn sáng đèn, cửa chưa đóng hẳn.

**Phó GĐ Jeon Gwang-hoe:** Nhóm đó đang làm gì?

*Nếu đã nêu tên Uyên với chị HR:*

**Chị HR:** Bạn Uyên đứng ra lập bảng anh ạ. Họ chỉ đối chiếu số liệu thôi.

Bạn đứng im ngoài cửa. Cái tên đó sáng nay đi từ miệng bạn lên tới đây, nhanh hơn mọi kỳ lương.

*Nếu đã nhận có phần trong bảng đối chiếu:*

**Chị HR:** Họ chỉ đối chiếu số liệu thôi anh. Em hỏi rồi, mỗi dòng đều có nguồn.

*Nếu không:*

**Chị HR:** Họ chỉ đối chiếu số liệu thôi anh.

**Phó GĐ Jeon Gwang-hoe:** Tôi không muốn tuần sau lại có thêm một người gửi email nữa.

*Nếu đã gửi email đòi quyền lợi:*

Bạn đứng im. "Một người gửi email" đó là bạn.

*Các nhánh trên gặp lại ở đây:*

Lần đầu tiên, trong giọng của anh có thứ mà bạn chưa nghe bao giờ. Không phải tầm nhìn. Là lo lắng. Nhân viên không còn chỉ ngồi đợi nữa, và họ biết điều đó.

- ▸ Lấy sạc rồi đi về, không muốn dính vào
- ▸ Về nhắn Uyên: bên trên đã để ý rồi *(quan hệ Uyên +6; căng thẳng +3)*
- ▸ Đẩy cửa bước vào, đề nghị một buổi đối thoại chính thức *(đã đề nghị đối thoại chính thức; quan hệ Phó GĐ Jeon Gwang-hoe -10; căng thẳng +5; hiểu quyền lợi +6)*

*Nếu chọn "Lấy sạc rồi đi về, không muốn dính vào":*

Thang máy xuống rất chậm. Bạn tự nhủ mình chưa nghe thấy gì cả.

*Nếu chọn "Về nhắn Uyên: bên trên đã để ý rồi":*

**Uyên:** Cảm ơn bạn. Chuyện nghe được chỉ để mình hiểu tình hình thôi, đừng đưa vào bảng. Cái gì của mình thì mình giữ, có gì sai đâu mà sợ.

*Nếu chọn "Đẩy cửa bước vào, đề nghị một buổi đối thoại chính thức":*

Hai người nhìn bạn. Chị HR đóng laptop lại. Phó giám đốc cười, nụ cười của những buổi họp toàn công ty: "Được. Tuần sau em vào gặp anh."

### ch5-offer

*tháng 7, tuần 4 · phòng họp*

*Nếu đã đề nghị đối thoại chính thức:*

**Phó GĐ Jeon Gwang-hoe:** Em muốn đối thoại đúng không? Đây, anh đối thoại.

*Các nhánh trên gặp lại ở đây:*

**Phó GĐ Jeon Gwang-hoe:** Em ngồi đi, em... Thôi không sao, anh nhớ mặt. Anh để ý em lâu rồi.

*Nếu chọn nói chuyện riêng với HR HOẶC đã nêu tên Uyên với chị HR:*

**Phó GĐ Jeon Gwang-hoe:** Chị HR bảo em là người biết điều, không làm căng. Công ty đang cần những người như vậy.

*Nếu vỗ tay to nhất:*

**Phó GĐ Jeon Gwang-hoe:** Hôm họp đầu năm, giữa cả phòng im lặng, em vỗ tay to nhất. Anh không quên đâu.

*Các nhánh trên gặp lại ở đây:*

**Phó GĐ Jeon Gwang-hoe:** Cả công ty có mấy người dám hỏi lương ngay trước mặt anh, em là một. Người như em đứng về phía anh thì anh em mới nghe.

*Các nhánh trên gặp lại ở đây:*

**Phó GĐ Jeon Gwang-hoe:** Anh muốn em làm Trưởng nhóm, báo cáo thẳng cho anh. Danh thiếp mới, ghế mới, một vị trí trong chương trình lãnh đạo tương lai. Quyền hạn cụ thể anh thông báo sau.

**Bạn:** Dạ... lương thì sao anh?

**Phó GĐ Jeon Gwang-hoe:** Lương là một phần của bức tranh lớn. Anh chỉ cần em giúp anh ổn định anh em, đừng để nhóm kia làm rối. Em hiểu ý anh chứ?

- ▸ Nhận chức, biết đâu đây là cơ hội *(nhận chức Trưởng nhóm; không còn: vào nhóm so số liệu; quan hệ Phó GĐ Jeon Gwang-hoe +25; quan hệ Uyên -30)*
- ▸ Ra điều kiện: trả hết phần đã nợ, em sẽ nhận *(đã ra điều kiện đòi trả nợ; quan hệ Phó GĐ Jeon Gwang-hoe -6; hiểu quyền lợi +5)* — *cần: hiểu quyền lợi từ 50*
- ▸ Từ chối: "Dạ em chỉ cần phần đã làm" *(quan hệ Phó GĐ Jeon Gwang-hoe -15; quan hệ Uyên +8; căng thẳng +4)*

*Nếu chọn "Ra điều kiện: trả hết phần đã nợ, em sẽ nhận":*

**Phó GĐ Jeon Gwang-hoe:** Em đang đàm phán với anh đấy à? Hay lắm. Lâu rồi mới có người làm thế. Nhưng chuyện đó thì next week mình nói tiếp.

*Nếu chọn "Nhận chức, biết đâu đây là cơ hội":*

Ngày mai bạn có ba mươi tấm danh thiếp mới in rất đẹp. Bạn không gửi tấm nào. Uyên nhìn tấm danh thiếp trên bàn bạn, rồi nhìn đi chỗ khác. Từ hôm đó cô không nhắn gì cho bạn nữa.

*Nếu chọn "Từ chối: Dạ em chỉ cần phần đã làm":*

**Phó GĐ Jeon Gwang-hoe:** Em còn trẻ. Rồi em sẽ hiểu tầm nhìn là gì.

*Nếu không:*

**Anh Roger:** Anh biết em lo. Luật với giấy tờ anh không giỏi, nhưng anh vẫn tin Chủ tịch. Em đừng nghe nhóm kia, cũng đừng vội đi, rồi cả phòng mình cùng hưởng.

*Nếu anh Roger bắt đầu nghi ngờ:*

**Anh Roger:** Anh muốn tin là tiền sẽ về. Nhưng anh không dám hứa thay cho ai nữa. Anh chỉ mong em đừng nghĩ tám năm anh ở đây là vô nghĩa.

*Nếu quan hệ với Anh Huấn từ 8:*

**Anh Huấn:** Anh Roger tin thật lòng đấy, em đừng giận anh ấy. Còn em làm gì là quyền của em. Cần xác nhận em đã đi làm những tháng nào, anh ký cho. *(có giấy tờ "Bảng chấm công")*

*Nếu không:*

Anh Huấn đi ngang, không nói gì, chỉ khẽ gật đầu với bạn. Từ anh ấy, thế là đã nhiều.

### ch5-payday

*ngày lương tháng 7 (mùng 5 tháng 8) · nhà riêng*

Ngày lương thứ bảy. Bạn không còn đặt điện thoại ngửa mặt lên bàn nữa.

*Nếu nhận chức Trưởng nhóm:*

Ting. 5.000.000 đ, nội dung "HO TRO TRUONG NHOM". Vẫn là một phần ba tháng lương, chỉ là giờ nó có tên khác. Phần còn lại được nợ tiếp. *(công ty trả 5.000.000 đ)*

*Nếu đã ra điều kiện đòi trả nợ:*

Ting. 5.000.000 đ, đúng tuần sau hôm bạn ra điều kiện. Không ai giải thích gì. Nó chỉ là một phần ba tháng lương, nhưng bạn biết vì sao mình có nó. *(công ty trả 5.000.000 đ)*

*Nếu vào nhóm Vượt thác:*

Ting. 5.000.000 đ, lại một phần ba tháng lương, đúng tuần mọi người bắt đầu đòi giấy tờ. Phần còn lại được nợ tiếp. *(công ty trả 5.000.000 đ)*

*Nếu không:*

Trong nhóm chat có người nói vừa được một phần ba tháng lương. Bạn thì không. Bạn không còn ngạc nhiên nữa.

*Nếu vay trên điện thoại:*

Ứng dụng vay nhắn tin đúng 10 giờ 41 phút. Trong đời bạn vẫn còn một bên không bao giờ trễ hẹn.

*Các nhánh trên gặp lại ở đây:*

Mẹ gọi hỏi tháng này có về không, rồi hỏi: "Công ty tốt không con?".

**Bạn:** Trả lời mẹ thế nào đây?

- ▸ "Dạ, công ty đang vào giai đoạn quan trọng ạ" *(căng thẳng +2)*
- ▸ Kể thật: công ty đã nợ lương con nhiều tháng rồi *(đã kể thật với mẹ; căng thẳng -8)*

*Nếu chọn "Dạ, công ty đang vào giai đoạn quan trọng ạ":*

Câu đó bạn học ở đâu, bạn biết rõ.

*Nếu chọn "Kể thật: công ty đã nợ lương con nhiều tháng rồi":*

Bạn kể hết. Đầu dây bên kia im một lúc lâu. Rồi mẹ hỏi: "Thế con có ăn uống đủ không?". Bạn đã chuẩn bị câu trả lời cho mọi câu hỏi, trừ câu đó.

*Nếu gửi tiền về cho mẹ:*

Sáng hôm sau, ting. 2.000.000 đ, nội dung "ME GUI LAI. AN UONG DAY DU NHA CON". Đúng hai triệu tháng đầu bạn gửi về. Mẹ chưa tiêu đồng nào. *(có thêm 2.000.000 đ)*

*Nếu vay tiền mẹ:*

Ba triệu hôm đó mẹ không nhắc tới, một lần cũng không. Chính vì vậy mà bạn ngại nghe máy.

*Nếu gửi tiền về cho mẹ:*

Trước khi cúp máy, mẹ bảo hai triệu tháng đầu bạn gửi về vẫn để nguyên: "Khi nào con cần thì nói". Bạn chưa dám nói.

*Các nhánh trên gặp lại ở đây:*

Cúp máy rồi, bạn ngồi yên thêm một lúc.

## Chương 6 — The Last Day (tháng 8)

Văn phòng vắng đi một nửa, tường ảnh tập thể không còn đủ người. Chủ tịch lần đầu đến tận nơi để nói chuyện với nhân viên. Người chơi đưa ra quyết định cuối, và mỗi kết thúc có thêm đoạn "Một năm sau".

### ch6-empty-office

*tháng 8, tuần 1 · văn phòng*

Sáng thứ Hai, bạn đến sớm hơn mọi ngày. Những chiếc ghế trước đây luôn có người ngồi giờ đã được xếp ngay ngắn.

*Nếu Khoa đã nói lời tạm biệt:*

Bàn của Khoa trống, lau sạch, như chưa từng có ai ngồi.

*Nếu không:*

Bàn của Khoa trống. Cái phích vẫn ở đó từ tháng 5. Không ai biết nên trả nó cho ai, cũng không ai muốn là người mang nó đi.

Bạn nhìn lên tường ảnh tập thể. Hôm đầu tiên tới đây, bạn thấy trên đó hơn một trăm gương mặt đang cười. Giờ bạn thử đếm những người còn ở lại, và dừng đếm khá sớm.

**Dân:** Ông còn nhớ không? Từ hồi ông mới vào, tôi đã bảo công ty sắp gọi vốn. Câu đó chắc tôi nói hơn trăm lần rồi. Giờ tôi không biết nữa, nhưng tiền của tôi thì vẫn chưa về.

*Nếu đã mời cả nhóm ăn trưa:*

Dân giơ điện thoại, tấm ảnh cũ ở quán cơm tấm hôm bạn mời cả nhóm. Trong ảnh có bốn người. Bây giờ còn ba.

*Các nhánh trên gặp lại ở đây:*

*Nếu đã cho Khoa mượn tiền:*

Ting. Tim bạn đập một nhịp. 1.000.000 đ, nội dung: "KHOA TRA BAN. TUAN SAU CHAC CHAN LUON". Đó là lời hứa "tuần sau" duy nhất ở đây được giữ. *(có thêm 1.000.000 đ)*

*Các nhánh trên gặp lại ở đây:*

*Nếu vào nhóm Vượt thác:*

Nhóm Vượt thác còn năm người. Họp 7 giờ sáng vẫn họp, chủ yếu để điểm danh nhau.

*Các nhánh trên gặp lại ở đây:*

*Nếu khủng hoảng "burnout" từ 1 lần:*

Trên bàn bạn có một hộp sữa, không ghi tên. Từ hôm bạn nằm nhà cả tuần, thỉnh thoảng lại có một hộp như vậy.

*Các nhánh trên gặp lại ở đây:*

*Nếu đã nêu tên Uyên với chị HR:*

**Uyên:** Mấy hôm trước mình bị gọi lên phòng họp nhỏ, người ta gọi đúng tên mình. Mình biết ai đã nói rồi. Mình không hỏi đâu. Từ hôm nay hồ sơ của nhóm không để chỗ cũ nữa. *(không còn: vào nhóm so số liệu; quan hệ Uyên -20)*

*Nếu đã nhận có phần trong bảng đối chiếu:*

**Uyên:** Câu bạn nói với chị HR tới tai nhóm mình rồi: "mỗi dòng đều có nguồn". Từ hôm đó không ai phải hỏi bạn đứng về phía nào nữa. Đây, mình gom hết thông báo của HR theo ngày, bạn giữ một bản. *(có giấy tờ "Các thông báo của HR")*

*Các nhánh trên gặp lại ở đây:*

**Uyên:** Mình lưu hết rồi. Hợp đồng, bảng công, email, sao kê. Còn lại là việc của mỗi người.

**Anh Huấn:** Hôm nay Chủ tịch tới. Mấy năm rồi ông ấy chưa lên tận tầng này, chắc email gửi lên nhiều quá. Anh nghĩ đến lúc mọi người phải tự quyết định rồi. Anh cũng vậy.

### ch6-last-day

*tháng 8, tuần 1 · văn phòng*

Chín giờ. Có người đang lau lại dòng chữ inox ở sảnh, dù nó đã rơi mất hai ký tự. Cái bức tường cây thì đã thành bức tường.

Giữa buổi sáng, cả tầng được gọi ra giữa phòng. Một người tóc bạc bước vào, sau lưng là hai trợ lý. Lần đầu tiên bạn thấy Chủ tịch ngoài màn hình.

**Chủ tịch Jeon Kim-jung:** Văn phòng đẹp. Công ty này... làm về mảng nào nhỉ? Thôi không sao. Hôm nay tôi đến để trò chuyện với các em như người trong nhà.

**Chủ tịch Jeon Kim-jung:** Người ta hay hỏi tôi bí quyết thành công. Là đừng hỏi lương. Người làm việc lớn không đếm tháng. Các em không phải đang bị nợ, các em đang đầu tư vào chính mình.

**Chủ tịch Jeon Kim-jung:** Ai còn nghĩ tới tiền là chưa hiểu công ty. Ai hiểu công ty rồi thì tiền sẽ tự đến, hoặc không cần đến nữa. Các em nhắc lại với tôi nào: "Tôi đang đầu tư vào chính mình".

*Nếu anh Roger bắt đầu nghi ngờ:*

Vài chục người nhắc theo, nhỏ dần. Anh Roger đứng ngay hàng đầu. Lần đầu tiên trong tám năm, anh không nhắc lại. Chủ tịch nhìn anh một giây, rồi nhìn thẳng về phía bạn.

*Nếu không:*

Anh Roger nhắc lại to nhất. Vài chục người nhắc theo, nhỏ dần. Chủ tịch gật đầu, rồi nhìn thẳng về phía bạn.

**Bạn:** Cả phòng đang nhìn mình.

- ▸ Lẩm nhẩm nhắc theo cho xong *(quan hệ Anh Roger +3)*
- ▸ Giơ tay: "Dạ thưa Chủ tịch, bao giờ công ty trả lương ạ?" *(hỏi Chủ tịch bao giờ trả lương; căng thẳng +6; quan hệ Anh Huấn +5; quan hệ Uyên +5)*
- ▸ Ghi lại nguyên văn vào sổ *(có giấy tờ "Sổ ghi lời hứa")* — *cần: bắt đầu ghi chép (mở "Lưu giấy tờ")*

*Nếu chọn "Lẩm nhẩm nhắc theo cho xong":*

Bạn nghe giọng mình nói câu đó. Nó nhỏ, nhưng là giọng của bạn. Cảm giác đó ở lại lâu hơn bạn tưởng.

*Nếu chọn "Giơ tay: Dạ thưa Chủ tịch, bao giờ công ty trả lương ạ?":*

**Chủ tịch Jeon Kim-jung:** Em còn trẻ. Đó là câu hỏi của người làm thuê. Hãy hỏi mình đã cống hiến được gì cho công ty.

Một trợ lý cúi xuống ghi gì đó vào điện thoại. Chủ tịch không nói thêm. Những người đang nhìn bạn bắt đầu nhìn xuống sàn, nhưng từ lúc đó không ai nhắc lại câu kia nữa.

*Nếu chọn "Ghi lại nguyên văn vào sổ":*

Bạn viết: "Đừng hỏi lương". Ghi ngày, ghi giờ, ghi tên người nói. Hai trợ lý nhìn cây bút của bạn và không biết phải làm gì với nó.

*Nếu anh Roger bắt đầu nghi ngờ:*

**Anh Roger:** Ông ấy không biết công ty này làm gì. Tám năm, em ạ. Ông ấy không biết.

*Nếu không:*

**Anh Roger:** Các em thấy chưa? Chủ tịch đích thân đến trò chuyện với mình. Chừng đó là đủ rồi.

Anh Huấn nhìn theo cánh cửa thang máy đang đóng, rồi quay lại nhìn bạn. Anh không nói gì. Có những câu không cần nói.

**Phó GĐ Jeon Gwang-hoe:** Em vào anh bảo. Next week thôi, 1–2 triệu đô đang về, IPO cũng sắp rồi. Chúng ta còn nhiều dự án lớn lắm.

**Chị HR:** Cả nhà ký giúp chị Bản cam kết đồng hành trước 5 giờ chiều nay nhé. Khoản lương cũ được chuyển tiếp sang kỳ phát triển mới, ai ký là người nhà của công ty.

*Nếu quan hệ với Chị HR từ 2:*

**Chị HR:** Em đọc kỹ rồi hẵng ký nhé. Chị nói với tư cách người cũng chưa có lương.

*Nếu quan hệ với Chị HR tới -10:*

Chị HR đặt tờ giấy lên bàn bạn, không nhìn bạn, rồi đi thẳng. Cả năm nay chị chưa từng im lặng lâu như vậy.

*Các nhánh trên gặp lại ở đây:*

*Nếu đã hỏi người có chuyên môn:*

Bạn nhớ câu hỏi của người tư vấn: "Bạn có lưu lại không?". Bạn chụp lại tờ cam kết trước khi làm bất cứ điều gì.

*Các nhánh trên gặp lại ở đây:*

Bạn đọc tờ cam kết một lượt. Không có ngày thanh toán. Không có số tiền. Chỉ có chỗ ký tên.

*Nếu số giấy tờ từ 3 HOẶC vào nhóm so số liệu:*

**Phó GĐ Jeon Gwang-hoe:** Khoan ký đã, em vào đây anh nói riêng. Anh biết em đang giữ những gì, anh không trách. Chiều nay anh chuyển riêng cho em 15 triệu, tiền tươi, không phải next week.

Anh đẩy sang một tờ khác, ngắn hơn: "Người lao động xác nhận đã nhận đủ các khoản lương còn nợ và không khiếu nại về sau". Mười lăm triệu, đổi lấy chữ "đủ".

- ▸ Ký. Tiền trong tay chắc hơn một tập giấy *(đã ký tờ "không khiếu nại"; công ty trả 15.000.000 đ; quan hệ Phó GĐ Jeon Gwang-hoe +10)*
- ▸ Đẩy lại: "Em chưa nhận đủ, nên em không ký được ạ" *(quan hệ Phó GĐ Jeon Gwang-hoe -8; căng thẳng +3)*
- ▸ Chụp lại tờ giấy trước, rồi mới trả lời *(đã chụp lại tờ "không khiếu nại"; có giấy tờ "Tờ "không khiếu nại""; quan hệ Phó GĐ Jeon Gwang-hoe -12; hiểu quyền lợi +4)* — *cần: hiểu quyền lợi từ 50 HOẶC đã hỏi người có chuyên môn*

*Nếu chọn "Ký. Tiền trong tay chắc hơn một tập giấy":*

Ting. 15.000.000 đ, nội dung "HO TRO CA NHAN". Lần đầu tiên công ty trả đúng giờ đã hẹn. Trên sổ vẫn còn một con số, nhưng theo tờ giấy bạn vừa ký thì con số đó không còn là của bạn.

*Nếu vào nhóm so số liệu:*

Bạn nhắn vào nhóm xin rút tên. Uyên trả lời đúng một chữ: "Ok". Một lát sau, dòng có tên bạn biến mất khỏi bảng đối chiếu. *(không còn: vào nhóm so số liệu; quan hệ Uyên -25)*

*Nếu chọn "Đẩy lại: Em chưa nhận đủ, nên em không ký được ạ":*

**Phó GĐ Jeon Gwang-hoe:** Anh cho em cơ hội rồi đấy nhé. Cơ hội này không có next week đâu.

*Nếu chọn "Chụp lại tờ giấy trước, rồi mới trả lời":*

Bạn giơ điện thoại lên, chụp một tấm. Anh khựng lại nửa giây. Tờ giấy ghi rõ "các khoản lương còn nợ": muốn bạn im lặng thì trước hết công ty phải viết ra là có nợ. Đó là lần đầu tiên bạn thấy câu đó trên giấy của công ty.

*Các nhánh trên gặp lại ở đây:*

*Nếu đã kể thật với mẹ:*

Điện thoại rung trong túi. Mẹ nhắn: "Làm gì thì làm, nhớ ăn sáng nha con". Mẹ không biết hôm nay là ngày gì. Nhưng bạn thấy nhẹ đi một chút. *(căng thẳng -4)*

*Các nhánh trên gặp lại ở đây:*

**Phó GĐ Jeon Gwang-hoe:** Em nghĩ kỹ chưa?

*Nếu đã ký tờ "không khiếu nại":*

**Bạn:** Tờ giấy kia đã ký rồi. Giờ chỉ còn chuyện ở lại hay đi.

- ▸ Cầm tiền, rời công ty và bắt đầu lại *(chọn rời đi; kết thúc lượt chơi)*
- ▸ Ký nốt bản cam kết, ở lại *(ký cam kết ở lại; kết thúc lượt chơi)*

*Nếu không:*

**Bạn:** Hôm nay là ngày phải có câu trả lời.

- ▸ Theo đuổi quyền lợi của mình đến cùng *(chọn theo đuổi quyền lợi; kết thúc lượt chơi)* — *cần: số giấy tờ từ 3 HOẶC vào nhóm so số liệu*
- ▸ Rời công ty và bắt đầu lại *(chọn rời đi; kết thúc lượt chơi)*
- ▸ Ký bản cam kết, cho công ty thêm một cơ hội *(ký cam kết ở lại; kết thúc lượt chơi)*

*Nếu chọn "Theo đuổi quyền lợi của mình đến cùng":*

**Bạn:** Em cũng có nhiều hóa đơn lớn cần thanh toán, anh ạ.

*Các nhánh trên gặp lại ở đây:*

**Bạn:** Em xin phép dừng ở đây. Em đặt thẻ nhân viên lên bàn nhé.

*Các nhánh trên gặp lại ở đây:*

*Nếu hiểu quyền lợi từ 50:*

**Bạn:** Em biết tờ này không có ngày nào cả. Em vẫn ký. Em chưa đủ sức đi lúc này.

*Nếu không:*

**Bạn:** Dạ. Em ký ạ. Em sẽ cố gắng thêm.

## Khủng hoảng

Xảy ra bất cứ lúc nào điều kiện đúng, tối đa một lần mỗi tháng.

*Điều kiện: hóa đơn chưa trả được (đồng) từ 1*

### crisis-broke

*nhà riêng*

Ví không còn đủ trả hết hóa đơn. Chủ nhà nhắn tin rất lịch sự, kiểu lịch sự làm người ta mất ngủ. *(căng thẳng +6)*

**Bạn:** Phải làm gì đó ngay trong tuần này.

- ▸ Vay bạn thân 5 triệu *(vay 5.000.000 đ; dùng tiền có được trả hóa đơn, thiếu thì nợ tiếp; căng thẳng +4)*
- ▸ Bán chiếc máy ảnh cũ *(đã bán máy ảnh; có thêm 2.500.000 đ; dùng tiền có được trả hóa đơn, thiếu thì nợ tiếp; căng thẳng +2)* — *cần: chưa bán máy ảnh*
- ▸ Gọi về nhà *(vay 3.000.000 đ; dùng tiền có được trả hóa đơn, thiếu thì nợ tiếp; căng thẳng +8; vay tiền mẹ)*
- ▸ Vay tiêu dùng trên điện thoại, không cần hỏi ai *(vay 8.000.000 đ; dùng tiền có được trả hóa đơn, thiếu thì nợ tiếp; căng thẳng +10; vay trên điện thoại)*
- ▸ Đủ rồi. Nghỉ việc, về quê làm lại từ đầu *(nghỉ sớm; kết thúc lượt chơi)* — *cần: khủng hoảng "broke" từ 3 lần*

*Nếu chọn "Vay bạn thân 5 triệu":*

Bạn thân chuyển ngay, không hỏi gì. Tiếng "ting" đúng lúc nhất trong nhiều tháng, và nó đến từ người cũng đang đi làm thuê.

*Nếu chọn "Bán chiếc máy ảnh cũ":*

Người mua trả tiền đúng hẹn. Bạn đứng nhìn cái túi đựng máy ảnh rỗng một lúc. Đó là khoản thu đúng hạn duy nhất của tháng.

*Nếu chọn "Gọi về nhà":*

Mẹ không hỏi nhiều, chỉ bảo "có gì về nhà ăn cơm". Bạn nói "dạ" rồi nhìn trần nhà một lúc lâu.

*Nếu chọn "Vay tiêu dùng trên điện thoại, không cần hỏi ai":*

Tiền về sau bốn phút, nhanh hơn mọi lời hứa của công ty. Dòng lãi suất viết rất nhỏ, tính theo ngày. Bạn đọc rồi, và vẫn bấm "Đồng ý".

*Nếu chọn "Đủ rồi. Nghỉ việc, về quê làm lại từ đầu":*

**Bạn:** Đủ rồi. Mình không thể tiếp tục trả tiền để được đi làm nữa.

*Điều kiện: sức khỏe không quá 0 HOẶC căng thẳng từ 100*

### crisis-burnout

*nhà riêng*

Sáng nay bạn mở mắt, nhìn đồng hồ, và cơ thể đơn giản là không nhận lệnh.

Bạn nằm cả ngày. Rồi hai ngày. Điện thoại có 47 tin nhắn, một nửa bắt đầu bằng "em ơi". *(mất một tuần; sức khỏe +45; căng thẳng -25)*

Hết tuần bạn dậy được, thấy mình như một tài liệu chưa lưu. Không ai trong công ty hỏi vì sao. KPI thì có.

## Sáu kết thúc

Game xét từ trên xuống, gặp điều kiện đầu tiên đúng thì dừng.

### Kết thúc 1: The Good Ending

Các khoản quyền lợi được giải quyết, và bạn bước sang chương mới.

- **Điều kiện:** chọn theo đuổi quyền lợi VÀ số giấy tờ từ 5 VÀ vào nhóm so số liệu VÀ đã gửi email đòi quyền lợi
- **Gợi ý hiện cho người chơi khi chưa mở:** Đủ giấy tờ, có người đi cùng, và đã gửi yêu cầu chính thức.

#### ending-good

*nhà riêng*

Ba tháng sau. Hồ sơ của nhóm rõ ràng tới mức công ty không còn câu "đang cố gắng" nào để nói. Từng khoản được chốt, có ngày, có chữ ký.

*Nếu có "Tờ "không khiếu nại"":*

Trên cùng tập hồ sơ là tờ "không khiếu nại" công ty từng đưa bạn. Muốn mua im lặng thì phải viết ra là có nợ, và công ty đã viết.

*Các nhánh trên gặp lại ở đây:*

Ting. Lần này bạn không reo lên, dù cả phần KPI bị giữ cũng đã về. Bạn chỉ ngồi yên một lúc. *(công ty trả hết phần còn nợ theo sổ lương)*

*Nếu đã kể thật với mẹ:*

Rồi bạn gọi về nhà. Mẹ đã biết đầu đuôi từ tháng 7, nên mẹ chỉ hỏi: "Thế tháng này có về ăn cơm không?". Lần này bạn trả lời được.

*Nếu tiền đang vay từ 1:*

Rồi bạn trả nốt tiền cho những người đã cho bạn mượn.

*Nếu không:*

Rồi bạn gọi về nhà, và lần này kể thật mọi chuyện.

**Uyên:** Xong rồi. Mình xóa file được chưa? Thôi, để lại. Mình quen tay rồi.

Bạn bắt đầu một công việc mới. Hôm ký hợp đồng, bạn đọc hết, kể cả trang cỡ chữ 6.

Một năm sau. Một bạn mới vào hỏi bạn nên đọc gì trước khi ký. Bạn trả lời: trang 14. Bạn không còn tin mù quáng vào ai, nhưng lạ thay, bạn cũng không thấy mình cay đắng.

*Nếu Khoa đã nói lời tạm biệt:*

Khoa gửi ảnh quán cà phê nhỏ ở quê, mới khai trương. Cái phích công ty tặng để trên quầy. Lần này Khoa cười, cả mắt cũng cười.

*Các nhánh trên gặp lại ở đây:*

Ngày mùng 5, điện thoại kêu ting. Bạn vẫn dừng lại một giây, như mọi lần. Có những thứ trả rồi vẫn còn nhớ.

### Kết thúc 2: The Collective

Không ai đi một mình, và không ai là trường hợp đặc biệt nữa.

- **Điều kiện:** chọn theo đuổi quyền lợi VÀ vào nhóm so số liệu
- **Gợi ý hiện cho người chơi khi chưa mở:** Có một nhóm cùng đi, dù giấy tờ chưa đủ.

#### ending-collective

*hành lang, pantry*

Giấy tờ không đủ cho mọi khoản, nhưng hai mươi ba người cùng ngồi trong một phòng thì khó giả vờ là không thấy.

Công ty chốt lộ trình trả dần cho cả nhóm. Không trọn vẹn, nhưng có văn bản, và lần này là chung một văn bản. Đợt đầu của riêng bạn là 30 triệu. *(công ty trả 30.000.000 đ)*

Anh Huấn ký tên đầu tiên trong danh sách. Anh vẫn nói mình yêu công ty này, và chính vì thế anh muốn nó trả lương.

*Nếu hỏi Chủ tịch bao giờ trả lương:*

Trang đầu tập hồ sơ, Uyên in đúng một câu: "Dạ thưa Chủ tịch, bao giờ công ty trả lương ạ?". Bên dưới là ngày giờ, và tên bạn.

*Các nhánh trên gặp lại ở đây:*

**Uyên:** Không ai trong chúng ta là trường hợp đặc biệt. Đó là điều mình mừng nhất.

*Nếu anh Roger bắt đầu nghi ngờ:*

Hôm cuối, anh Roger đến trễ, không nói gì, ký vào dòng cuối của danh sách. Anh xin lỗi từng người anh đã giới thiệu vào công ty, từng người một. Có người gật đầu. Có người không nhìn anh. Anh không giải thích thêm.

*Các nhánh trên gặp lại ở đây:*

*Nếu Dân vào nhóm:*

Dân đóng cả ba cửa sổ tin tức. Giờ màn hình chỉ còn một bảng: lịch trả ba cái thẻ tín dụng, ghi nguồn đàng hoàng.

*Các nhánh trên gặp lại ở đây:*

Một năm sau. Nhóm chat vẫn còn, đổi tên thành "Không ai là trường hợp đặc biệt". Khoản trả dần chưa xong, có tháng về trễ. Nhưng tháng nào trễ, cả nhóm biết, và hỏi cùng một lúc.

### Kết thúc 3: The Investigator

Một mình, với một tập giấy tờ có ngày tháng rõ ràng.

- **Điều kiện:** chọn theo đuổi quyền lợi VÀ số giấy tờ từ 5 VÀ chưa vào nhóm so số liệu
- **Gợi ý hiện cho người chơi khi chưa mở:** Đủ giấy tờ và đi tới cùng, không cần ai bên cạnh.

#### ending-investigator

*bàn làm việc*

Bạn đi một mình. Mỗi lần công ty đưa ra một lời giải thích, bạn đặt lên bàn một tờ giấy có ngày tháng.

*Nếu có "Tờ "không khiếu nại"":*

Tờ bạn đặt xuống cuối cùng là tờ "không khiếu nại" chính công ty từng đưa bạn. Người đối diện đọc xong thì không còn lời giải thích nào mới.

*Các nhánh trên gặp lại ở đây:*

Việc đó tốn nhiều tháng và nhiều giấc ngủ, nhưng khoản của bạn cuối cùng cũng được giải quyết. Chỉ khoản của bạn. *(công ty trả hết phần còn nợ theo sổ lương)*

Dân nhắn hỏi bạn đã làm thế nào, lần đầu tiên không kèm tin đồn nào. Bạn gửi lại danh sách những thứ nên giữ. Danh sách đó bắt đầu được chuyền tay.

Một năm sau. Tiền của bạn đã về. Thỉnh thoảng bạn lướt qua nhóm cũ: vẫn những cái tên đó, vẫn câu "tuần sau". Bạn thắng, một mình, và bạn chưa biết phải cảm thấy thế nào về chữ "một mình".

### Kết thúc 4: The Survivor

Bạn rời đi. Tiền không về, nhưng bạn thì đã về.

- **Điều kiện:** chọn rời đi HOẶC nghỉ sớm
- **Gợi ý hiện cho người chơi khi chưa mở:** Biết lúc nào nên dừng lại.

#### ending-survivor

*nhà riêng*

Bạn mang về một thùng giấy, trong đó có một cái áo thun in chữ "gia đình".

*Nếu từ chối lời mời việc của người bạn:*

Bạn nhắn lại người bạn hôm tháng 4. Họ không hỏi gì, chỉ gửi địa chỉ văn phòng.

*Các nhánh trên gặp lại ở đây:*

*Nếu đã ký tờ "không khiếu nại":*

Trên giấy, công ty không còn nợ bạn đồng nào: chữ ký của bạn nằm ngay cạnh chữ "đủ". Bạn tìm được việc mới, lương không cao, nhưng trả đúng ngày mùng 5.

*Nếu không:*

Khoản nợ vẫn nằm đó, một con số bạn học cách không nhìn mỗi sáng. Bạn tìm được việc mới, lương không cao, nhưng trả đúng ngày mùng 5.

Ting. Bạn đứng giữa siêu thị và mỉm cười với một cái điện thoại. Không ai hiểu vì sao.

*Nếu chưa nghe màn 1–2 triệu đô:*

Hai tháng sau, một đồng nghiệp cũ gửi bạn ảnh chụp: công ty họp toàn thể, trên slide chỉ có một dòng "$1–2 TRIỆU".

Rồi Phó giám đốc nhắn: "Nghe nói em đi rồi. Tiếc quá. Tiếc cho em thật sự. Em đi đúng trước đợt anh đào được 1–2 triệu đô, mà sắp IPO rồi, cổ phiếu nội bộ cũng không có phần em."

Bạn đọc tin nhắn trong giờ nghỉ trưa, bên phần cơm mua bằng lương tháng này. Vẫn một khoản tiền chưa có, một đợt gọi vốn chưa xảy ra. Bạn cũng thấy tiếc. Tiếc là đã không đi sớm hơn.

*Nếu không:*

Hôm nay là mùng 5. Bạn mua thêm một hộp sữa, chỉ vì mua được.

*Nếu nghỉ sớm:*

Rồi một buổi sáng, anh Huấn nhắn, lần đầu từ hôm bạn nghỉ. Kèm một tấm ảnh: tờ "Bản cam kết đồng hành". Không có ngày thanh toán, không có số tiền, chỉ có chỗ ký tên.

**Anh Huấn:** Hôm nay Chủ tịch tới tận tầng mình. Trước 5 giờ chiều ai cũng phải chọn. Uyên có kế hoạch của Uyên, anh Roger có niềm tin của anh Roger. Em đi rồi nên anh mới hỏi thật: nếu còn ở đây, em chọn gì?

Bạn gõ rồi xóa, gõ rồi xóa. Có những câu chỉ người ở lại mới trả lời được.

*Các nhánh trên gặp lại ở đây:*

Một năm sau, quán cà phê gần công ty mới. Đồng nghiệp hỏi: "Công ty cũ của ông có dự án lớn lắm hả, giờ sao rồi?". Bạn nói: "Không biết. Nghe nói tuần sau có tiền".

*Nếu nhận chức Trưởng nhóm HOẶC đã nêu tên Uyên với chị HR HOẶC đã ký tờ "không khiếu nại":*

Điện thoại rung, tin nhắn của Dân: "C* đang tuyển 20 người, ông ạ. Phúc lợi vẫn có trái cây thứ Sáu". Bạn nhắn lại: "Trái cây vẫn còn à?". Dân: "Còn. Chắc mùa này được mùa".

*Nếu không:*

Điện thoại rung, tin nhắn của Uyên: "C* đang tuyển 20 người. Phúc lợi vẫn có trái cây thứ Sáu". Bạn nhắn lại: "Trái cây vẫn còn à?". Uyên: "Ừ. Chắc mùa này được mùa".

### Kết thúc 5: The Believer

Bạn tin đến cùng. Công ty rất trân trọng điều đó.

- **Điều kiện:** ký cam kết ở lại VÀ quan hệ với Phó GĐ Jeon Gwang-hoe từ 20
- **Gợi ý hiện cho người chơi khi chưa mở:** Ở lại, và thật lòng tin vào tầm nhìn.

#### ending-believer

*phòng họp*

Cuối năm, bạn lên sân khấu nhận danh hiệu Nhân viên Trung thành. Sếp bắt tay bạn thật lâu trước ống kính.

**Phó GĐ Jeon Gwang-hoe:** Đây là người hiểu thế nào là tầm nhìn. Năm sau chúng ta bứt phá.

Phòng họp chỉ còn lại mười hai người vỗ tay. Bạn nhìn tấm bằng khen, rồi nhìn sổ nợ. Con số đã dài thêm một chữ số.

*Nếu anh Roger bắt đầu nghi ngờ:*

Anh Roger đứng ở hàng cuối, vỗ tay rất khẽ, và không nhìn lên sân khấu.

*Nếu không:*

**Anh Roger:** Anh đã bảo mà. Next week là có thôi, rồi còn cổ phiếu nữa. Anh em mình chỉ cần tin thêm một chút.

*Nếu đã kể thật với mẹ:*

Mẹ xem ảnh tấm bằng khen bạn gửi về, rồi gọi hỏi: "Thế họ trả con chưa?". Bạn nói: "Next week, mẹ ạ". Câu đó bạn học ở đâu, bạn biết rõ.

*Các nhánh trên gặp lại ở đây:*

Một năm sau. Bạn lên chức, có danh thiếp mới, có cả một cái bằng khen thứ hai. Anh Huni đã nộp đơn từ lâu, bàn giao đủ từng việc. Nhóm của bạn còn đúng một người là bạn. Trên tường, tấm ảnh tập thể mới chụp vừa khít trong khung nhỏ.

*Nếu niềm tin vào công ty không quá 25:*

Thật ra bạn không còn tin từ lâu rồi. Bạn chỉ không biết nếu thôi tin thì mình là ai ở đây.

*Các nhánh trên gặp lại ở đây:*

*Nếu anh Roger bắt đầu nghi ngờ:*

Anh Roger đã về nước từ tháng trước, không tiệc chia tay. Anh gửi bạn một email, một dòng: "Anh xin lỗi vì đã nói next week nhiều như vậy".

*Nếu không:*

Anh Roger vẫn ngồi đó, tám năm thành chín năm. Sáng nay anh vỗ vai bạn: "Next week, hopefully". Bạn nghe mình trả lời: "Dạ, hopefully".

### Kết thúc 6: The Empty Promise

Công ty tiếp tục hứa hẹn. Mọi thứ vẫn chưa thay đổi.

- **Điều kiện:** không rơi vào các kết thúc trên
- **Gợi ý hiện cho người chơi khi chưa mở:** Không làm gì cả, hoặc làm mà chưa đủ. Rất nhiều người đã đạt kết thúc này.

#### ending-empty-promise

*bàn làm việc*

*Nếu chọn theo đuổi quyền lợi:*

Hồ sơ của bạn được đóng dấu "Đã tiếp nhận", rồi nằm đó. Giấy tờ còn thiếu, người đi cùng cũng không có, nên công ty chỉ cần chờ. Công ty rất giỏi chờ.

*Các nhánh trên gặp lại ở đây:*

Sáng thứ Hai. Bạn mở máy. Có một ticket mới. Có một thông báo: lộ trình thanh toán tiếp tục được điều chỉnh.

Ở hành lang, Phó giám đốc vỗ vai bạn: "This week nhé em. Chậm nhất next week." Bạn gật đầu. Bạn đã thuộc lòng câu đó.

Không ai đuổi bạn. Không ai trả bạn. Mọi thứ vẫn tiếp tục, y như một bài hát không có đoạn kết.

*Nếu chọn theo đuổi quyền lợi:*

Một năm sau. Hay là hôm qua, bạn không còn chắc nữa. Bạn đã từng hỏi, từng ghi chép, từng nghĩ mình sẽ làm được gì đó. Sáng nay có email chào mừng một nhân viên mới. Bạn được giao hướng dẫn bạn ấy.

*Nếu không:*

Một năm sau. Hay là hôm qua, bạn không còn chắc nữa. Bạn chưa từng sai ở nhiệm vụ nào, và từ hôm ký tờ cam kết cũng không còn phải quyết định điều gì. Sáng nay có email chào mừng một nhân viên mới. Bạn được giao hướng dẫn bạn ấy.

### Sau The Empty Promise

Bấm "Tiếp tục cống hiến" để chơi lại từ đầu, khoản nợ giữ nguyên.

#### loop-renewal

*nhà riêng*

Thứ Hai, 7 giờ 12 phút. Điện thoại rung. Một email gửi **[tên người chơi]**, tiêu đề: "Chúc mừng! Hợp đồng của bạn đã được tự động gia hạn".

Lương: 15 triệu. Phúc lợi: văn hóa gia đình. Khoản nợ cũ được "chuyển tiếp sang kỳ phát triển mới". Bạn có cảm giác mình đã đọc email này rồi.

## Phần lặp lại mỗi tuần, mỗi tháng

### Hành động trong tuần

Mỗi tuần 3 lượt, mỗi tháng 4 tuần.

**Làm task** — Lấy KPI cho tháng này, sếp thêm ưng. Cần: sức khỏe từ 15. Hậu quả: *(sức khỏe -15; căng thẳng +3; quan hệ Phó GĐ Jeon Gwang-hoe +1)*

- Bạn đóng một ticket. Hệ thống mở thêm ba ticket.
- Task xong. Sếp thả tim, không thả gì khác.
- Bạn gửi báo cáo. Báo cáo được gửi đi để báo cáo tiếp.
- Bạn sửa xong một lỗi mà người tạo ra nó đã nghỉ việc.

**Nhận việc ngoài** — Có tiền ngay, không phải lương công ty. Xuất hiện khi: công ty đang nợ từ 1. Cần: sức khỏe từ 20. Hậu quả: *(có thêm 1.200.000 đ; sức khỏe -20; căng thẳng +4)*

- Làm thêm tới 2 giờ sáng. Khách trả tiền đúng hẹn, một cảm giác xa lạ.
- Bạn thiết kế logo cho một quán trà sữa. Họ trả liền. Bạn suýt khóc.
- Dạy kèm online buổi tối. Học trò hỏi lương đi làm được bao nhiêu. Bạn đổi chủ đề.

**Nghỉ ngơi** — Lấy lại sức, bớt căng. Hậu quả: *(sức khỏe +25; căng thẳng -10)*

- Bạn ngủ một giấc không mơ về bảng tính.
- Bạn đi dạo. Công viên không có KPI.
- Bạn tắt thông báo công việc trong đúng một buổi tối.

**Tám với đồng nghiệp** — Bớt căng, thân với đồng nghiệp hơn. Hậu quả: *(sức khỏe -5; căng thẳng -8; quan hệ Dân +2; quan hệ Uyên +2; quan hệ Khoa +2)*

- Dân bảo công ty sắp có đợt gọi vốn mới. Dân bảo thế từ năm ngoái.
- Cả nhóm bàn nên gọi trà sữa vị gì. Cuộc họp này có kết luận rõ hơn mọi cuộc họp khác.
- *(khi đã bị nợ)* Uyên đã ghi lại ngày giờ mọi lời hứa vào một file riêng.
- *(khi đã bị nợ)* Cả nhóm cười về trái cây thứ Sáu. Thứ Sáu này chỉ còn một quả chuối.
- *(khi đã bị nợ)* Anh Huni hỏi thăm từng người tháng này xoay xở thế nào. Không ai trả lời thật.
- *(khi chưa Khoa đã nghỉ)* Khoa rủ cả nhóm đi team building năm nay. Uyên hỏi ai trả tiền.
- *(khi chưa Khoa đã nghỉ VÀ công ty đang nợ từ 1)* Khoa tin tuần sau có lương. Tuần trước Khoa cũng tin vậy.
- *(khi Khoa đã nghỉ)* Bàn của Khoa vẫn trống. Không ai nhắc tới, mà cũng không ai đặt gì lên đó.

**Lưu giấy tờ** — Thêm một giấy tờ vào Hồ sơ, HR có thể để ý. Xuất hiện khi: bắt đầu ghi chép (mở "Lưu giấy tờ"). Hậu quả: *(lưu được một giấy tờ; hiểu quyền lợi +5; sức khỏe -5; căng thẳng +2; 25% khả năng: quan hệ Chị HR -6)*

- Bạn đã có đủ những gì tháng này cho phép lấy.
- Không còn gì mới để lưu vào lúc này.

### Weekly sync với anh Roger (từ tháng 4, sau cảnh `ch3-weekly-sync`, mỗi tuần một câu)

- Next week, hopefully.
- Hopefully next week nhé em.
- Anh nghe nói next week.
- Next week. Mình phải có niềm tin.
- Hopefully. Tuần sau sync tiếp.

### Ghi chú của Phó giám đốc trên phiếu lương chưa trả

- This week nhé em.
- Next week chắc chắn.
- Anh hứa, this week.
- Next week. Lần này khác thật.
- Ráng ở lại, sau IPO có cổ phiếu nội bộ.
- Đầu next week, muộn nhất cuối this week.
- This week hoặc next week, tùy next week.

### Ticket KPI ở bàn làm việc

Mỗi lượt Làm task trả lời vài ticket: làm ngay, hay đẩy sang sprint sau.

- **Khách hàng:** Không đăng nhập được từ sáng, cả phòng đang đứng hình. → *làm ngay.* Sửa xong trong 12 phút. Không ai biết, vì khi chạy đúng thì không ai nhìn.
- **Sếp:** Logo to hơn 10%, nhưng vẫn phải tinh tế. → *đẩy sang sprint sau.* Đẩy sang sprint sau. Sprint sau sếp sẽ muốn nhỏ lại 10%.
- **Cô Kế toán:** Hóa đơn tháng trước tính sai thuế, cần sửa trước khi nộp. → *làm ngay.* Sửa xong. Cô Kế toán gật đầu một cái, tương đương huân chương ở phòng này.
- **Sếp:** Làm 40 slide tầm nhìn 2035, thứ Hai cần, không gấp. → *đẩy sang sprint sau.* Sprint sau. Tầm nhìn 2035 chờ được, tầm nhìn 2030 còn đang chờ kia kìa.
- **Dân:** Bản sao lưu không chạy từ đầu tuần, cả tuần chưa ai để ý. → *làm ngay.* Chạy lại được. Bạn vừa cứu công ty mà không có ai để kể.
- **Chị HR:** Viết lại sứ mệnh công ty cho "Gen Z hơn". → *đẩy sang sprint sau.* Đẩy đi. Sứ mệnh hiện tại vẫn chưa được thực hiện, chưa cần bản mới.
- **Uyên:** Có bản vá bảo mật, chậm là lộ mật khẩu khách hàng. → *làm ngay.* Vá xong. Uyên ghi vào file của cô ấy. File đó ngày càng dày.
- **Chị HR:** Mỗi phòng thu một bài hát nội bộ cho lễ tổng kết. → *đẩy sang sprint sau.* Sprint sau. Nhạc nội bộ không trả được tiền nhà.
- **Cô Kế toán:** Xuất bảng công tháng này, thiếu là không tính được lương. → *làm ngay.* Bạn xuất bảng công cho một khoản lương chưa biết bao giờ có. Bạn vẫn làm đúng.
- **Sếp:** Làm bảng theo dõi KPI của cái bảng theo dõi KPI. → *đẩy sang sprint sau.* Đẩy đi. Tuy nhiên bảng này có khả năng sẽ quay lại, mạnh hơn.
- **Khách hàng:** Trừ tiền hai lần, xin hoàn lại một lần. → *làm ngay.* Hoàn xong. Ít nhất có người được trả đúng tiền trong tháng này.
- **Sếp:** Đề xuất ba khẩu hiệu mới cho bức tường sảnh. → *đẩy sang sprint sau.* Sprint sau. Bức tường đã nói quá nhiều rồi.
- **Khoa:** Ổ đĩa máy chủ còn 2%, chiều nay là hết. → *làm ngay.* Dọn xong. Khoa gửi sticker trái tim, và bảo tuần sau chắc có lương.
- **Chị HR:** Dựng video chúc mừng sinh nhật công ty, dài 8 phút. → *đẩy sang sprint sau.* Đẩy đi. Công ty tròn tuổi, còn lương thì chưa tròn.

## Nhân vật, giấy tờ, số liệu

### Nhân vật

- Bạn
- Chủ tịch Jeon Kim-jung
- Phó GĐ Jeon Gwang-hoe
- Anh Roger
- Anh Huấn
- Chị HR
- Cô Kế toán
- Dân
- Uyên
- Khoa

### Giấy tờ trong Hồ sơ

- **Hợp đồng lao động:** Bản bạn đã ký, kể cả trang 14 cỡ chữ 6. Ghi rõ mức lương và ngày nhận việc.
- **Lịch sử nhận lương:** Sao kê tài khoản của chính bạn: một tháng đủ, rồi những khoản lẻ không theo ngày nào.
- **Bảng chấm công:** Bảng công ghi rõ những tháng bạn vẫn đi làm đều.
- **Email giao việc và KPI:** Các email giao chỉ tiêu gửi tới bạn, trong đúng những tháng không có lương.
- **Sổ ghi lời hứa:** Ngày giờ của từng lời hứa trả lương, ghi lại ngay khi nghe thấy.
- **Các thông báo của HR:** Mọi thông báo gửi chung về lương, xếp theo ngày. Không cái nào có con số.
- **Email đòi quyền lợi:** Bản bạn gửi công ty, nêu rõ từng khoản bị nợ, cùng mọi hồi âm. Ghi rõ ngày bạn đã đòi.
- **Phiếu lương bị thiếu:** Phiếu lương những tháng công ty không gửi, cô Kế toán đưa tận tay.
- **Tờ "không khiếu nại":** Tờ công ty đưa để đổi lấy 15 triệu. Chính nó ghi "các khoản lương còn nợ".
- **Bảng đối chiếu của nhóm:** Ai, tháng nào, được hứa gì, đã nhận bao nhiêu, còn thiếu bao nhiêu.

### Số liệu

- Lương 15.000.000 đ, tiền KPI 30% lương (chỉ trả tháng 1)
- Tiền ban đầu 9.000.000 đ, sức khỏe 80, căng thẳng 10
- Chỉ tiêu KPI theo tháng: 0, 0, 8, 10, 10, 12, 12
- Niềm tin vào công ty bắt đầu từ 75, hiểu quyền lợi từ 20. Mỗi tháng không có lương mất 8 niềm tin, mỗi khoản công ty trả được cộng lại 4. Hai chỉ số này hiện ở Hồ sơ, và mở khóa lựa chọn "Ra điều kiện" ở chương 5, "nghỉ luôn" ở chương 4
- Sổ lương trong Hồ sơ ghi từng tháng: hợp đồng, đã nhận, còn thiếu, KPI bị giữ. Màn kết thúc cộng lại tất cả, kèm số lần nghe hứa và số người còn liên lạc
- Tổng số cảnh: 53

### Luật tiền, niềm tin, giấy tờ

- **Thứ tự cộng trừ tiền:** tiền vào ví trước, hóa đơn trừ sau. Không đủ thì ví về 0, phần thiếu thành "hóa đơn chưa trả". Tiền không bao giờ âm.
- **Vay:** tiền vào ví, đồng thời ghi riêng ở "đang vay". Vay dư thì phần dư ở lại ví. Vay thiếu thì hóa đơn còn lại vẫn nợ tiếp và khủng hoảng có thể quay lại tháng sau.
- **Khủng hoảng:** mỗi loại tối đa một lần mỗi tháng, xét thiếu tiền trước, kiệt sức sau.
- **Lương:** kỳ nào không đủ 15 triệu thì tính là kỳ thiếu: mất 8 niềm tin, thêm 12 căng thẳng. Khoản trả giữa chừng (10 hoặc 5 triệu) cộng 4 niềm tin và trừ vào tháng lương cũ nhất còn thiếu, kể cả khi nó được gọi là "benefit".
- **Niềm tin:** các mức trong cốt truyện, như -6 ở `ch4-six-months`, là khoản riêng, cộng thêm vào luật trên.
- **KPI:** tiền KPI là 30% lương theo hợp đồng, cố định, chỉ trả tháng 1 rồi bị giữ. Chỉ tiêu tháng tính bằng điểm ticket (chọn đúng 1 điểm, "Làm cho có" 2 điểm) và chỉ ảnh hưởng đánh giá của sếp và căng thẳng.
- **Giấy tờ:** 10 loại, mỗi loại tính một lần dù nhận từ hai nguồn.
- **Quan hệ:** mọi mối quan hệ đều đổi được truyện: thân với Khoa, Roger, cô Kế toán, chị HR, Uyên, anh Huni, Dân mở hoặc đóng những đoạn riêng.
- **Gia hạn hợp đồng (vòng lặp):** giữ nguyên số công ty nợ, khoản đang vay, tên người chơi. Làm lại từ đầu tiền trong ví, sức khỏe, quan hệ, giấy tờ, cờ sự kiện.
- **Nhánh:** ở mỗi cụm điều kiện chỉ chạy nhánh đầu tiên đúng, nên một người đủ nhiều điều kiện vẫn chỉ nhận một khoản.
- **Tính toàn vẹn:** validator chạy khi build bảo đảm mọi cảnh, nút, điều kiện đều tồn tại, không có ngõ cụt. Test người chơi ngẫu nhiên đi qua đủ mọi dòng thoại và cả sáu kết thúc.
