# Test — TECH-002-3d-office-spike

## 2026-11-01

| Số đo                                               | Kết quả                 |
| --------------------------------------------------- | ----------------------- |
| Precache toàn bản build                              | 2,03 MB, 66 file        |
| Chunk three.js và fiber                              | 904 KB, gzip 238 KB     |
| Draw call ước tính sau khi instancing bàn            | khoảng 55               |
| FPS, render bằng CPU (SwiftShader), máy 8 nhân, 390 × 844 | 59,5                |
| JS heap                                              | 16 MB                   |
| Điện thoại tầm trung thật                            | NOT TESTED              |

SwiftShader trên máy tính không đại diện cho điện thoại: đây chỉ cho thấy scene nhẹ. Quyết định: **đi tiếp**, kèm chế độ Tự động lùi về 2D dưới 18 FPS để chặn rủi ro chưa đo được.
