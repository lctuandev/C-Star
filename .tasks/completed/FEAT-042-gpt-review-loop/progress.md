# Progress — FEAT-042-gpt-review-loop

- Vòng 1 xong, quyết định ghi ở `review-1.md`.
- Sự cố quy trình: commit `c8fcba7` được push và deploy khi E2E còn đỏ (2 test `depth.spec.ts`). Lệnh đọc kết quả nằm chung bước với lệnh phát hành, và `| tail` che mất mã thoát nên thông báo ghi exit 0. Nguyên nhân test đỏ: test còn đợi chữ cũ "việc.", game không lỗi, nên không cần quay lại bản trước. Từ giờ E2E ghi `EXIT=` riêng, đọc xong mới phát hành.
