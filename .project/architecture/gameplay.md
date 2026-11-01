# Gameplay Architecture

Mô hình domain trong `packages/game-core`. Đây là thiết kế ban đầu; FEAT-003 và FEAT-005 chốt tên và kiểu dữ
liệu thật, rồi cập nhật lại file này.

---

## 1. GameState

```text
GameState
  saveVersion, contentVersion, seed, rngState
  run:        phase, chapter, month, week, actionsLeft
  story:      currentNode, flags, visitedNodes, appliedEffects
  money:      cash, loans, companyDebt, bills
  mood:       energy, stress
  relations:  theo từng nhân vật
  evidence:   các mục đã có
  ending:     null hoặc id ending
```

---

## 2. Trạng thái lượt chơi

`phase` chỉ có `scene`, `week`, `payslip`, `ended`. Mọi chuyển pha đi qua `continueCalendar` trong
`game-core/src/calendar/calendar.ts`:

```text
beginRun → scene → hết cảnh → continueCalendar
continueCalendar: có cảnh tới hạn? → scene
                  đang ngày lương? → payslip
                  còn lại          → week
week: hết lượt → sang tuần sau, hoặc hết tuần 4 → tính phiếu lương → continueCalendar
payslip: đóng phiếu → tháng sau, hoặc hết nội dung → ended
```

Chuyển trạng thái sai bị từ chối. Không dùng nhiều boolean rời nhau.

---

## 3. Story engine

Cốt truyện là đồ thị dữ liệu, kiểu ở `packages/game-core/src/story/story-types.ts`.

```text
Node:      id, speaker, text, choices | next
Choice:    text, requires (điều kiện), lockedReason, effects, next
Effect:    addMoney, addStress, addRelation, addEvidence, setFlag, ...
Condition: so sánh chỉ số, có flag, có bằng chứng, kết hợp all / any / not
```

`Effect` và `Condition` là dữ liệu có schema, không phải hàm. Nhờ vậy validator kiểm tra được và save lưu được.

**Validator chạy lúc build, sai là build đỏ:**

- Mọi node tới được từ điểm bắt đầu, mọi node đi tiếp được hoặc là kết thúc.
- Mọi `next`, nhân vật, bằng chứng, flag đều tồn tại.
- Lựa chọn có `requires` phải có `lockedReason`.
- Mọi chương có đường đi tới chương sau.

---

## 4. Xác định kết thúc

`selectEnding(state)` là hàm thuần, xét theo thứ tự ở GDD §6. Luôn trả về đúng một ending, trường hợp còn lại
là Ending 5.

---

## 5. Kiểm thử bằng lượt chơi tự động

Có thể viết kịch bản chuỗi hành động chạy trên `game-core` không cần UI. Mỗi ending có một lượt chơi tự động
(FEAT-023), đây là bài kiểm tra hồi quy chính của cốt truyện.
