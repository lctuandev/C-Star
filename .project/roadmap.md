# Roadmap

Nguồn: `docs/Cong_Ty_C_GDD_v0.1.md`. File này chia GDD thành các cột mốc và Task ID. Chi tiết từng task nằm
trong `.tasks/`, trạng thái hiện tại ở `.project/CURRENT.md`.

Cập nhật: 2026-11-01. **M0–M6 xong, đang chạy công khai. Xem `.project/CURRENT.md`.**

---

## 1. Thứ tự làm và lý do

1. **Nền móng trước:** hai yêu cầu cứng của owner (PWA, lời cảnh báo) làm ngay từ đầu, để mọi thứ sau đó sinh
   ra đã offline được và đã nằm sau màn cảnh báo.
2. **Vui trước, đẹp sau:** chơi được Chương 1–2 bằng 2D rồi mới đầu tư đồ họa. Đây cũng là nguyên tắc của Alo.
3. **Điểm dừng ở cuối M1:** owner chơi thử, quyết định game có vui không và chốt góc nhìn (ADR-004).
4. **Hệ thống trước nội dung:** chương nào cần hệ thống gì thì hệ thống đó xong trước.

```text
M0 Nền móng → M1 Slice 2D → [owner chơi thử, chốt ADR-004] → M2 Chiều sâu → M3 Văn phòng 3D → M4 Trọn truyện → M5 Phát hành
```

Riêng M3 phụ thuộc ADR-004. Mọi cột mốc khác giữ nguyên dù chọn hướng nào.

**Đổi thứ tự (2026-11-01):** làm M4 trước M3. Owner yêu cầu làm liên tục không dừng hỏi, nên điểm dừng cuối M1 không còn. M4 không phụ
thuộc lớp hiển thị, còn M3 là việc tốn kém nhất và cần chốt ADR-004: làm xong cốt truyện trước để game hoàn chỉnh dù 3D có làm hay không.

---

## 2. M0 — Nền móng

Xong khi: mở web thấy màn cảnh báo, xác nhận rồi vào menu, cài được ra màn hình chính, tắt mạng vẫn mở được.

| Task                         | Mục tiêu                                                     | Nghiệm thu                                                              | Cần có   |
| ---------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------- | -------- |
| TECH-001-monorepo-foundation | Dựng pnpm + Turborepo, `web`, `game-core`, `content`, `e2e`, CI | `pnpm typecheck lint test build` xanh; static export chạy được; CI xanh | —        |
| FEAT-001-pwa-shell           | PWA cài được, precache toàn bộ bản build, cập nhật không ngắt lượt chơi | Chrome nhận là cài được; offline mở được; bản mới chỉ áp dụng khi bấm | TECH-001 |
| FEAT-002-disclaimer-gate     | Màn cảnh báo bắt buộc, có phiên bản, không có đường vòng     | Không vào được game nếu chưa xác nhận, kể cả bằng link trực tiếp        | TECH-001 |

---

## 3. M1 — Slice 2D: chơi được Chương 1–2

Xong khi: một người lạ chơi từ đầu tới ngày lương trễ mà không cần giải thích, tắt mở lại vẫn chơi tiếp được,
và muốn biết chuyện gì xảy ra tiếp.

| Task                         | Mục tiêu                                                                | Nghiệm thu                                                                 | Cần có        |
| ---------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------- |
| FEAT-003-story-engine        | Chạy cốt truyện dạng dữ liệu: cảnh, lựa chọn, điều kiện, hiệu ứng, seed | Validator chặn nhánh chết; cùng seed + lựa chọn cho cùng kết quả           | TECH-001      |
| FEAT-004-dialogue-ui         | Hộp thoại, chân dung, lựa chọn, chữ chạy, lựa chọn khóa có lý do        | Dùng một ngón tay trên điện thoại dọc; tua được; đọc được ở 360 px         | FEAT-003      |
| FEAT-005-weekly-loop         | Nhịp tháng–tuần, 3 lượt mỗi tuần, ngày lương                            | Hết lượt mới sang tuần; luật nằm hết trong `game-core`                     | FEAT-003      |
| FEAT-006-money-and-bills     | Tiền, hóa đơn tháng, sổ nợ công ty, HUD                                 | Tiền không âm; sổ nợ tăng đúng mỗi kỳ lương trễ                            | FEAT-005      |
| FEAT-007-energy-and-stress   | Năng lượng và căng thẳng, tác động của hành động                        | Chỉ số luôn trong biên; hiệu ứng thấy được trên HUD                        | FEAT-005      |
| FEAT-008-save-and-continue   | Autosave, tiếp tục, xuất/nhập save, migration                           | Tải lại ở mọi điểm không mất, không nhân đôi hiệu ứng; đúng `contracts/save.md` | FEAT-003, 005 |
| FEAT-009-chapter-1-dream-big | Viết và dựng Chương 1: offer, onboarding, họp công ty                   | Chơi trọn, qua Fiction Check, có cười                                      | FEAT-004…008  |
| FEAT-010-chapter-2-payment-delay | Viết và dựng Chương 2: ngày lương đầu tiên không có lương           | Chơi trọn; cú "ting" không đến thấy rõ; kết bằng một lời hứa               | FEAT-009      |

