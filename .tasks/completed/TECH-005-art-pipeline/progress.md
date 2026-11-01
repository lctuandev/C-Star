# TECH-005-art-pipeline — Progress

## 2026-11-01

- Dựa trên `tools/world-pipeline` của Alo, nhưng nhỏ hơn nhiều: không cần chunk, instancing hay KTX2.
- Đã thử trước trên cảnh nhỏ: Blender giữ UV thứ hai trong GLB chỉ khi có texture dùng UV đó, nên lightmap đi qua khe occlusion.
- Cycles không có denoise cho bake: chạy Open Image Denoise qua compositor sau khi bake, 3 giây.
