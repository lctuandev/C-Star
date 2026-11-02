# Test — FEAT-045-late-game-choices

| Kiểm tra | Kết quả |
| --- | --- |
| Unit content, gồm `story-links`, sáu kết thúc, người chơi ngẫu nhiên | PASS, 137 |
| Unit game-core | PASS, 114 |
| Unit web, gồm âm thanh của mọi lựa chọn | PASS, 229 |
| E2E Playwright, điện thoại và laptop | PASS, 145 passed, 15 skipped, EXIT=0 |
| E2E: lựa chọn trong kết thúc The Survivor, cả hai câu trả lời, reload | PASS |
| Typecheck, lint, format | PASS |
| Validator nội dung khi build | PASS, 53 cảnh |
| Không xóa nút truyện nào, save cũ đi tiếp được | PASS, so bằng git diff |
| GPT chấm phần thay đổi | ĐẠT ở lần thứ hai, `review-3.md` |
| Site thật sau khi phát hành: worker `7805ba6f71eb`, nội dung mới trong bundle, không có script Cloudflare, không cookie | PASS |
| E2E `home`, `disclaimer`, `ending` trên site thật | 27 passed, 1 failed: trang chủ quá 5 giây ở lượt đầu ngay sau phát hành; chạy lại riêng test đó 16 lần đều PASS |
| Chơi tay các nhánh mới | NOT TESTED |
| Trên điện thoại thật | NOT TESTED |
| Sau khi GPT chấm, chỉnh theo hai góp ý cuối và thêm đoạn Uyên ghi nhớ | Chưa gửi GPT chấm lại, đã qua toàn bộ test |

## Đo lại bằng 600 lượt người chơi ngẫu nhiên

| | Trước | Sau |
| --- | --- | --- |
| Rời sớm | 54% | 29% |
| The Survivor | 70% | 59% |
| The Empty Promise | 15% | 20% |
| The Investigator | 5% | 10% |
| The Believer | 5% | 8% |
| The Collective | 4% | 3% |
| The Good Ending | 1% | 1% |
| Lần chọn ở chương 5 | 4 | 6 |
| Lần chọn ở chương 6 | 2 | 5 |
| Tổng nút truyện | 490 | 550 |

Đây là người chơi chọn ngẫu nhiên, không phải người thật.
