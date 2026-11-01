# Công ty C\* — Game Design Document v0.1

Tên làm việc, chưa phải tên phát hành. Cập nhật: 2026-11-01.

**Nguồn ý tưởng:** cuộc trao đổi ChatGPT của owner, 2026-11-01:
<https://chatgpt.com/share/6ae6d5cc-40ec-83ec-9ed1-c66243c3e7b6>. Thoại mẫu nằm ở link đó. Tài liệu
này diễn giải lại, thoại chính thức được viết ở các task nội dung (FEAT-009, 010, 015, 020, 021, 022).

**Cách đọc tài liệu:**

- `[Nguồn]`: có trong kịch bản gốc.
- `[Đề xuất]`: Claude thêm vào để kịch bản thành game chơi được. Con số là phỏng đoán đầu tiên, owner
  chơi thử rồi chỉnh.

---

## 1. Tổng quan

|           |                                                                                  |
| --------- | -------------------------------------------------------------------------------- |
| Thể loại  | Dark comedy, mô phỏng sinh tồn, phiêu lưu theo cốt truyện, game đơn              |
| Nền tảng  | Web, PWA cài được, chơi offline; dọc trên điện thoại là chính                    |
| Ngôn ngữ  | Tiếng Việt                                                                       |
| Khẩu hiệu | Welcome to the unpaid workforce.                                                 |
| Bối cảnh  | Một công ty công nghệ hư cấu: khẩu hiệu hoành tráng, lời hứa nhiều, lương thì không |

**Tiền đề `[Nguồn]`:** Người chơi là nhân viên mới của C\*. Mọi thứ bắt đầu đầy hứa hẹn, rồi lương chậm
dần trong khi KPI vẫn đều đặn. Sau hơn sáu tháng, nhân viên nhận ra chính mình đang tài trợ cho công ty
bằng thời gian và công sức.

**Câu hỏi đọng lại `[Nguồn]`:** khi công ty không làm đúng nghĩa vụ, người lao động có thể làm gì để tự
bảo vệ mình? Game làm người chơi cười trước, nghĩ sau.

**Trụ cột thiết kế `[Đề xuất]`:**

1. **Cười trước, cay sau.** Tình huống vô lý nhưng quen thuộc. Không kể khổ.
2. **Mọi lựa chọn đều có giá.** Tiền, sức, quan hệ, bằng chứng: không thể giữ cả bốn.
3. **Châm biếm tình huống, không nhắm vào ai.** Nhân vật là biểu tượng, xem
   `.project/contracts/content.md`.
4. **Đáng chơi lại.** Sáu kết thúc, một lượt chơi đủ ngắn để muốn thử lại.

---

## 2. Nhân vật `[Nguồn]`

Nhân vật là kiểu người biểu tượng, không mô phỏng ai có thật. Tên lãnh đạo do owner đặt và xác nhận là hư cấu.

| Nhân vật                | Vai trò                                                                      |
| ----------------------- | ---------------------------------------------------------------------------- |
| Nhân viên mới (Player)  | Vào công ty với nhiều kỳ vọng, dần bị cuốn vào vòng xoáy chậm lương          |
| Chủ tịch Jeon Kim-jung  | Chủ sở hữu, người đại diện, chủ của công ty này và nhiều công ty khác, rất ít khi xuất hiện              |
| Phó giám đốc Jeon Gwang-hoe (The Visionary) | Chuyên hứa, cứ 5–6 tháng lại kéo mọi người ở lại bằng tin đã "đào được 1–2 triệu đô" |
| Anh Roger, trưởng phòng, người Ấn Độ | Tin vào tầm nhìn của Chủ tịch một cách mù quán, kêu gọi cấp dưới ở lại, không đọc hợp đồng hay luật |
| Anh Huấn (Huni), phó phòng | Yêu công ty, liêm chính, nhưng tỉnh táo; hòa đồng và hiểu nhân viên          |
| HR (The Messenger)      | Đưa tin bằng giọng ngoại giao, câu nào cũng là công ty đang cố gắng          |
| Kế toán (The Calculator) | Giữ những con số chẳng ai hiểu: lương đợt 1, đợt 2, KPI, phụ cấp            |
| Đồng nghiệp (The Survivor) | Cùng chờ lương: người muốn nghỉ, người muốn kiện, người vẫn tin tuần sau có |

`[Đề xuất]` Nhóm đồng nghiệp gồm 3–4 người có tên riêng hư cấu, mỗi người một lập trường và một quyết định
riêng ở Chương 4, để việc họ rời đi có sức nặng.

---

## 3. Cốt truyện: 6 chương `[Nguồn]`

