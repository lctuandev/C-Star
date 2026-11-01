/** Chương 3 — KPI Never Sleeps (GDD §3): tháng 3 và 4. */
export const chapter3Scenes = {
  'ch3-kpi-launch': {
    id: 'ch3-kpi-launch',
    place: 'meeting',
    start: 'slide',
    nodes: {
      slide: {
        text: 'Họp toàn công ty. Máy chiếu hiện dòng chữ: THỬ THÁCH 100 NGÀY BỨT PHÁ. Không có dòng nào về tiền.',
        next: 'boss-hard',
      },
      'boss-hard': {
        speaker: 'boss',
        text: 'Tình hình thị trường có chút thách thức. Nhưng thách thức là cơ hội mặc đồ lao động. Từ tháng này, mỗi người có KPI riêng.',
        next: 'boss-kpi',
      },
      'boss-kpi': {
        speaker: 'boss',
        text: 'KPI không phải để gây áp lực. KPI để các bạn thấy mình đang lớn lên từng ngày.',
        next: 'react',
      },
      react: {
        text: 'Có tiếng ghế xê dịch. Lần này nhiều người nhìn nhau hơn là nhìn màn hình.',
        choices: [
          {
            id: 'ask-salary',
            text: '"Dạ thế lương tháng trước thì sao anh?"',
            effects: [
              { type: 'addRelation', npc: 'boss', amount: -8 },
              { type: 'addRelation', npc: 'uyen', amount: 6 },
              { type: 'addRelation', npc: 'dan', amount: 3 },
              { type: 'setFlag', flag: 'askedBossSalary' },
            ],
            next: 'boss-dodge',
          },
          {
            id: 'volunteer',
            text: '"Dạ em đăng ký chỉ tiêu cao nhất ạ"',
            effects: [
              { type: 'addRelation', npc: 'boss', amount: 10 },
              { type: 'addRelation', npc: 'uyen', amount: -4 },
              { type: 'setFlag', flag: 'volunteeredKpi' },
            ],
            next: 'boss-praise',
          },
          { id: 'quiet', text: 'Im lặng ghi chỉ tiêu vào sổ', next: 'close' },
        ],
      },
      'boss-dodge': {
        speaker: 'boss',
        text: 'Các bạn phải nhìn xa hơn vấn đề trước mắt. Lương là chuyện của tháng. Bứt phá là chuyện của thập kỷ.',
        next: 'close',
      },
      'boss-praise': {
        speaker: 'boss',
        text: 'Đấy, tinh thần của người sẽ đi cùng công ty tới IPO. Cả nhà vỗ tay cho bạn này.',
        next: 'close',
      },
      close: {
        speaker: 'hr',
        text: 'Về vấn đề lương, công ty sẽ có thông tin trong tuần sau ạ. Cả nhà tiếp tục cố gắng nhé!',
      },
    },
  },

  'ch3-first-tranche': {
    id: 'ch3-first-tranche',
    place: 'desk',
    start: 'ting',
    nodes: {
      ting: {
        text: 'Ting. Tim bạn đập một nhịp. 4.500.000 đ. Nội dung: "TAM UNG DOT 1 LUONG T2".',
        effects: [{ type: 'companyPays', amount: 4_500_000 }],
        next: 'accountant',
      },
      accountant: {
        speaker: 'accountant',
        text: 'Đợt 1 là 30% của tháng 2. Đợt 2 sẽ chuyển khi đợt 1 của tháng 3 hoàn tất, trừ phần đã ứng cho đợt 1 của đợt trước. Em hiểu chứ?',
        next: 'hmm',
      },
      hmm: {
        speaker: 'player',
        text: 'Dạ... chắc là không ạ.',
        next: 'accountant-2',
      },
      'accountant-2': {
        speaker: 'accountant',
        text: 'Không sao. Chị cũng không. Chị chỉ nhập số thôi.',
        next: 'uyen-idea',
      },
      'uyen-idea': {
        speaker: 'uyen',
        text: 'Mình ghi lại từng khoản, từng lời hứa, ngày giờ đầy đủ. Bạn muốn làm cùng không? Có gì còn biết mình đang được nợ bao nhiêu.',
        choices: [
          {
            id: 'start-notes',
            text: 'Được, mình bắt đầu từ hôm nay',
            effects: [
              { type: 'setFlag', flag: 'startedNotes' },
              { type: 'addRelation', npc: 'uyen', amount: 12 },
            ],
            next: 'notes-start',
          },
          {
            id: 'not-yet',
            text: 'Làm thế có căng quá không, để xem sao đã',
            effects: [{ type: 'addRelation', npc: 'uyen', amount: -3 }],
            next: 'notes-later',
          },
        ],
      },
      'notes-start': {
        text: 'Uyên gửi bạn một mẫu ghi chép rất gọn. Từ giờ, trong tuần bạn có thể dành một lượt để lưu lại giấy tờ của mình.',
      },
      'notes-later': {
        text: 'Uyên gật đầu, không nói gì thêm. Bạn thấy nhẹ người, và hơi có lỗi với chính mình của ba tháng sau.',
      },
    },
  },

  'ch3-side-rumor': {
    id: 'ch3-side-rumor',
    place: 'hallway',
    start: 'corner',
    nodes: {
      corner: {
        text: 'Góc hành lang. Khay trái cây thứ Sáu giờ chỉ còn một nải chuối, và một tờ giấy: "Mỗi người một quả, vì sự bền vững".',
        next: 'dan-news',
      },
      'dan-news': {
        speaker: 'dan',
        text: 'Tin nội bộ: nhà đầu tư đã ký biên bản ghi nhớ. Tức là họ nhớ. Tuần sau tiền về, tôi nói rồi đấy.',
        next: 'khoa-rent',
      },
      'khoa-rent': {
        speaker: 'khoa',
        text: 'Mọi người ơi, tháng này ai dư, cho mình mượn tạm tiền nhà được không? Tuần sau có lương là mình trả liền.',
        next: 'react',
      },
      react: {
        text: 'Khoa vẫn cười. Nhưng đây là lần đầu bạn thấy Khoa cười mà mắt không cười theo.',
        choices: [
          {
            id: 'lend',
            text: 'Cho Khoa mượn 1 triệu',
            effects: [
              { type: 'addCash', amount: -1_000_000 },
              { type: 'addRelation', npc: 'khoa', amount: 18 },
              { type: 'addRelation', npc: 'uyen', amount: 3 },
              { type: 'setFlag', flag: 'helpedKhoa' },
            ],
            next: 'lent',
          },
          {
            id: 'sorry',
            text: 'Xin lỗi, mình cũng đang kẹt',
            effects: [{ type: 'addRelation', npc: 'khoa', amount: -2 }],
            next: 'refused',
          },
        ],
      },
      lent: {
        speaker: 'khoa',
        text: 'Cảm ơn bạn nha. Thật đó. Tuần sau, chắc chắn luôn.',
      },
      refused: {
        speaker: 'khoa',
        text: 'Không sao đâu! Mình hỏi vậy thôi! Tại tuần sau là có rồi mà!',
      },
    },
  },

  'ch3-badge': {
    id: 'ch3-badge',
    place: 'desk',
    start: 'mail',
    nodes: {
      mail: {
        text: 'Ngày mùng 5. Không có "ting". Thay vào đó là một email: "Chúc mừng! Bạn được vinh danh CHIẾN BINH THÁNG 3".',
        next: 'badge',
      },
      badge: {
        text: 'Đính kèm là một huy hiệu PNG 512 × 512. Bạn thử đưa nó cho chủ nhà trong tưởng tượng.',
        next: 'hr',
      },
      hr: {
        speaker: 'hr',
        text: 'Công ty ghi nhận sự cống hiến của từng thành viên! Về lương, hiện tại công ty đang cố gắng ạ.',
      },
    },
  },

  'ch3-new-project': {
    id: 'ch3-new-project',
    place: 'meeting',
    start: 'room',
    nodes: {
      room: {
        text: 'Sếp gọi nhóm của bạn vào phòng họp nhỏ. Trên bàn không có nước, vì mô hình nước cá nhân đã được triển khai.',
        next: 'pitch',
      },
      pitch: {
        speaker: 'boss',
        text: 'Anh giao cho các em dự án Bứt Phá. Đối tác rất lớn. Làm xong là mọi vấn đề của công ty được giải quyết, kể cả vấn đề mà các em đang nghĩ tới.',
        next: 'react',
      },
      react: {
        speaker: 'uyen',
        text: 'Dạ dự án này có ngân sách cho lương của nhóm không anh?',
        next: 'boss-reply',
      },
      'boss-reply': {
        speaker: 'boss',
        text: 'Uyên à, em đang nhìn vào ngón tay chứ không nhìn vào mặt trăng.',
        next: 'player-turn',
      },
      'player-turn': {
        text: 'Cả phòng quay sang bạn, vì bạn là người duy nhất chưa nói gì.',
        choices: [
          {
            id: 'back-uyen',
            text: 'Đứng về phía Uyên: "Dạ em cũng muốn biết ạ"',
            effects: [
              { type: 'addRelation', npc: 'uyen', amount: 10 },
              { type: 'addRelation', npc: 'boss', amount: -6 },
              { type: 'setFlag', flag: 'backedUyen' },
            ],
            next: 'end-tense',
          },
          {
            id: 'back-boss',
            text: 'Đỡ lời sếp: "Dạ em nghĩ cứ làm đã rồi tính"',
            effects: [
              { type: 'addRelation', npc: 'boss', amount: 8 },
              { type: 'addRelation', npc: 'uyen', amount: -8 },
              { type: 'addRelation', npc: 'khoa', amount: 4 },
            ],
            next: 'end-smooth',
          },
        ],
      },
      'end-tense': {
        text: 'Sếp mỉm cười, ghi gì đó vào sổ, và kết thúc cuộc họp sớm 40 phút. Không ai biết như thế là tốt hay xấu.',
      },
      'end-smooth': {
        text: 'Sếp vỗ vai bạn. Uyên gập sổ lại. Trên đường về, không ai nói gì với ai.',
      },
    },
  },

  'ch3-chart': {
    id: 'ch3-chart',
    place: 'hallway',
    start: 'empty-desk',
    nodes: {
      'empty-desk': {
        text: 'Sáng nay bàn đối diện trống. Cây xương rồng còn đó, người thì không. Không có email chia tay nào cả.',
        next: 'dan',
      },
      dan: {
        speaker: 'dan',
        text: 'Thằng bên kỹ thuật nghỉ rồi. Nghỉ thế này thì coi như tự bỏ tiền được nợ, dại. Đợi thêm một tháng là có.',
        next: 'uyen',
      },
      uyen: {
        speaker: 'uyen',
        text: 'Bạn ấy có hỏi mình cách lấy lại giấy tờ trước khi đi. Không phải ai cũng biết mình có quyền giữ chúng.',
        next: 'thought',
      },
      thought: {
        speaker: 'player',
        text: 'Lần đầu tiên, có ai đó rời đi mà mình thấy ghen tị thay vì lo cho họ.',
        effects: [{ type: 'addStress', amount: 4 }],
      },
    },
  },

  'ch3-promise': {
    id: 'ch3-promise',
    place: 'desk',
    start: 'mail',
    nodes: {
      mail: {
        speaker: 'hr',
        text: 'Thông báo chung: công ty cam kết hoàn tất toàn bộ lương tồn đọng trước ngày 30 tháng sau. Cảm ơn sự kiên nhẫn phi thường của cả nhà!',
        next: 'reaction',
      },
      reaction: {
        speaker: 'khoa',
        text: 'Thấy chưa! Có ngày cụ thể rồi nè! Ngày 30!',
        next: 'uyen',
      },
      uyen: {
        speaker: 'uyen',
        text: 'Lần đầu tiên có ngày. Mình lưu email này lại, bạn cũng nên làm thế.',
        next: 'check',
      },
      check: {
        routes: [{ when: { type: 'flag', flag: 'startedNotes' }, next: 'noted' }],
        otherwise: 'end',
      },
      noted: {
        text: 'Bạn thêm một dòng vào sổ ghi chép của mình: ngày, giờ, người gửi, nội dung. Tay bạn viết rất đều.',
        effects: [{ type: 'addEvidence', evidence: 'group-notes' }],
        next: 'end',
      },
      end: {
        text: 'Bạn đánh dấu ngày 30 lên lịch, ngay cạnh trái tim nhỏ của tháng đầu tiên. Lần này bạn không vẽ gì thêm.',
      },
    },
  },
};