**Điểm dừng:** owner chơi thử, chỉnh số liệu, chốt ADR-004 trước khi sang M2.

---

## 4. M2 — Chiều sâu và Chương 3

Xong khi: lựa chọn ở Chương 1–2 thật sự đổi cách Chương 3 diễn ra.

| Task                                 | Mục tiêu                                                      | Nghiệm thu                                                 | Cần có             |
| ------------------------------------ | ------------------------------------------------------------- | ---------------------------------------------------------- | ------------------ |
| FEAT-011-relationships               | Quan hệ với sếp, HR, kế toán, từng đồng nghiệp                | Lựa chọn đổi quan hệ; quan hệ mở/khóa thoại                | FEAT-003           |
| FEAT-012-kpi-desk-minigame           | Mini-game tại bàn làm việc cho hành động "Làm task"           | Chơi được dưới 30 giây một lần; luật kiểm thử được         | FEAT-005           |
| FEAT-013-evidence-collection         | Thu thập bằng chứng, màn Hồ sơ                                | Bằng chứng mở lựa chọn; có thứ bỏ lỡ được                  | FEAT-003           |
| FEAT-014-crises                      | Khủng hoảng hết tiền và kiệt sức, khoản vay                   | Không game over cứng; tiền vẫn không âm                    | FEAT-006, 007      |
| FEAT-015-chapter-3-kpi-never-sleeps  | Viết và dựng Chương 3 (tháng 3–4)                             | Dùng đủ bốn hệ thống trên; chơi trọn                       | FEAT-011…014       |

---

## 5. M3 — Văn phòng 3D (ADR-004 đã chốt: Third Person, chạm để đi)

Xong khi: trên điện thoại tầm trung đi lại trong văn phòng mượt và nói chuyện được với NPC.

| Task                       | Mục tiêu                                                  | Nghiệm thu                                                    | Cần có   |
| -------------------------- | --------------------------------------------------------- | ------------------------------------------------------------- | -------- |
| TECH-002-3d-office-spike   | Đo R3F trên điện thoại, chốt ngân sách asset và tải offline | Có số FPS và dung lượng thật; quyết định đi tiếp hay không    | ADR-004  |
| FEAT-016-office-scene      | Bốn khu: văn phòng, phòng họp, bàn làm việc, hành lang    | Đúng không khí GDD §7, trong ngân sách                        | TECH-002 |
| FEAT-017-third-person-controls | Di chuyển bằng cảm ứng và bàn phím, camera              | Một tay điều khiển được trên điện thoại dọc                   | FEAT-016 |
| FEAT-018-characters        | Nhân vật low-poly: player, sếp, HR, kế toán, đồng nghiệp  | Nhận ra vai trò chỉ qua dáng và trang phục; không giống ai thật | FEAT-016 |
| FEAT-019-world-interactions | Tới gần là tương tác, hành động tuần gắn với vị trí       | Chơi được cả game trong 3D, luật `game-core` không đổi        | FEAT-017, 018 |

Nếu chọn Visual Novel: thay M3 bằng một task `FEAT-016-2d-art-pass` (nền, chân dung, biểu cảm).

---

## 6. M4 — Trọn cốt truyện

Xong khi: có script chơi tự động ra đủ sáu ending.