| Chương | Tên               | Thời gian  | Diễn biến                                                                                                 | Nhiệm vụ                                                     |
| ------ | ----------------- | ---------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1      | Dream Big         | Tháng 1    | Nhận offer, onboarding, họp toàn công ty, sếp nói về gia đình và tương lai                                | Hoàn thành onboarding, làm quen đồng nghiệp                  |
| 2      | Payment Delay     | Tháng 2    | Tới ngày lương mà tài khoản im lặng; HR đổ cho hệ thống thanh toán; nhân viên bắt đầu hỏi nhau            | Làm tiếp việc, tìm hiểu chuyện gì đang xảy ra                |
| 3      | KPI Never Sleeps  | Tháng 3–4  | Lương vẫn chậm, KPI vẫn phải đạt, dự án mới dồn tới; bắt đầu phải chọn cống hiến hay tìm đường khác       | Đạt KPI, thu thập thông tin, tìm đồng minh                   |
| 4      | Six Months Later  | Tháng 5–6  | Người nghỉ dần; lời hứa đổi liên tục; mỗi người được nợ một kiểu; xuất hiện nhóm muốn cùng tìm cách       | Quyết định ở lại hay bắt đầu hành động                       |
| 5      | The Awakening     | Khủng hoảng | Gom hợp đồng, chấm công, chứng từ; đối chiếu các khoản; chọn yêu cầu chính thức, tìm tư vấn hay thương lượng | Tập hợp bằng chứng, phối hợp, ra quyết định                  |
| 6      | The Last Day      | Chương cuối | Đối mặt lựa chọn cuối: làm tiếp, rời đi, hay theo đuổi quyền lợi; lựa chọn trước đó quyết định kết thúc    | Hoàn thành hành trình                                        |

Các chi tiết xuyên suốt: lời hứa "this week", "next week" trên mỗi phiếu lương chưa trả; chiến dịch "Vượt thác hóa rồng" ở
tháng 4, với "benefit" là được nhận một phần lương sớm; lời hứa IPO và cổ phiếu nội bộ kèm "1–2 triệu đô" ở tháng 6; mọi người
phải vay người thân và vay tín dụng; rời đi trước tháng 6 thì Phó giám đốc nhắn "tiếc cho em"; công ty thỉnh thoảng trả một phần ba
hoặc hai phần ba tháng lương để giữ niềm tin rồi nợ tiếp, từ tháng 5 chỉ một phần ba và chỉ vài người có; tháng đầu trả đủ lương cộng KPI 30%; tiền KPI bị giữ; có tháng không có bảng lương; weekly sync thứ Sáu nào anh
Roger cũng trả lời "next week, hopefully".

---

## 4. Vòng lặp chơi `[Đề xuất]`

Kịch bản gốc có các hệ thống nhưng chưa có nhịp chơi. Đề xuất nhịp theo tuần:

```text
Đầu tháng → 4 tuần → Ngày lương → Trả hóa đơn → Sự kiện cốt truyện → Tháng sau
```

Mỗi tuần người chơi có **3 lượt hành động**:

| Hành động           | Được                              | Mất                |
| ------------------- | --------------------------------- | ------------------ |
| Làm task            | Tiến độ KPI, lòng tin của sếp     | Năng lượng         |
| Nhận việc ngoài     | Tiền mặt                          | Năng lượng, rủi ro bị phát hiện |
| Nghỉ ngơi           | Năng lượng, giảm căng thẳng       | Một lượt           |
| Tám với đồng nghiệp | Quan hệ, tin đồn, giảm căng thẳng | Một lượt           |
| Tìm hiểu            | Bằng chứng (khi đã mở khóa)       | Một lượt, rủi ro với HR |

Mục tiêu độ dài: **45–60 phút cho một lượt chơi**, 7 tháng × 4 tuần × 3 lượt = 84 hành động, xen kẽ 37 cảnh cốt
truyện. Tháng 8 chỉ có cảnh cuối. Autosave sau mỗi hành động để chơi được từng đoạn ngắn trên điện thoại.

Bản cài đặt đang dùng các hành động: Làm task (mini-game), Nhận việc ngoài (từ tháng 2), Nghỉ ngơi, Tám với đồng
nghiệp, Lưu giấy tờ (từ khi nhận lời Uyên ở Chương 3). Số liệu nằm ở `packages/content/src/economy.ts`.

---

## 5. Hệ thống gameplay

### 5.1 Sinh tồn tài chính `[Nguồn]`

Quản lý tiền sinh hoạt khi thu nhập bị trì hoãn.

`[Đề xuất]`

- **Tiền** là số nguyên VND, không bao giờ âm.
- **Hóa đơn tháng:** nhà, ăn, điện nước, cộng hóa đơn bất ngờ theo seed.
- **Sổ nợ:** con số công ty đang nợ người chơi, luôn hiện rõ và cứ tăng: đây là trò đùa chính của HUD.
- **Thiếu tiền** không làm game over mà mở khủng hoảng: vay bạn bè, bán đồ, nhận việc gấp. Khoản vay được
  ghi riêng, nên tiền vẫn không âm.

### 5.2 Năng lượng tinh thần `[Nguồn]`

Năng lượng làm việc và căng thẳng thay đổi theo sự kiện. Nghỉ ngơi, trò chuyện hay tìm hướng giải quyết
đều tác động lên trạng thái.

