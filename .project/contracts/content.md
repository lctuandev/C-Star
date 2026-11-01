# Content Contract

Ranh giới cho mọi nội dung người chơi nhìn thấy: thoại, tên, hình, âm thanh, metadata cửa hàng. Đổi hợp đồng
này phải qua ADR-003.

---

## 1. Không bao giờ có trong game

- Tên, logo, màu thương hiệu, sản phẩm, địa chỉ, tên miền của công ty có thật.
- Tên, ảnh, giọng nói, chức danh cụ thể, đặc điểm nhận dạng của người có thật.
- Con số có thật: mức lương, khoản nợ, ngày tháng, số nhân viên, tên dự án, tên khách hàng.
- Câu nói, email, tin nhắn, tài liệu có thật, kể cả khi đã đổi tên.
- Sự kiện có thật được kể lại đủ chi tiết để người trong cuộc nhận ra.
- Lời khẳng định một công ty thật đã làm điều gì.

## 2. Được phép

- Tình huống phổ biến ở nhiều nơi: lương trễ, KPI vô lý, lời hứa mơ hồ, họp không kết luận.
- Nhân vật biểu tượng và tình huống phóng đại để gây cười.
- Tên công ty, sản phẩm và người hoàn toàn hư cấu, đã tra để chắc không trùng một công ty có thật cùng ngành.

## 3. Giọng văn

- Đùa vào tình huống và hệ thống, không đùa vào ngoại hình, giới tính, vùng miền, tôn giáo, bệnh tật.
- Nhân vật phản diện vẫn là con người, không bôi nhọ.
- Có chuyện nghiêm túc thì được phép nghiêm túc. Kiệt sức và tiền bạc không phải lúc nào cũng là trò cười.

## 4. Thông tin về quyền lợi lao động

Game có thể nhắc rằng người lao động có quyền lưu giữ giấy tờ và tìm tư vấn, nhưng **không phải tư vấn pháp lý**:

- Không nêu điều luật, thời hạn, mức bồi thường cụ thể như sự thật.
- Không dạy cách lấy tài liệu trái phép. Bằng chứng trong game là giấy tờ của chính nhân vật.
- Màn kết nhắc: game không thay thế tư vấn từ người có chuyên môn.

## 5. Lời cảnh báo

Câu chữ duy nhất, nguồn gốc nằm ở `packages/content` (FEAT-002):

> Đây là tác phẩm giải trí hư cấu. Mọi công ty, nhân vật, số liệu và sự kiện trong game đều do tác giả tưởng
> tượng, không phải thông tin thật và không nhắm vào bất kỳ cá nhân hay tổ chức nào. Nếu có sự trùng hợp, đó
> chỉ là ngẫu nhiên. Game không phải là tư vấn pháp lý.

Quy tắc:

- Hiện trước khi người chơi vào game, phải bấm xác nhận mới đi tiếp.
- Hiện lại khi bắt đầu game mới và khi câu chữ đổi phiên bản.
- Luôn xem lại được ở "Về game" và ở màn kết.
- Không có đường nào vào game mà bỏ qua được, kể cả link trực tiếp hay save đang có.

## 6. Kiểm tra

Mọi task nội dung phải trả lời trong `plan.md`, mục Fiction Check: nội dung này có nhận diện được ai không?
Trước khi phát hành, TECH-003 rà toàn bộ.
