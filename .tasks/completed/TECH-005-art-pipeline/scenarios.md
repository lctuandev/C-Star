# TECH-005-art-pipeline — Scenarios

### SCENARIO-060: dựng lại toàn bộ bằng một lệnh
`pnpm --filter @cstar/art-pipeline art` dựng, bake, tối ưu, kiểm ngân sách, xuất vào web, không cần thao tác tay.

### SCENARIO-061: vượt ngân sách thì đỏ
Model vượt trần ở `budgets/` làm `validate` exit 1 và liệt kê mọi chỉ số vượt. CI chạy `validate --public` trên file đã commit.