| Task                              | Mục tiêu                                                 | Nghiệm thu                                               | Cần có        |
| --------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | ------------- |
| FEAT-020-chapter-4-six-months-later | Chương 4: người rời đi, nhóm hình thành                | Đồng nghiệp rời đi tùy lượt chơi                         | FEAT-015      |
| FEAT-021-chapter-5-the-awakening  | Chương 5: đối chiếu, chọn cách yêu cầu                   | Bằng chứng thu được đổi diễn biến; đúng `contracts/content.md` §4 | FEAT-020 |
| FEAT-022-chapter-6-the-last-day   | Chương 6: lựa chọn cuối                                  | Đầy đủ các đường dẫn tới ending                          | FEAT-021      |
| FEAT-023-endings                  | Sáu ending và luật chọn theo thứ tự                      | Mỗi ending có một lượt chơi tự động đi tới               | FEAT-022      |
| FEAT-024-empty-promise-loop       | Vòng lặp "chúc mừng, lương lại trễ" của Ending 5         | Người chơi bị đưa về đầu đúng kiểu đùa; thoát được       | FEAT-023      |
| FEAT-025-ending-gallery           | Bộ sưu tập ending, thống kê lượt chơi, chơi lại nhanh    | Giữ qua các lượt; gợi ý ending chưa đạt                  | FEAT-023      |

---

## 7. M5 — Hoàn thiện và phát hành

Xong khi: người ngoài dùng link công khai, cài được, chơi hết được.

| Task                        | Mục tiêu                                                        | Nghiệm thu                                                      | Cần có    |
| --------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | --------- |
| FEAT-026-audio              | Nhạc nền, tiếng văn phòng, chuông ngân hàng                     | Tắt được; không tự phát trước tương tác                         | M4        |
| FEAT-027-settings-and-accessibility | Cỡ chữ, tốc độ chữ, âm lượng, giảm chuyển động, "Về game" | Đủ cho điện thoại nhỏ; xem lại được lời cảnh báo                | M4        |
| TECH-003-content-review     | Rà toàn bộ nội dung theo `contracts/content.md`, chốt tên game  | Không còn gì nhận diện được; tên đã tra; owner duyệt            | M4        |
| TECH-004-production-deploy  | Triển khai site tĩnh, HTTPS, quy trình phát hành bản mới        | Link công khai; cài thật được trên Android và iPhone; `/x` và `sw.js` đúng trên host; có cách rollback            | TECH-003  |

---

## 8. M6 — Nâng cấp đồ họa (ADR-005)

Owner yêu cầu sau khi game hoàn chỉnh. Xong khi: nhìn ảnh chụp là biết đây là game văn phòng có art direction, không phải khối hình.

| Task                        | Mục tiêu                                                     | Nghiệm thu                                                   | Cần có    |
| --------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | --------- |
| TECH-005-art-pipeline       | Blender → GLB → tối ưu → ngân sách → web, tái lập được       | Một lệnh dựng lại; vượt ngân sách thì đỏ                     | ADR-005   |
| FEAT-028-baked-office       | Văn phòng và nhà riêng, ánh sáng bake bằng Cycles            | Đọc ra từng khu GDD §7 từ mọi camera                         | TECH-005  |
| FEAT-029-rigged-characters  | 7 nhân vật có xương, đồng nghiệp ngồi ở bàn, hoạt ảnh bằng code | Nhận ra vai trò không cần tên                                | TECH-005  |
| FEAT-030-office-navigation  | Va chạm và tìm đường                                         | Không đi xuyên đồ; mọi điểm đều tới được                     | FEAT-028  |
| FEAT-031-office-in-game     | Đưa cảnh vào game, cấp đồ họa, tông màu theo tháng           | Không chặn truyện khi tải; offline chạy                      | FEAT-028, 029 |
| FEAT-032-rendered-2d-art    | Chân dung, nền 2D, màn mở đầu render bằng Blender            | Chế độ 2D thấy cùng một thế giới                             | FEAT-028, 029 |
| FEAT-033-game-ui-pass       | HUD, khung thoại, thẻ chương, chuyển cảnh, tablet và PC      | Đạt ux-direction, đọc được ở 360 px, không vỡ ở mọi cỡ       | FEAT-031  |
| FEAT-034-leadership-cast    | Chủ tịch, Phó giám đốc, Trưởng và Phó phòng, lời hứa, chuyện vay mượn | Có trong đủ các chương; bot vẫn tới đủ sáu ending    | FEAT-029  |
| FEAT-035-player-name        | Người chơi điền tên khi bắt đầu                              | Tên đi vào truyện và save; save cũ không hỏng                | FEAT-033  |

---

## 9. Để sau, chưa lên lịch

- AI NPC (GDD §8): cần ADR riêng về dịch vụ, chi phí và kiểm soát nội dung.
- Bản tiếng Anh.
- Đồng bộ save giữa thiết bị.
