export interface PolicySection {
  title: string;
  body: string;
}

export const policyUpdated = '02/11/2026';

export const issuesUrl = 'https://github.com/lctuandev/C-Star/issues';

/** Everything here must stay true of the build: no account, no analytics, nothing sent anywhere. */
export const policySections: readonly PolicySection[] = [
  {
    title: 'Tác phẩm hư cấu',
    body: 'Mọi công ty, nhân vật, số liệu và sự kiện trong game đều do tác giả tưởng tượng, không phải thông tin thật và không nhắm vào bất kỳ cá nhân hay tổ chức nào. Nếu có trùng hợp, đó chỉ là ngẫu nhiên.',
  },
  {
    title: 'Không phải tư vấn',
    body: 'Các tình huống về lương, nợ và giấy tờ trong game chỉ để kể chuyện, không phải tư vấn pháp lý, lao động hay tài chính. Nếu gặp chuyện tương tự ngoài đời, hãy hỏi người có chuyên môn.',
  },
  {
    title: 'Dữ liệu của bạn',
    body: 'Game không có tài khoản, không có quảng cáo và không dùng công cụ theo dõi. Tên bạn điền và tiến trình chơi chỉ lưu trên thiết bị của bạn, không gửi đi đâu. Muốn xóa, hãy xóa dữ liệu của trang web này trong trình duyệt. Khi bạn mở trang, máy chủ và Cloudflare có thể ghi nhật ký kỹ thuật như địa chỉ IP, và có thể đặt cookie kỹ thuật để vận hành và chống tấn công.',
  },
  {
    title: 'Độ tuổi và sức khỏe',
    body: 'Khuyến nghị từ 16 tuổi, theo đánh giá của tác giả: game có hài đen về nợ lương, vay mượn và áp lực công việc. Hãy chơi vừa phải và nghỉ mắt sau mỗi giờ chơi.',
  },
  {
    title: 'Ủng hộ tác giả',
    body: 'Game miễn phí. Khoản ủng hộ hoàn toàn tự nguyện, chuyển thẳng tới tài khoản cá nhân của tác giả qua ứng dụng ngân hàng của bạn. Đây không phải giao dịch mua bán: không mở thêm nội dung, không có quyền lợi trong game và không hoàn lại. Trang web không đọc hay lưu thông tin thanh toán của bạn. Hãy kiểm tra tên người nhận trước khi chuyển.',
  },
  {
    title: 'Bản quyền',
    body: 'Lời thoại, hình ảnh, nhạc và mã nguồn thuộc về tác giả. Hiệu ứng âm thanh dùng bản ghi phát hành theo CC0, phông chữ Be Vietnam Pro dùng giấy phép mở SIL.',
  },
  {
    title: 'Liên hệ',
    body: 'Góp ý, báo lỗi hoặc yêu cầu về nội dung, hãy gửi tại trang GitHub của dự án.',
  },
];
