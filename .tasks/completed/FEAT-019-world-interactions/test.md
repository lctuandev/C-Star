# Test — FEAT-019-world-interactions

## 2026-11-01

| Check                                  | Result |
| -------------------------------------- | ------ |
| Unit: `isTooSlow`, mọi hành động có địa điểm | PASS |
| E2E: khóa thì không chạm được           | PASS   |
| E2E: tắt 3D trong Cài đặt               | PASS   |
| E2E: trình duyệt không có WebGL         | PASS   |

SCENARIO-054: PASS.

## Failures

- **Lỗi thật, nghiêm trọng:** `supportsWebGl` chạy mỗi lần render và tạo một WebGL context mới mỗi lần. Trình duyệt giới hạn số context nên giết
  context của văn phòng: vòng render chết, nhân vật đứng im giữa đường, nút hành động khóa vĩnh viễn. Test đi lúc đầu pass nhờ may mắn về thời
  điểm, rồi fail 6/6 sau khi đổi instancing. Log `Too many active WebGL contexts` chỉ ra nguyên nhân. Sửa: hỏi một lần và trả lại context.
- Thêm lớp thứ hai: mất context vì bất kỳ lý do gì thì lùi về 2D, vì điện thoại có thể thu hồi context bất cứ lúc nào. Có test E2E cho cả hai.
