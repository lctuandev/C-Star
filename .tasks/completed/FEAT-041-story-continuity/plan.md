# Plan — FEAT-041-story-continuity

## Objective

Owner yêu cầu rà timeline và hội thoại để cốt truyện liên kết, mạch lạc. Câu trả lời của GPT chỉ nêu cách kiểm tra (timeline, lời thoại, liên kết, logic game) và xin file, chưa có kết quả, nên task này tự làm đủ bốn hạng mục đó trên 53 cảnh hiện có.

## Scope

- Sửa sai thời gian, tiền, xưng hô, nhân vật xuất hiện sai lúc.
- Mỗi lựa chọn được ghi lại phải có hậu quả về sau: 23 cờ trước đây không ai đọc.
- Thêm cho mỗi nhân vật chính một tuyến rõ đầu, giữa, cuối.
- Thêm vào `docs/kich-ban-day-du.md`: timeline, tuyến nhân vật, bảng lựa chọn và hậu quả.
- Một test giữ cho việc này không tái diễn (`story-links.test.ts`).

## Non-goals

- Không đổi cấu trúc chương theo khung của GPT (chương 4 là tháng 4–6): owner đã xếp Vượt thác ở chương 3 và trả 1/3 ở chương 4.
- Không đổi điều kiện của sáu kết thúc.
- Không viết lại những đoạn đang tốt: mọi thay đổi ghi ở `audit.md`.

## Affected systems

`packages/content`, `packages/game-core` (câu thoại và ticket theo điều kiện, sổ lương), `apps/web/src/features/{office,save}`, `tools/art-pipeline`.

## Implementation steps

1. Đọc lại toàn bộ kịch bản, đo cờ không dùng.
2. Sửa thời gian và logic.
3. Nối lựa chọn với hậu quả.
4. Sinh lại tài liệu, chạy toàn bộ kiểm tra.

## Acceptance criteria

- `story-links.test.ts`: không còn lựa chọn nào được ghi lại mà bị bỏ quên.
- Khoa không còn xuất hiện sau khi nghỉ, trừ những chỗ cố ý nhắc tới anh.
- Sổ lương cộng lại đúng bằng số công ty đang nợ.
- Băng rôn chỉ xuất hiện từ cảnh ra mắt chiến dịch, cả ở 3D lẫn 2D.

## Risks

Nhiều nhánh nhỏ làm tăng số dòng phải đọc lại. Test người chơi ngẫu nhiên đã xác nhận mọi dòng đều tới được.

## Dependencies

FEAT-039, FEAT-040.
