# Gameplay Architecture

Mô hình domain trong `packages/game-core`, đúng với code hiện tại.

---

## 1. GameState

Kiểu đầy đủ ở `packages/game-core/src/state/game-state.ts`. Là JSON thuần, nên save chính là nó.

```text
GameState
  seed, rng
  phase:     scene | week | kpi | payslip | ended
  calendar:  month, week, actionsLeft, payday
  money:     cash, arrears, loans, companyDebt
  mood:      energy, stress
  story:     sceneId, nodeId, flags, seenScenes
  relations, kpi, kpiRound, evidence, crises
  ending, loops, payslip, lastOutcome
```

---

## 2. Trạng thái lượt chơi

`phase` chỉ có `scene`, `week`, `kpi`, `payslip`, `ended`. Mọi chuyển pha đi qua `continueCalendar` trong
`game-core/src/calendar/calendar.ts`:

```text
beginRun → scene → hết cảnh → continueCalendar
continueCalendar: đã quyết định kết thúc? → cảnh kết, rồi ended
                  có khủng hoảng?          → scene (tối đa một lần mỗi tháng, không vào ngày lương)
                  có cảnh tới hạn?         → scene
                  đang ngày lương?         → payslip
                  còn lượt                 → week
                  hết lượt                 → sang tuần sau
week: hành động có ticket → kpi → xong → tính lượt → continueCalendar
      hết tuần 4 → tính phiếu lương → continueCalendar
payslip: đóng phiếu → tháng sau, hoặc hết nội dung → ended
```

Chuyển trạng thái sai bị từ chối. Không dùng nhiều boolean rời nhau.

---

## 3. Story engine

Cốt truyện là đồ thị dữ liệu, kiểu ở `packages/game-core/src/story/story-types.ts`.

```text
Node:      speaker, text, effects, choices | next; hoặc routes (rẽ nhánh ẩn)
Choice:    text, requires (điều kiện), lockedReason, effects, next
Effect:    setFlag, addCash, companyPays, addEnergy, addStress, addRelation, addEvidence,
           findEvidence, takeLoan, payArrears, loseWeek, chance
Condition: flag, stat, relation, evidence, crisisCount, kết hợp all / any / not
```

`Effect` và `Condition` là dữ liệu có schema, không phải hàm. Nhờ vậy validator kiểm tra được và save lưu được.

**Validator chạy lúc build, sai là build đỏ:**

- Mọi node tới được từ điểm bắt đầu, mọi node đi tiếp được hoặc là kết thúc.
- Mọi `next`, nhân vật, bằng chứng, flag đều tồn tại.
- Lựa chọn có `requires` phải có `lockedReason`.
- Mọi chương có đường đi tới chương sau.

---

## 4. Xác định kết thúc

Cờ `runOver` kết thúc lượt chơi. `selectEnding(state, world)` là hàm thuần, xét `world.endings` theo thứ tự ở GDD §6. Luật cuối bắt
mọi trường hợp còn lại, là Ending 5. `renewContract` đưa về đầu và giữ sổ nợ.

---

## 5. Kiểm thử bằng lượt chơi tự động

`packages/content/src/playthrough.test.ts` chơi ngẫu nhiên 90 lượt: không kẹt, mọi câu tới được. `endings.test.ts` có một bot chơi có
kế hoạch cho mỗi ending. Đây là kiểm tra hồi quy chính của cốt truyện: sửa nội dung thì chạy `pnpm --filter @cstar/content test`.
