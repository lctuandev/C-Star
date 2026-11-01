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
            effects: [
              { type: 'setFlag', flag: 'readContract' },
              { type: 'addEvidence', evidence: 'contract' },
            ],
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

  'ch1-first-day': {
    id: 'ch1-first-day',
    place: 'office',
    start: 'lobby',
    nodes: {
      lobby: {
        text: 'Sảnh công ty có một bức tường cây, một máy pha cà phê to bằng cái tủ lạnh, và dòng chữ inox: "CHÚNG TA KHÔNG ĐI LÀM. CHÚNG TA ĐI XÂY TƯƠNG LAI".',
        next: 'hr-welcome',
      },
      'hr-welcome': {
        speaker: 'hr',
        text: 'Em đây rồi! Chị gửi em bộ quà chào mừng: áo thun, sổ tay, và một cuốn "Sổ tay giá trị cốt lõi" dày 96 trang.',
        next: 'core-values',
      },
      'core-values': {
        speaker: 'hr',
        text: 'Giá trị số một là Tận Tâm. Giá trị số hai là Tận Tụy. Giá trị số ba thì đang được ban lãnh đạo cân nhắc.',
        next: 'desk-tour',
      },
      'desk-tour': {
        text: 'Chị HR dẫn bạn tới khu làm việc. Ba người ngẩng lên khỏi màn hình. Có ba ghế trống, và bạn phải chọn một.',
        next: 'pick-seat',
      },
      'pick-seat': {
        speaker: 'hr',
        text: 'Em ngồi đâu cũng được, ở đây mình phẳng lắm. Trừ phòng sếp ra.',
        choices: [
          {
            id: 'near-dan',
            text: 'Ngồi cạnh Dân, người đang mở ba cửa sổ tin tức tài chính',
            effects: [
              { type: 'setFlag', flag: 'satWithDan' },
              { type: 'addRelation', npc: 'dan', amount: 10 },
            ],
            next: 'meet-dan',
          },
          {
            id: 'near-uyen',
            text: 'Ngồi cạnh Uyên, người có tập hồ sơ dán nhãn rất ngay ngắn',
            effects: [
              { type: 'setFlag', flag: 'satWithUyen' },
              { type: 'addRelation', npc: 'uyen', amount: 10 },
            ],
            next: 'meet-uyen',
          },
          {
            id: 'near-khoa',
            text: 'Ngồi cạnh Khoa, người đang cười với cái màn hình',
            effects: [
              { type: 'setFlag', flag: 'satWithKhoa' },
              { type: 'addRelation', npc: 'khoa', amount: 10 },
            ],
            next: 'meet-khoa',
          },
        ],
      },
      'meet-dan': {
        speaker: 'dan',
        text: 'Lính mới à? Khôn đấy. Ngồi đây nghe được tin trước. Công ty sắp gọi vốn, đợt này to lắm, ông nghe tôi.',
        next: 'all-three',
      },
      'meet-uyen': {
        speaker: 'uyen',
        text: 'Chào bạn. Nhớ lưu lại email xác nhận công việc nhé. Không có gì đâu, mình quen tay thôi.',
        next: 'all-three',
      },
      'meet-khoa': {
        speaker: 'khoa',
        text: 'Ủa bạn mới hả! Ở đây vui lắm! Năm ngoái mình còn được đi team building, ngủ lều, sếp hát bài của sếp!',
        next: 'all-three',
      },
      'all-three': {
        text: 'Cả ba bắt tay bạn. Ai cũng tử tế theo một kiểu hơi mệt mỏi.',
        next: 'first-task',
      },
      'first-task': {
        speaker: 'hr',
        text: 'À, tài khoản của em mất ba ngày mới có. Trong lúc chờ, em đọc Sổ tay giá trị cốt lõi nhé. Tuần sau có họp toàn công ty, sếp sẽ chia sẻ tầm nhìn.',
      },
    },
  },

  'ch1-town-hall': {
    id: 'ch1-town-hall',
    place: 'meeting',
    start: 'room',
    nodes: {
      room: {
        text: 'Cả công ty chen vào phòng họp lớn. Máy chiếu hiện chữ TẦM NHÌN 2030, cỡ chữ to hơn cả bạn.',
        next: 'boss-opens',
      },
      'boss-opens': {
        speaker: 'boss',
        text: 'Các bạn ơi. Ở C*, chúng ta không làm việc vì tiền. Tiền chỉ là hệ quả. Chúng ta ở đây để thay đổi cách cả ngành này vận hành.',
        next: 'boss-chart',
      },
      'boss-chart': {
        speaker: 'boss',
        text: 'Biểu đồ này đi lên. Tôi sẽ không nói nó là biểu đồ gì, nhưng nó đi lên. Đó là chúng ta.',
        next: 'boss-family',
      },
      'boss-family': {
        speaker: 'boss',
        text: 'Và tôi muốn nói điều này từ trái tim: ở đây không có nhân viên. Chúng ta là một gia đình. Có ai muốn chia sẻ gì không?',
        next: 'react',
      },
      react: {
        text: 'Cả phòng im lặng. Khoa vỗ tay một mình rồi thấy ngại. Bạn thấy mắt sếp lướt về phía mình.',
        choices: [
          {
            id: 'clap',
            text: 'Vỗ tay thật to',
            effects: [
              { type: 'setFlag', flag: 'clappedForBoss' },
              { type: 'addRelation', npc: 'boss', amount: 8 },
            ],
            next: 'after-clap',
          },
          {
            id: 'ask-pay',
            text: 'Giơ tay: "Dạ cho em hỏi, lương mình trả ngày mấy ạ?"',
            effects: [
              { type: 'setFlag', flag: 'askedAboutPay' },
              { type: 'addStress', amount: 5 },
              { type: 'addRelation', npc: 'boss', amount: -5 },
            ],
            next: 'after-ask',
          },
          { id: 'look-down', text: 'Cúi xuống ghi chép vào sổ tay', next: 'after-note' },
        ],
      },
      'after-clap': {
        speaker: 'boss',
        text: 'Đấy. Năng lượng như thế. Bạn này tên gì? Thôi không cần, tôi nhớ rồi.',
        next: 'close',
      },
      'after-ask': {
        speaker: 'boss',
        text: 'Câu hỏi hay. Rất thực tế. Nhưng các bạn phải nhìn xa hơn ngày mùng 5. Tất nhiên là có lương, chúng ta là một gia đình mà.',
        next: 'after-ask-room',
      },
      'after-ask-room': {
        text: 'Cả phòng cười. Không ai trả lời con số. Sau này bạn sẽ nhớ lại rằng đó là lần đầu tiên.',
        next: 'close',
      },
      'after-note': {
        text: 'Bạn viết "tầm nhìn" vào sổ, gạch chân hai lần, rồi vẽ một cái biểu đồ đi lên. Trông bạn rất có tinh thần.',
        next: 'close',
      },
      close: {
        speaker: 'boss',
        text: 'Cảm ơn cả nhà. Quý này chúng ta bứt phá. Mọi người về làm việc đi, tầm nhìn không tự xây được đâu.',
      },
    },
  },

  'ch1-fruit-friday': {
    id: 'ch1-fruit-friday',
    place: 'hallway',
    start: 'fruit',
    nodes: {
      fruit: {
        text: 'Thứ Sáu. Ở góc hành lang có một khay trái cây thật: xoài, nho, cả dâu tây. Bạn đứng nhìn nó một lúc lâu.',
        next: 'dan-talks',
      },
      'dan-talks': {
        speaker: 'dan',
        text: 'Ăn đi. Đợt trước còn có sầu riêng cơ. Công ty mà vào vòng gọi vốn này thì còn hơn nữa.',
        next: 'uyen-talks',
      },
      'uyen-talks': {
        speaker: 'uyen',
        text: 'Khay năm ngoái to gấp đôi.',
        next: 'khoa-talks',
      },
      'khoa-talks': {
        speaker: 'khoa',
        text: 'Thì tại mùa thôi! Trái cây cũng có mùa mà Uyên!',
        next: 'thought',
      },
      thought: {
        text: 'Bạn lấy một quả dâu. Ngọt thật. Bạn nghĩ: có lẽ mình đã chọn đúng nơi.',
        effects: [{ type: 'addStress', amount: -5 }],
      },
    },
  },

  'ch1-payday': {
    id: 'ch1-payday',
    place: 'desk',
    start: 'waiting',
    nodes: {
      waiting: {
        text: 'Ngày mùng 5. 10 giờ 41 phút. Điện thoại kêu một tiếng "ting" mà sau này bạn sẽ nhớ như nhớ một người cũ.',
        next: 'bank',
      },
      bank: {
        text: '+15.000.000 đ. Nội dung: "CT C STAR TRA LUONG T1". Bạn đọc lại ba lần. Con số đẹp hơn mọi biểu đồ của sếp.',
        next: 'what-now',
      },
      'what-now': {
        speaker: 'player',
        text: 'Tháng đầu tiên. Làm gì với nó nhỉ?',
        choices: [
          {
            id: 'treat-team',
            text: 'Mời cả nhóm ăn trưa',
            effects: [
              { type: 'addCash', amount: -600_000 },
              { type: 'addStress', amount: -8 },
              { type: 'setFlag', flag: 'treatedTeam' },
              { type: 'addRelation', npc: 'dan', amount: 5 },
              { type: 'addRelation', npc: 'uyen', amount: 5 },
              { type: 'addRelation', npc: 'khoa', amount: 5 },
            ],
            next: 'treat',
          },
          {
            id: 'send-home',
            text: 'Gửi về cho mẹ một ít',
            effects: [
              { type: 'addCash', amount: -2_000_000 },
              { type: 'addStress', amount: -5 },
              { type: 'setFlag', flag: 'sentHome' },
            ],
            next: 'home',
          },
          {
            id: 'save-it',
            text: 'Để dành hết, phải biết lo xa',
            effects: [{ type: 'setFlag', flag: 'savedFirstPay' }],
            next: 'save',
          },
        ],
      },
      treat: {
        text: 'Cả nhóm ăn cơm tấm, Khoa gọi thêm trứng. Uyên bảo lần đầu có lính mới mời trước. Bạn thấy mình thuộc về nơi này.',
        next: 'end',
      },
      home: {
        text: 'Mẹ nhắn lại: "Con giữ mà ăn uống cho đàng hoàng". Rồi mười phút sau: "Công ty tốt không con?". Bạn trả lời: "Tốt lắm mẹ".',
        next: 'end',
      },
      save: {
        text: 'Bạn chuyển hết sang tài khoản tiết kiệm, thấy mình trưởng thành hẳn. Cuối cùng cũng có một quyết định tài chính mà sau này không hối hận.',
        next: 'end',
      },
      end: {
        text: 'Bạn mở lịch, đánh dấu ngày mùng 5 tháng sau, rồi vẽ thêm một trái tim nhỏ.',
      },
    },
  },
};
