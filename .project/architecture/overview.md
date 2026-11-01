# System Architecture Overview

## 1. Mục đích

Mô tả kiến trúc tổng thể để luật chơi tất định và kiểm thử được, nội dung tách khỏi code, và phiên làm việc mới
hiểu được hệ thống trước khi sửa. Phần lý do nằm ở ADR.

---

## 2. Tổng quan

Game chạy hoàn toàn trong trình duyệt. Không có server.

```text
packages/content (dữ liệu truyện, câu chữ pháp lý)
        ↓ được validate lúc build
packages/game-core (GameState, story engine, luật)
        ↓ gọi qua store
apps/web/features (hook, Zustand, UI)
        ↓
apps/web/app (route)         save: IndexedDB      service worker: precache toàn bộ bản build
```

---

## 3. Các package

| Package             | Trách nhiệm                                               | Không được làm                         |
| ------------------- | --------------------------------------------------------- | -------------------------------------- |
| `packages/game-core` | GameState, hành động, điều kiện, hiệu ứng, ending, RNG   | Import React, Next, Three, truy cập IO |
| `packages/content`  | Cảnh, thoại, hóa đơn, bằng chứng, lời cảnh báo, schema, validator | Chứa logic luật chơi           |
| `apps/web`          | Route, UI, input, âm thanh, save, PWA                     | Chứa luật chơi                         |
| `apps/e2e`          | Playwright, chơi thật trên viewport điện thoại và laptop  |                                        |
| `packages/config`   | tsconfig, ESLint                                          |                                        |

ESLint `pureDomainConfig` như Alo: `game-core` không được import thư viện UI hay IO.

---

## 4. Luồng một hành động

```text
Người chơi bấm → store gọi game-core: applyAction(state, action)
→ game-core kiểm tra hợp lệ, trả về state mới và danh sách sự kiện
→ store lưu state, autosave, UI vẽ lại và chạy hiệu ứng theo sự kiện
```

`applyAction` là hàm thuần. Mọi ngẫu nhiên đi qua RNG nằm trong state.

---

## 5. Điều hướng

```text
Mọi route → DisclaimerGate → chưa xác nhận: màn cảnh báo, ngay tại địa chỉ đó → xác nhận → nội dung của route
Menu → Game mới → cảnh báo lại → /play
```

`DisclaimerGate` bọc `children` ở root layout (`features/disclaimer`), không dùng route riêng hay redirect, nên route
thêm sau này tự nằm sau cổng. Static HTML chưa biết thiết bị đã xác nhận chưa, nên cổng không vẽ gì cho tới khi trình
duyệt kiểm tra.

---

## 6. PWA

Xem ADR-002. `apps/web/scripts/build-sw.mjs` chạy sau `next build`, ghép danh sách toàn bộ file vào
`features/pwa/sw.template.js` thành `out/sw.js`. Cập nhật chỉ áp dụng khi người chơi đồng ý, chờ tối đa 10 giây rồi
reload. Save không đi qua cache. Phát triển không dùng service worker.

---

## 7. Tài liệu liên quan

- Luật và trạng thái: `architecture/gameplay.md`
- Hợp đồng: `contracts/gameplay.md`, `contracts/save.md`, `contracts/content.md`
- Quyết định: `decisions/`
