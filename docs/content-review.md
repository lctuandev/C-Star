# Rà soát nội dung — TECH-003

Ngày 2026-11-01. Rà theo `.project/contracts/content.md` trên toàn bộ 37 cảnh, 234 câu, 14 ticket, các kết quả hành động.

## Kết quả

| Mục                                              | Cách kiểm                                | Kết quả                        |
| ------------------------------------------------ | ---------------------------------------- | ------------------------------ |
| Tên công ty, sản phẩm có thật                    | Test `fiction.test.ts`, đọc qua           | Sửa 2 chỗ (Excel, Slack). Đạt  |
| Điều luật, tòa án, thời hạn, mức bồi thường      | Test `fiction.test.ts`                    | Đạt                            |
| Bằng chứng chỉ là giấy tờ của chính nhân vật     | Test, đọc qua                             | Đạt                            |
| Đùa vào ngoại hình, giới tính, vùng miền, bệnh tật | Đọc qua                                 | Đạt                            |
| Chức danh thay tên cho lãnh đạo                  | Sếp, Chị HR, Cô Kế toán                   | Đạt                            |
| Lời cảnh báo trước khi vào, ở màn kết, ở Về game | E2E                                       | Đạt                            |

`fiction.test.ts` chạy trong mỗi lần build CI, nên nội dung sau này cũng phải qua. Từ M6 test này đọc cả chữ trên tường văn phòng
(`tools/art-pipeline/textures/decal-text.json`), vì người chơi cũng đọc chúng.

## Rà bổ sung M6 (đồ họa)

| Mục                                                  | Kết quả                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------- |
| Chữ trên poster, slide, bảng ghi chú, máy bán nước   | Tự viết, không tên thật, qua `fiction.test.ts`                |
| Mô hình và nhân vật                                  | Tự dựng từ code, không dùng asset bên thứ ba                  |
| Nhân vật có mặt tối giản                             | Dáng đồ chơi, không dựa trên người thật                       |
| Logo C\* trên tường phòng họp                        | Là logo game, cùng tình trạng với mục 2 bên dưới              |

## Cần owner tự xác nhận

Claude không biết công ty nào đứng sau cảm hứng của game, nên không thể kiểm tra những điều sau:

1. **Tên "C\*".** Có gợi tới một công ty có thật không? Dòng chuyển khoản trong game ghi `CT C STAR`. Nếu có, phải đổi tên game và dòng này.
2. **Logo.** Chưa tra trùng thương hiệu.
3. **Câu chữ có thật.** Không câu nào được phép chép từ email, tin nhắn hay thông báo có thật. Bản nháp ChatGPT có các câu HR kiểu
   "đang cố gắng": nếu đó là lời thật của ai, hãy báo để đổi. Cũng áp dụng cho các chi tiết thêm ở M6: "Vượt thác hóa rồng", "1–2 triệu đô",
   IPO và cổ phiếu nội bộ. Nếu đây là tên chiến dịch hay lời hứa có thật của một công ty thật, người trong cuộc sẽ nhận ra, nên đổi đi.
4. **Số liệu.** Lương 15 triệu và các con số khác là phỏng đoán. Nếu trùng số thật, nên đổi.
5. **Tên nhân vật** Dân, Uyên, Khoa: nếu trùng người có thật liên quan, nên đổi.
6. **Lời cảnh báo** chưa qua luật sư. Nếu phát hành rộng, nên hỏi trước.
