# FEAT-031-office-in-game — Plan

Trạng thái: COMPLETED

## Objective

Đưa cảnh mới vào game, vẫn chạy được trên máy yếu.

## Scope

Tải GLB + lightmap, màn hình bật theo số bàn còn người, đèn nháy, tông màu theo tháng, bụi trong nắng, cấp đồ họa cao/thấp trước khi lùi 2D, lỗi tải thì lùi 2D.

## Non-goals

Bóng thời gian thực, hậu kỳ.

## Affected systems

Xem ADR-005.

## Acceptance criteria

Không chặn cốt truyện khi đang tải; E2E 3D xanh; offline vẫn chạy.

## Risks

Chưa đo được trên điện thoại thật: bản build có Tự động lùi cấp đồ họa.

## Dependencies

ADR-005.