`[Đề xuất]` Hai chỉ số 0–100. Năng lượng về 0 hoặc căng thẳng lên 100 mở khủng hoảng **kiệt sức**: mất một
tuần, không phải game over.

### 5.3 Thu thập bằng chứng `[Nguồn]`

Hợp đồng, email, thông báo, bảng lương, lịch sử thanh toán. Đây là hệ thống mở khóa lựa chọn ở chương cuối.

`[Đề xuất]` Có một màn "Hồ sơ" để xem lại; một số bằng chứng chỉ lấy được trong đúng giai đoạn, bỏ lỡ là mất.

### 5.4 Hội thoại và lựa chọn `[Nguồn]`

Câu trả lời đổi quan hệ với sếp, HR và đồng nghiệp, một số mở nhánh truyện.

`[Đề xuất]` Quan hệ là chỉ số -100…100 theo từng nhân vật. Lựa chọn nào bị khóa thì hiện lý do, để người
chơi biết mình còn thiếu gì khi chơi lại.

### 5.5 Mini-game KPI `[Đề xuất]`

"Làm task" có một trò chơi nhỏ tại bàn làm việc (kéo thả ticket, hoặc trả lời email sếp theo đúng giọng).
Mục đích là để người chơi thấy vui, và thấy KPI tăng lên vô nghĩa ra sao. Kịch bản gốc muốn tránh game chỉ
có đọc và bấm, nên đây là điểm khác biệt chính.

---

## 6. Sáu kết thúc

Tên và ý nghĩa `[Nguồn]`, điều kiện `[Đề xuất]`. Xét từ trên xuống, gặp điều kiện đúng đầu tiên thì dừng.

| #   | Tên               | Ý nghĩa                                             | Điều kiện đề xuất                                                   |
| --- | ----------------- | --------------------------------------------------- | ------------------------------------------------------------------- |
| 6   | The Good Ending   | Quyền lợi được giải quyết, bước sang chương mới     | Đủ bằng chứng, nhóm đủ người, đã gửi yêu cầu chính thức             |
| 4   | The Collective    | Nhân viên đoàn kết cùng tìm hướng giải quyết        | Nhóm đủ người, nhưng thiếu bằng chứng                               |
| 3   | The Investigator  | Đủ bằng chứng và tự theo đuổi quyền lợi             | Đủ bằng chứng, theo đuổi một mình                                   |
| 2   | The Survivor      | Rời công ty và bắt đầu lại                          | Chọn rời đi ở Chương 6, hoặc buộc phải rời vì khủng hoảng lặp lại   |
| 1   | The Believer      | Tiếp tục tin lời hứa                                | Ở lại, lòng tin vào sếp cao                                         |
| 5   | The Empty Promise | Công ty tiếp tục hứa, không có gì thay đổi          | Các trường hợp còn lại                                              |

**Vòng lặp của Ending 5 `[Nguồn]`:** người chơi tưởng đã xong, màn hình chúc mừng hiện lên rồi báo lương
lại trễ, kỳ lương sau là "Coming Soon™". Game quay lại đầu với cảm giác không thoát được.

---

## 7. Hình ảnh và âm thanh `[Nguồn]`

3D low-poly có chủ đích, hơi giống game indie châm biếm xã hội.

| Khu vực        | Không khí                                      |
| -------------- | ---------------------------------------------- |
| Văn phòng      | Màu lạnh, đèn huỳnh quang, ngột ngạt           |
| Phòng họp      | Nơi những lời hứa được đưa ra mỗi tuần         |
| Bàn làm việc   | Máy tính, task, thông báo, hóa đơn chưa trả    |
| Hành lang      | Nơi nhân viên nói chuyện thật ngoài cuộc họp   |

`[Đề xuất]` Âm thanh: tiếng đèn huỳnh quang rè, tiếng ting tin nhắn ngân hàng (và sự thiếu vắng của nó vào
ngày lương).

---

## 8. Ý tưởng để sau: AI NPC `[Nguồn]`

HR, sếp và đồng nghiệp trả lời khác nhau tùy tình huống. Chưa làm ở bản đầu (ADR-001): cần server, tốn phí
mỗi lượt chơi, không chơi offline được, và câu thoại sinh tự động có thể vượt ranh giới hư cấu ở
`.project/contracts/content.md`.

---

## 9. Quyết định còn mở

Kịch bản gốc hỏi 3 câu mà chưa có câu trả lời chốt.

| Câu hỏi              | Tạm chọn                       | Trạng thái                                                     |
| -------------------- | ------------------------------ | -------------------------------------------------------------- |
| Phong cách           | Dark Comedy + Survival         | Theo đề xuất của kịch bản gốc                                  |
| Mức liên hệ thực tế  | Hư cấu hoàn toàn               | Khớp yêu cầu của owner về lời cảnh báo, ADR-003                |
| Góc nhìn             | Third Person 3D, làm sau slice | **Owner chốt sau khi chơi thử M1**, ADR-004                    |
