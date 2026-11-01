/** Chương 4 — Six Months Later (GDD §3): tháng 5 và 6. */
export const chapter4Scenes = {
  'ch4-second-tranche': {
    id: 'ch4-second-tranche',
    place: 'desk',
    start: 'ting',
    nodes: {
      ting: {
        text: 'Ting. 3.000.000 đ. Nội dung: "UNG DOT 1 CUA DOT 2 LUONG T2 BU T3". Bạn đọc ba lần và hiểu ít hơn sau mỗi lần.',
        effects: [{ type: 'companyPays', amount: 3_000_000 }],
        next: 'accountant',
      },
      accountant: {
        speaker: 'accountant',
        text: 'Đừng hỏi chị. Chị đã xin nghỉ phép một tuần chỉ để không phải giải thích câu đó.',
        next: 'dan',
      },
      dan: {
        speaker: 'dan',
        text: 'Thấy chưa, dòng tiền bắt đầu chảy lại. Đây là chữ V, ông nhìn đáy rồi đấy.',
      },
    },
  },

  'ch4-khoa-leaves': {
    id: 'ch4-khoa-leaves',
    place: 'hallway',
    start: 'check',
    nodes: {
      check: {
        routes: [
          {
            when: {
              type: 'any',
              conditions: [
                { type: 'flag', flag: 'helpedKhoa' },
                { type: 'relation', npc: 'khoa', min: 20 },
              ],
            },
            next: 'khoa-tells',
          },
        ],
        otherwise: 'khoa-gone',
      },
      'khoa-tells': {
        speaker: 'khoa',
        text: 'Mình đi nha. Về quê phụ ba mẹ một thời gian. Bạn đừng nói với ai, mình... không muốn người ta thấy mình bỏ cuộc.',
        next: 'khoa-box',
      },
      'khoa-box': {
        text: 'Khoa đang xếp đồ vào một thùng giấy. Cái phích công ty tặng nằm trên cùng. Lần đầu tiên bạn thấy Khoa không cười.',
        next: 'khoa-gift',
      },
      'khoa-gift': {
        speaker: 'khoa',
        text: 'Mình từng tin tuần sau có lương. Ba mươi mấy tuần rồi đó. Mình gửi bạn file chấm công của nhóm mình, ai cần thì có. Bạn đừng tin như mình.',
        effects: [
          { type: 'addEvidence', evidence: 'timesheet' },
          { type: 'setFlag', flag: 'khoaSaidGoodbye' },
          { type: 'addStress', amount: 6 },
        ],
      },
      'khoa-gone': {
        text: 'Sáng thứ Hai, bàn Khoa trống trơn. Tên Khoa đã biến khỏi nhóm chat. Không ai biết từ lúc nào.',
        next: 'khoa-mug',
      },
      'khoa-mug': {
        text: 'Trên bàn còn lại đúng một cái phích. Bạn định nhắn hỏi thăm, rồi thấy mình chẳng có gì để nói.',
        effects: [{ type: 'addStress', amount: 6 }],
      },
    },
  },

  'ch4-date-passes': {
    id: 'ch4-date-passes',
    place: 'desk',
    start: 'date',
    nodes: {
      date: {
        text: 'Ngày 30 đến. Ngày 30 đi. Nó trôi qua êm đềm như một ngày bình thường, vì với công ty thì đúng là vậy.',
        next: 'mail',
      },
      mail: {
        speaker: 'hr',
        text: 'Thông báo chung: nhằm đảm bảo quyền lợi tốt nhất, lộ trình thanh toán được điều chỉnh linh hoạt. Công ty trân trọng sự đồng hành của cả nhà!',
        next: 'uyen',
      },
      uyen: {
        speaker: 'uyen',
        text: 'Lần thứ 7. Mình đếm rồi.',
      },
    },
  },

  'ch4-different-debts': {
    id: 'ch4-different-debts',
    place: 'hallway',
    start: 'coffee',
    nodes: {
      coffee: {
        text: 'Bạn và Uyên ngồi ở quán cóc đầu ngõ, cà phê 15 nghìn, thứ duy nhất ở quanh đây vẫn trả tiền đúng giá.',
        next: 'uyen-list',
      },
      'uyen-list': {
        speaker: 'uyen',
        text: 'Mình hỏi được mười một người. Không ai giống ai. Người được đợt 1, người chưa, người được ứng riêng. Chia nhỏ ra thì không ai biết mình bị nợ nhiều hay ít so với người khác.',
        next: 'reaction',
      },
      reaction: {
        speaker: 'player',
        text: 'Tức là mỗi người đang nghĩ mình là trường hợp đặc biệt?',
        next: 'uyen-reply',
      },
      'uyen-reply': {
        speaker: 'uyen',
        text: 'Ừ. Và trường hợp đặc biệt thì không ai đi hỏi người khác. Mình đang định gom mọi người lại, chỉ để so số liệu thôi.',
      },
    },
  },

  'ch4-group': {
    id: 'ch4-group',
    place: 'hallway',
    start: 'invite',
    nodes: {
      invite: {
        speaker: 'uyen',
        text: 'Tối thứ Năm, quán cũ, sáu người đã nhận lời. Không phải để làm căng. Chỉ là mang giấy tờ tới, xem mình đang ở đâu. Bạn đi không?',
        choices: [
          {
            id: 'join',
            text: 'Đi. Mình sẽ mang theo mọi thứ mình có',
            effects: [
              { type: 'setFlag', flag: 'joinedGroup' },
              { type: 'addRelation', npc: 'uyen', amount: 15 },
              { type: 'addRelation', npc: 'hr', amount: -6 },
            ],
            next: 'joined',
          },
          {
            id: 'decline',
            text: 'Thôi, mình không muốn dính vào chuyện này',
            effects: [{ type: 'addRelation', npc: 'uyen', amount: -10 }],
            next: 'declined',
          },
        ],
      },
      joined: {
        text: 'Tối thứ Năm, sáu người ngồi quanh một cái bàn nhựa, xếp giấy tờ thành chồng. Không ai nói to. Lần đầu tiên sau nhiều tháng, bạn không thấy mình đơn độc.',
      },
      declined: {
        text: 'Uyên không nói gì, chỉ gật đầu rồi quay về chỗ. Tối thứ Năm bạn ở nhà, xem đi xem lại số dư tài khoản.',
      },
    },
  },

  'ch4-dan-doubts': {
    id: 'ch4-dan-doubts',
    place: 'desk',
    start: 'dan',
    nodes: {
      dan: {
        text: 'Dân ngồi lì trước ba cửa sổ tin tức. Cả ba đều không có tin gì về công ty. Hôm nay ông không nói gì về chữ V.',
        next: 'dan-says',
      },
      'dan-says': {
        speaker: 'dan',
        text: 'Hôm qua tôi gọi cho người quen bên nhà đầu tư. Họ hỏi lại tôi: "Công ty nào?".',
        next: 'react',
      },
      react: {
        text: 'Lần đầu tiên bạn thấy ông không có câu trả lời cho điều gì đó.',
        choices: [
          {
            id: 'invite-dan',
            text: 'Rủ Dân tham gia nhóm của Uyên',
            requires: {
              type: 'all',
              conditions: [
                { type: 'flag', flag: 'joinedGroup' },
                { type: 'relation', npc: 'dan', min: 12 },
              ],
            },
            lockedReason: 'Bạn chưa ở trong nhóm, hoặc Dân chưa đủ tin bạn',
            effects: [
              { type: 'setFlag', flag: 'danJoined' },
              { type: 'addRelation', npc: 'dan', amount: 10 },
            ],
            next: 'dan-joins',
          },
          {
            id: 'comfort',
            text: 'Vỗ vai ông: "Chắc chỉ là nhầm thôi"',
            effects: [{ type: 'addRelation', npc: 'dan', amount: 3 }],
            next: 'dan-alone',
          },
        ],
      },
      'dan-joins': {
        speaker: 'dan',
        text: 'Tôi có bảng theo dõi dòng tiền từ hai năm nay. Toàn bằng tin đồn, nhưng ngày tháng thì chuẩn. Để tôi mang tới.',
      },
      'dan-alone': {
        speaker: 'dan',
        text: 'Ừ. Chắc thế. Chắc là nhầm.',
      },
    },
  },

  'ch4-six-months': {
    id: 'ch4-six-months',
    place: 'home',
    start: 'date',
    nodes: {
      date: {
        text: 'Hơn sáu tháng rồi. Bạn mở lại email "Hành trình phi thường của bạn bắt đầu từ đây". Bạn đã từng thấy nó vui đến thế.',
        next: 'debt',
      },
      debt: {
        text: 'Bạn cộng lại mọi tháng bị nợ. Hóa ra bạn không còn là nhân viên nữa. Bạn là nhà đầu tư thiên thần bất đắc dĩ của công ty này.',
        next: 'decide',
      },
      decide: {
        speaker: 'player',
        text: 'Ngày đó mình đi tìm một công việc tốt. Giờ mình đang đi tìm tiền lương của chính mình. Làm gì tiếp đây?',
        choices: [
          {
            id: 'act',
            text: 'Thôi đợi. Từ giờ mình sẽ hành động',
            effects: [
              { type: 'setFlag', flag: 'decidedToAct' },
              { type: 'addStress', amount: -6 },
            ],
            next: 'acting',
          },
          {
            id: 'wait',
            text: 'Đợi thêm một tháng nữa, biết đâu',
            effects: [{ type: 'addRelation', npc: 'boss', amount: 4 }],
            next: 'waiting',
          },
        ],
      },
      acting: {
        text: 'Bạn tạo một thư mục mới, đặt tên là "Của mình". Chỉ vậy thôi. Nhưng đêm đó bạn ngủ được.',
      },
      waiting: {
        text: 'Bạn đóng laptop. "Biết đâu" là từ đắt nhất bạn từng dùng, tính theo lãi suất.',
      },
    },
  },
};
