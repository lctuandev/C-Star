/** Chương 5 — The Awakening (GDD §3): tháng 7. */
export const chapter5Scenes = {
  'ch5-compare': {
    id: 'ch5-compare',
    place: 'hallway',
    start: 'check',
    nodes: {
      check: {
        routes: [{ when: { type: 'flag', flag: 'joinedGroup' }, next: 'table' }],
        otherwise: 'alone',
      },
      table: {
        text: 'Tối nay nhóm lập một bảng đối chiếu: ai, tháng nào, được hứa gì, nhận bao nhiêu, còn thiếu bao nhiêu. Dòng cuối cùng có con số làm cả bàn im lặng.',
        effects: [
          { type: 'addEvidence', evidence: 'debt-table' },
          { type: 'addRelation', npc: 'uyen', amount: 6 },
        ],
        next: 'table-uyen',
      },
      'table-uyen': {
        speaker: 'uyen',
        text: 'Đây chưa phải để kiện ai. Đây là để lần đầu tiên mọi người biết chính xác mình đang nói về cái gì.',
      },
      alone: {
        text: 'Bạn tự lập một bảng tính, một mình, lúc một giờ sáng. Hàng duy nhất là tên bạn. Nó trông nhỏ hơn bạn tưởng.',
        effects: [{ type: 'addStress', amount: 4 }],
      },
    },
  },

  'ch5-choose-way': {
    id: 'ch5-choose-way',
    place: 'desk',
    start: 'think',
    nodes: {
      think: {
        text: 'Trong tay bạn là những gì đã giữ được. Giờ phải chọn cách mở lời với công ty.',
        next: 'choice',
      },
      choice: {
        speaker: 'player',
        text: 'Làm thế nào đây?',
        choices: [
          {
            id: 'formal',
            text: 'Gửi yêu cầu chính thức bằng văn bản',
            requires: { type: 'stat', stat: 'evidenceCount', min: 3 },
            lockedReason: 'Cần ít nhất 3 giấy tờ trong Hồ sơ',
            effects: [
              { type: 'setFlag', flag: 'sentFormalRequest' },
              { type: 'addRelation', npc: 'hr', amount: -10 },
              { type: 'addRelation', npc: 'boss', amount: -10 },
              { type: 'addStress', amount: 6 },
            ],
            next: 'formal-sent',
          },
          {
            id: 'advice',
            text: 'Đi hỏi người có chuyên môn trước đã',
            effects: [
              { type: 'setFlag', flag: 'soughtAdvice' },
              { type: 'addCash', amount: -500_000 },
              { type: 'addStress', amount: -5 },
            ],
            next: 'advice-given',
          },
          {
            id: 'talk',
            text: 'Nói chuyện riêng với HR thêm lần nữa',
            effects: [
              { type: 'setFlag', flag: 'keptNegotiating' },
              { type: 'addRelation', npc: 'hr', amount: 4 },
            ],
            next: 'talk-again',
          },
        ],
      },
      'formal-sent': {
        text: 'Bạn gửi email lúc 9 giờ đúng, kèm tệp đính kèm đặt tên rõ ràng, có yêu cầu xác nhận đã đọc. Tay bạn hơi run. Nhưng không phải vì sợ.',
      },
      'advice-given': {
        text: 'Người ta nghe bạn trình bày, xem qua giấy tờ, rồi hỏi: "Bạn có lưu lại không?". Đó là câu hỏi đúng nhất bạn được nghe trong bảy tháng.',
      },
      'talk-again': {
        speaker: 'hr',
        text: 'Chị hiểu mà em. Chị cũng là nạn nhân thôi. Nhưng em đừng làm căng, ảnh hưởng tới lộ trình của em lắm.',
      },
    },
  },

  'ch5-company-reply': {
    id: 'ch5-company-reply',
    place: 'meeting',
    start: 'room',
    nodes: {
      room: {
        text: 'Chị HR mời bạn vào phòng họp nhỏ. Lần này trên bàn có nước. Bạn biết ngay là chuyện nghiêm trọng.',
        next: 'hr-1',
      },
      'hr-1': {
        speaker: 'hr',
        text: 'Mọi người có thể cho công ty thêm một chút thời gian không em?',
        next: 'player-1',
      },
      'player-1': {
        speaker: 'player',
        text: 'Bọn em đã cho công ty hơn sáu tháng rồi chị.',
        next: 'hr-2',
      },
      'hr-2': {
        speaker: 'hr',
        text: 'Thời gian đó công ty rất trân trọng ạ.',
        next: 'accountant',
      },
      accountant: {
        speaker: 'accountant',
        text: 'Khoản của em bên chị ghi là "đang chờ đối soát". Hỏi đối soát với ai thì chị không biết, trên hệ thống chỉ có mỗi dòng đó.',
        next: 'three',
      },
      three: {
        text: 'Trong một buổi sáng, bạn nhận được ba lời giải thích khác nhau: hệ thống, dòng tiền, và "vấn đề mang tính thời điểm".',
      },
    },
  },

  'ch5-offer': {
    id: 'ch5-offer',
    place: 'meeting',
    start: 'boss',
    nodes: {
      boss: {
        speaker: 'boss',
        text: 'Em ngồi đi, em... Thôi không sao, anh nhớ mặt. Anh để ý em lâu rồi. Anh muốn em làm Trưởng nhóm. Danh thiếp mới, ghế mới, và một vị trí trong chương trình lãnh đạo tương lai.',
        next: 'detail',
      },
      detail: {
        speaker: 'player',
        text: 'Dạ... lương thì sao anh?',
        next: 'boss-2',
      },
      'boss-2': {
        speaker: 'boss',
        text: 'Lương là một phần của bức tranh lớn. Anh chỉ cần em giúp anh ổn định anh em, đừng để nhóm kia làm rối. Em hiểu ý anh chứ?',
        choices: [
          {
            id: 'take-title',
            text: 'Nhận chức, biết đâu đây là cơ hội',
            effects: [
              { type: 'setFlag', flag: 'tookPromotion' },
              { type: 'setFlag', flag: 'joinedGroup', value: false },
              { type: 'addRelation', npc: 'boss', amount: 25 },
              { type: 'addRelation', npc: 'uyen', amount: -30 },
            ],
            next: 'took',
          },
          {
            id: 'refuse-title',
            text: 'Từ chối: "Dạ em chỉ cần phần đã làm"',
            effects: [
              { type: 'addRelation', npc: 'boss', amount: -15 },
              { type: 'addRelation', npc: 'uyen', amount: 8 },
              { type: 'addStress', amount: 4 },
            ],
            next: 'refused',
          },
        ],
      },
      took: {
        text: 'Ngày mai bạn có ba mươi tấm danh thiếp mới in rất đẹp. Bạn không gửi tấm nào. Uyên đã rời bạn khỏi nhóm trước khi bạn kịp nói gì.',
      },
      refused: {
        speaker: 'boss',
        text: 'Em còn trẻ. Rồi em sẽ hiểu tầm nhìn là gì.',
        next: 'tin-pleads',
      },
      'tin-pleads': {
        speaker: 'manager',
        text: 'Em đừng nghe nhóm kia. Luật với giấy tờ làm gì, anh có đọc bao giờ đâu. Chủ tịch đã nói thì tiền sẽ về. Ở lại với anh đi, rồi cả phòng mình cùng hưởng.',
        next: 'minh-check',
      },
      'minh-check': {
        routes: [{ when: { type: 'relation', npc: 'deputy', min: 8 }, next: 'minh-signs' }],
        otherwise: 'minh-nods',
      },
      'minh-signs': {
        speaker: 'deputy',
        text: 'Anh Tín tin thật lòng đấy, em đừng giận anh ấy. Còn em làm gì là quyền của em. Cần xác nhận em đã đi làm những tháng nào, anh ký cho.',
        effects: [{ type: 'addEvidence', evidence: 'timesheet' }],
      },
      'minh-nods': {
        text: 'Anh Minh đi ngang, không nói gì, chỉ khẽ gật đầu với bạn. Từ anh ấy, thế là đã nhiều.',
      },
    },
  },

  'ch5-payday': {
    id: 'ch5-payday',
    place: 'home',
    start: 'quiet',
    nodes: {
      quiet: {
        text: 'Ngày lương thứ bảy. Bạn không còn đặt điện thoại ngửa mặt lên bàn nữa.',
        next: 'crumb',
      },
      crumb: {
        text: 'Ting. 5.000.000 đ, lại một phần ba tháng lương, đúng tuần mọi người bắt đầu đòi giấy tờ. Phần còn lại được nợ tiếp.',
        effects: [{ type: 'companyPays', amount: 5_000_000 }],
        next: 'mom',
      },
      mom: {
        text: 'Mẹ gọi hỏi tháng này có về không. Bạn nói công ty đang vào giai đoạn quan trọng. Câu đó bạn học ở đâu, bạn biết rõ.',
      },
    },
  },
};
