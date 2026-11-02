# Plan — FEAT-045-late-game-choices

## Objective

Giả lập 800 lượt chơi cho thấy hai điểm yếu: chương 5–6 có ít quyết định nhất (7 cảnh 4 lần chọn, 2 cảnh 2 lần chọn), và 54% lượt ngẫu nhiên nghỉ ở tháng 4, bỏ lỡ cao trào. Owner duyệt làm cả hai.

## Scope

- Ba quyết định mới ở cuối game, đều có hậu quả đọc được về sau:
  1. `ch5-company-reply`: chị HR dò ai lập bảng đối chiếu.
  2. `ch5-payday`: kể thật với mẹ hay không.
  3. `ch6-last-day`: 15 triệu đổi lấy tờ "không khiếu nại". Chỉ người có khả năng theo đuổi tới cùng mới được đề nghị.
- Một nhịp cân nhắc trước khi nhận lời mời việc ở `ch3-other-offer`.
- Một đoạn hé lộ trong `ending-survivor` cho người rời sớm, để họ muốn chơi lại.
- Giấy tờ thứ mười: tờ "không khiếu nại" chụp lại được.

## Non-goals

- Không thêm nhân vật, cảnh mới, kết thúc mới.
- Không đổi điều kiện sáu kết thúc.
- Không đổi save format: cờ và giấy tờ là chuỗi, id cũ giữ nguyên, nên save cũ đi tiếp được.
- Không thêm nhịp cân nhắc cho `walk-away` và `quit`: hai lối đó đã có điều kiện chặn.

## Affected systems

`packages/content` (chương 3, 5, 6, `evidence.ts`, test, script kịch bản), `apps/web/src/features/audio/sound-cues.ts`.

## Implementation steps

1. Nhịp cân nhắc tháng 4 và đoạn hé lộ trong Survivor.
2. Câu hỏi của chị HR và các hậu quả.
3. Cuộc gọi của mẹ và các hậu quả.
4. Thỏa thuận 15 triệu, giấy tờ mới, đường đi khi đã ký.
5. Test, kịch bản, âm thanh của lựa chọn.
6. Đo lại bằng giả lập, gửi GPT chấm phần thay đổi.

## Acceptance criteria

- Chương 5 có từ 6 lần chọn, chương 6 có từ 3 lần chọn.
- Mỗi cờ mới đều có chỗ đọc, `story-links.test.ts` qua.
- Tỉ lệ rời sớm ở lượt ngẫu nhiên giảm rõ so với 54%.
- Cả sáu kết thúc vẫn tới được, mọi dòng thoại mới đều tới được.
- Unit, E2E, typecheck, lint, format đều qua.

## Risks

- Nêu tên Uyên làm mất hai kết thúc: cố ý, nhưng phải đọc được là hậu quả của chính lựa chọn đó.
- Thỏa thuận 15 triệu làm giảm Good và Collective ở người chơi ngẫu nhiên: chấp nhận, vì đây là cám dỗ thật.
- Các test E2E đi theo số lần chạm có thể lệch vì thêm dòng thoại.

## Dependencies

Không có.
