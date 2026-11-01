/** Chương 1 — Dream Big (GDD §3). Checked by the schema in ../index.ts. */
export const chapter1Scenes = {
  'ch1-offer': {
    id: 'ch1-offer',
    place: 'home',
    start: 'mail',
    nodes: {
      mail: {
        text: 'Thứ Hai, 7 giờ 12 phút. Điện thoại rung. Một email có tiêu đề: "Chúc mừng! Hành trình phi thường của bạn bắt đầu từ đây".',
        next: 'offer',
      },
      offer: {
        text: 'Công ty C*. Vị trí: Chuyên viên. Lương: 15 triệu. Phúc lợi: "văn hóa gia đình, cơ hội không giới hạn, trái cây thứ Sáu".',
        next: 'reaction',
      },
      reaction: {
        speaker: 'player',
        text: 'Trái cây thứ Sáu. Mình chưa từng được đối xử tử tế như vậy.',
        choices: [
          {
            id: 'accept-fast',
            text: 'Bấm "Chấp nhận" ngay, sợ họ đổi ý',
            effects: [{ type: 'setFlag', flag: 'eagerHire' }],
            next: 'accepted',
          },
          {
            id: 'read-contract',
            text: 'Đọc hết hợp đồng trước đã',
            effects: [{ type: 'setFlag', flag: 'readContract' }],
            next: 'fine-print',
          },
        ],
      },
      'fine-print': {
        text: 'Trang 14, cỡ chữ 6: "Thời điểm thanh toán có thể được điều chỉnh để phù hợp với lộ trình phát triển chung".',
        next: 'fine-print-thought',
      },
      'fine-print-thought': {
        speaker: 'player',
        text: 'Chắc là mẫu chung thôi. Công ty lớn ai lại ghi thế để làm thật.',
        next: 'accepted',
      },
      accepted: {
        routes: [{ when: { type: 'flag', flag: 'readContract' }, next: 'signed-careful' }],
        otherwise: 'signed-eager',
      },
      'signed-careful': {
        text: 'Bạn ký. Bản PDF nằm gọn trong thư mục "Giấy tờ". Bạn không biết đây là việc khôn ngoan nhất mình làm trong năm nay.',
        next: 'reply',
      },
      'signed-eager': {
        text: 'Bạn ký trong 11 giây. Một kỷ lục mới của phòng Nhân sự, họ gửi ngay một sticker tràng pháo tay.',
        next: 'reply',
      },
      reply: {
        speaker: 'hr',
        text: 'Chào mừng bạn đến với đại gia đình C*! Thứ Hai tuần sau đi làm nhé. Nhớ mang theo đam mê!',
      },
    },
  },
};
