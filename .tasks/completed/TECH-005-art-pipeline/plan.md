# TECH-005-art-pipeline — Plan

Trạng thái: COMPLETED

## Objective

Pipeline tái lập: Blender dựng → GLB → tối ưu → kiểm ngân sách → xuất vào web.

## Scope

`tools/art-pipeline`: script Blender dùng chung, tối ưu bằng gltf-transform (Meshopt, WebP), validator ngân sách, xưởng ảnh chụp game (`shots`).

## Non-goals

Không dùng asset bên thứ ba. Không chạy Blender trong CI.

## Affected systems

Xem ADR-005.

## Acceptance criteria

Một lệnh dựng lại toàn bộ; vượt ngân sách thì exit 1; CI kiểm ngân sách trên file đã commit.

## Risks

Chưa đo được trên điện thoại thật: bản build có Tự động lùi cấp đồ họa.

## Dependencies

ADR-005.
