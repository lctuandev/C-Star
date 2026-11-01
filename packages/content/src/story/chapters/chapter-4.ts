/** Chương 4 — Six Months Later (GDD §3): tháng 5 và 6. */
export const chapter4Scenes = {
  'ch4-second-tranche': {
    id: 'ch4-second-tranche',
    place: 'desk',
    start: 'check',
    nodes: {
      check: {
        routes: [
          { when: { type: 'flag', flag: 'joinedDragons' }, next: 'ting' },
          { when: { type: 'relation', npc: 'boss', min: 8 }, next: 'ting-private' },
        ],
        otherwise: 'nothing',
      },
      'ting-private': {
        text: 'Ting. 5.000.000 đ, giảm còn một phần ba tháng lương, không kèm thông báo nào. Chị HR nhắn riêng: "Khoản ứng riêng của em, đừng nói với ai nhé".',
        effects: [{ type: 'companyPays', amount: 5_000_000 }],
        next: 'who',
      },
      ting: {
        text: 'Ting. 5.000.000 đ, vẫn một phần ba tháng lương. Nội dung: "UNG DOT 1 CUA DOT 2 LUONG T2 BU T3". Bạn đọc ba lần và hiểu ít hơn sau mỗi lần.',
        effects: [{ type: 'companyPays', amount: 5_000_000 }],
        next: 'who',
      },
      nothing: {
        text: 'Sáng nay trong phòng có vài tiếng ting rải rác. Ai có thì cúi mặt nhìn điện thoại. Điện thoại của bạn nằm im.',
        effects: [{ type: 'addStress', amount: 5 }],
        next: 'who',
      },
      who: {
        speaker: 'uyen',
        text: 'Mình hỏi bảy người: ba người có, bốn người không. Cùng phòng, cùng chức danh, cùng số tháng làm. Đợt này chỉ vài người có, nhiều người ba bốn tháng liền chưa nhận được đồng nào.',
        next: 'phones',
      },
      phones: {
        text: 'Cuối dãy bàn, một đồng nghiệp vừa liếc màn hình rồi úp vội điện thoại xuống khi thấy mọi người nhìn sang. Cả phòng bỗng rất chăm chú vào việc của mình.',
        next: 'criteria',
      },
      criteria: {
        speaker: 'player',
        text: 'Có tiêu chí gì không? Ai có, ai không, là do đâu?',
        choices: [
          {
            id: 'look-away',
            text: 'Không hỏi nữa, cúi xuống làm việc',
            effects: [{ type: 'addStress', amount: 3 }],
            next: 'accountant',
          },
          {
            id: 'ask-paid',
            text: 'Hỏi nhỏ những người vừa nhận được tiền',
            effects: [{ type: 'addRelation', npc: 'dan', amount: 3 }],
            next: 'paid-answer',
          },
          {
            id: 'ask-criteria',
            text: 'Hỏi thẳng chị HR về tiêu chí thanh toán',
            effects: [
              { type: 'setFlag', flag: 'askedCriteria' },
              { type: 'addRelation', npc: 'hr', amount: -5 },
              { type: 'addAwareness', amount: 6 },
            ],
            next: 'hr-answer',
          },
        ],
      },
      'paid-answer': {
        text: 'Người ta lắc đầu, bảo cũng không biết vì sao mình có tên. "Đừng nói với ai nhé." Bạn nhìn họ, và thấy họ cũng sợ.',
        next: 'accountant',
      },
      'hr-answer': {
        speaker: 'hr',
        text: 'Công ty có quy trình ưu tiên riêng em nhé, chị chưa thể chia sẻ chi tiết. Em đừng hiểu theo hướng có danh sách.',
        next: 'accountant',
      },
      accountant: {
        speaker: 'accountant',
        text: 'Đừng hỏi cô. Danh sách từ trên đưa xuống. Cô đã xin nghỉ phép một tuần chỉ để không phải giải thích.',
        next: 'dan',
      },
      dan: {
        speaker: 'dan',
        text: 'Thấy chưa, dòng tiền bắt đầu chảy lại. Đây là chữ V, ông nhìn đáy rồi đấy. Chỉ là tôi chưa có tên trong đợt này thôi.',
        next: 'uyen-after',
      },
      'uyen-after': {
        speaker: 'uyen',
        text: 'Không có tiêu chí thì người ta sẽ tự nghĩ ra tiêu chí. Từ hôm nay trong phòng bắt đầu có người không nhìn mặt nhau.',
        next: 'minh',
      },
      minh: {
        speaker: 'deputy',
        text: 'Cứ lúc mọi người định nghỉ là lại có một ít, mà chỉ cho vài người. Thế là người có thì im, người không có thì ngại hỏi. Em nhớ ghi lại nhé.',
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
                { type: 'flag', flag: 'khoaConfided' },
              ],
            },
            next: 'khoa-tells',
          },
        ],
        otherwise: 'khoa-gone',
      },
      'khoa-tells': {
        speaker: 'khoa',
        text: 'Mình đi nha, {name}. Về quê phụ ba mẹ một thời gian. Bạn đừng nói với ai, mình... không muốn người ta thấy mình bỏ cuộc.',
        next: 'khoa-box',
      },
      'khoa-box': {
        text: 'Khoa đang xếp đồ vào một thùng giấy. Cái phích công ty tặng nằm trên cùng. Lần đầu tiên bạn thấy Khoa không cười.',
        next: 'khoa-gift',
      },
      'khoa-gift': {
        speaker: 'khoa',
        text: 'Mình từng tin tuần sau có lương. Mười mấy tuần rồi đó. Mình gửi bạn bản chấm công của mình với mấy bạn đã đồng ý, ai cần thì có. Bạn đừng tin như mình nha.',
        effects: [
          { type: 'addEvidence', evidence: 'timesheet' },
          { type: 'setFlag', flag: 'khoaSaidGoodbye' },
          { type: 'setFlag', flag: 'khoaLeft' },
          { type: 'addStress', amount: 6 },
        ],
        next: 'seat-check',
      },
      'khoa-gone': {
        text: 'Sáng thứ Hai, bàn Khoa trống trơn. Tên Khoa đã biến khỏi nhóm chat. Không ai biết từ lúc nào.',
        next: 'khoa-mug',
      },
      'khoa-mug': {
        text: 'Trên bàn còn lại đúng một cái phích. Bạn định nhắn hỏi thăm, rồi thấy mình chẳng có gì để nói.',
        effects: [
          { type: 'setFlag', flag: 'khoaLeft' },
          { type: 'addStress', amount: 6 },
        ],
        next: 'seat-check',
      },
      'seat-check': {
        routes: [{ when: { type: 'flag', flag: 'satWithKhoa' }, next: 'empty-seat' }],
        otherwise: 'quieter',
      },
      'empty-seat': {
        text: 'Ghế bên cạnh bạn từ ngày đầu giờ trống. Chiều đó bạn quay sang định nói gì đó, rồi nhớ ra.',
      },
      quieter: {
        text: 'Chiều đó cả phòng yên hơn thường ngày một chút. Không ai nói vì sao.',
      },
    },
  },

  'ch4-date-passes': {
    id: 'ch4-date-passes',
    place: 'desk',
    start: 'date',
    nodes: {
      date: {
        text: 'Hết tháng 5. Vẫn không có một dòng nào về kế hoạch trả lương. Tháng trôi qua êm đềm như một tháng bình thường, vì với công ty thì đúng là vậy.',
        effects: [{ type: 'addTrust', amount: -8 }],
        next: 'mail',
      },
      mail: {
        speaker: 'hr',
        text: 'Thông báo chung: nhằm đảm bảo quyền lợi tốt nhất, lộ trình thanh toán được điều chỉnh linh hoạt. Công ty trân trọng sự đồng hành của cả nhà!',
        next: 'dragon-check',
      },
      'dragon-check': {
        routes: [{ when: { type: 'flag', flag: 'joinedDragons' }, next: 'dragon-note' }],
        otherwise: 'uyen',
      },
      'dragon-note': {
        speaker: 'hr',
        text: 'Riêng nhóm Vượt Thác Hóa Rồng: benefit tháng này tạm dời sang đợt sau. Rồng thì phải kiên nhẫn cả nhà ơi!',
        next: 'uyen',
      },
      uyen: {
        speaker: 'uyen',
        text: 'Lần thứ bảy công ty đổi cách nói về lịch trả lương. Mình đếm rồi.',
      },
    },
  },

  'ch4-different-debts': {
    id: 'ch4-different-debts',
    place: 'hallway',
    start: 'coffee',
    nodes: {
      coffee: {
        text: 'Bạn và Uyên ngồi ở quán cóc đầu ngõ, cà phê 15 nghìn, thứ duy nhất quanh đây vẫn được trả tiền đúng giá.',
        next: 'criteria-check',
      },
      'criteria-check': {
        routes: [{ when: { type: 'flag', flag: 'askedCriteria' }, next: 'criteria-echo' }],
        otherwise: 'uyen-list',
      },
      'criteria-echo': {
        speaker: 'uyen',
        text: 'Chuyện bạn hỏi HR về tiêu chí, cả tầng biết rồi. Ba người kéo mình ra hỏi bạn là ai, giọng rất nhỏ.',
        next: 'uyen-list',
      },
      'uyen-list': {
        speaker: 'uyen',
        text: 'Sau bảy người hôm trước, mình hỏi thêm bốn người nữa. Mười một người, không ai giống ai. Người được đợt 1, người chưa, người được ứng riêng. Chia nhỏ ra thì không ai biết mình bị nợ nhiều hay ít so với người khác.',
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
    start: 'cold-check',
    nodes: {
      'cold-check': {
        routes: [{ when: { type: 'relation', npc: 'uyen', max: -10 }, next: 'left-out' }],
        otherwise: 'backed-check',
      },
      'left-out': {
        text: 'Tối thứ Năm có sáu người ngồi ở quán cũ. Bạn biết chuyện khi thấy tấm ảnh trong nhóm chat. Không ai rủ bạn.',
        next: 'too-late',
      },
      'too-late': {
        speaker: 'player',
        text: 'Giờ nhắn Uyên còn kịp không?',
        choices: [
          {
            id: 'stay-out',
            text: 'Thôi, họ không cần mình',
            effects: [{ type: 'addStress', amount: 3 }],
            next: 'stayed-out',
          },
          {
            id: 'ask-in',
            text: 'Nhắn Uyên, gửi kèm những giấy tờ mình đang có',
            requires: { type: 'stat', stat: 'evidenceCount', min: 2 },
            lockedReason: 'Cần ít nhất 2 giấy tờ để nhóm tin bạn',
            effects: [
              { type: 'setFlag', flag: 'joinedGroup' },
              { type: 'addRelation', npc: 'uyen', amount: 10 },
              { type: 'addRelation', npc: 'hr', amount: -6 },
            ],
            next: 'let-in',
          },
        ],
      },
      'stayed-out': {
        text: 'Bạn thả tim tấm ảnh, rồi tắt điện thoại.',
      },
      'let-in': {
        speaker: 'uyen',
        text: 'Giấy tờ này đúng. Thứ Năm tuần sau, quán cũ. Mang bản gốc nhé.',
      },
      'backed-check': {
        routes: [{ when: { type: 'flag', flag: 'backedUyen' }, next: 'remembers' }],
        otherwise: 'invite',
      },
      remembers: {
        speaker: 'uyen',
        text: 'Hôm họp dự án Bứt Phá, bạn là người duy nhất hỏi cùng mình. Nên mình muốn có bạn ở đó.',
        next: 'invite',
      },
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
        text: 'Tối thứ Năm, bảy người ngồi quanh một cái bàn nhựa, xếp giấy tờ thành chồng. Không ai nói to. Lần đầu tiên sau nhiều tháng, bạn không thấy mình đơn độc.',
      },
      declined: {
        text: 'Uyên không nói gì, chỉ gật đầu rồi quay về chỗ. Tối thứ Năm bạn ở nhà, xem đi xem lại số dư tài khoản.',
      },
    },
  },

  'ch4-dan-doubts': {
    id: 'ch4-dan-doubts',
    place: 'desk',
    start: 'seat-check',
    nodes: {
      'seat-check': {
        routes: [{ when: { type: 'flag', flag: 'satWithDan' }, next: 'neighbour' }],
        otherwise: 'dan',
      },
      neighbour: {
        text: 'Sáu tháng ngồi cạnh Dân, bạn thuộc ba cửa sổ tin tức đó như thuộc đường về nhà. Sáng nay lần đầu Dân không đọc to tin nào.',
        next: 'dan',
      },
      dan: {
        text: 'Dân ngồi lì trước ba cửa sổ tin tức. Cả ba đều không có tin gì về công ty. Hôm nay Dân không nói gì về chữ V.',
        next: 'dan-says',
      },
      'dan-says': {
        speaker: 'dan',
        text: 'Hôm qua tôi gọi cho người quen bên nhà đầu tư. Họ hỏi lại tôi: "Công ty nào?".',
        next: 'react',
      },
      react: {
        text: 'Lần đầu tiên bạn thấy Dân không có câu trả lời cho điều gì đó.',
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
            text: 'Vỗ vai Dân: "Chắc chỉ là nhầm thôi"',
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
        text: 'Hơn sáu tháng kể từ ngày nhận email "Hành trình phi thường của bạn bắt đầu từ đây". Bạn mở lại nó. Bạn đã từng thấy nó vui đến thế.',
        effects: [{ type: 'addTrust', amount: -6 }],
        next: 'debt',
      },
      debt: {
        text: 'Bạn cộng lại mọi tháng bị nợ. Hóa ra bạn không còn là nhân viên nữa. Bạn là nhà đầu tư thiên thần bất đắc dĩ của công ty này.',
        next: 'signed-check',
      },
      'signed-check': {
        routes: [{ when: { type: 'flag', flag: 'eagerHire' }, next: 'eleven-seconds' }],
        otherwise: 'decide',
      },
      'eleven-seconds': {
        text: 'Bạn đã ký hợp đồng này trong 11 giây. Đêm nay bạn mở lại, đọc tới trang 14, cỡ chữ 6: "Thời điểm thanh toán có thể được điều chỉnh để phù hợp với lộ trình phát triển chung". Bạn mất sáu tháng để đọc tới đó.',
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
              { type: 'addAwareness', amount: 10 },
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
          {
            id: 'walk-away',
            text: 'Hết tin rồi, cũng chẳng biết đòi ở đâu. Thôi nghỉ luôn',
            requires: {
              type: 'all',
              conditions: [
                { type: 'stat', stat: 'trust', max: 30 },
                { type: 'stat', stat: 'awareness', max: 40 },
              ],
            },
            lockedReason: 'Bạn vẫn còn chút tin, hoặc còn muốn đòi cho ra lẽ',
            effects: [
              { type: 'setFlag', flag: 'quitEarly' },
              { type: 'setFlag', flag: 'runOver' },
            ],
            next: 'walked-away',
          },
        ],
      },
      'walked-away': {
        text: 'Bạn viết đơn nghỉ việc lúc nửa đêm, ba dòng. Không có gì để đòi, không có gì để tin. Bạn chỉ thấy mệt, và muốn ngủ.',
      },
      acting: {
        text: 'Bạn tạo một thư mục mới, đặt tên là "Của mình". Chỉ vậy thôi. Nhưng đêm đó bạn ngủ được.',
      },
      waiting: {
        text: 'Bạn đóng laptop. "Biết đâu" là từ đắt nhất bạn từng dùng, tính theo lãi suất.',
      },
    },
  },

  'ch4-borrowing': {
    id: 'ch4-borrowing',
    place: 'hallway',
    start: 'lunch',
    nodes: {
      lunch: {
        text: 'Giờ nghỉ trưa, pantry im hơn thường ngày. Ai cũng ăn cơm mang từ nhà, và không ai hỏi nhau ăn gì nữa.',
        next: 'dan',
      },
      dan: {
        speaker: 'dan',
        text: 'Tôi vừa mở cái thẻ tín dụng thứ ba. Gọi là đòn bẩy tài chính. Đợt gọi vốn này về là tôi tất toán hết, ông xem.',
        next: 'minh',
      },
      minh: {
        speaker: 'deputy',
        text: 'Hôm qua một bạn trong phòng mượn anh tiền đóng học cho con. Bạn ấy đứng khóc ở thang máy. Anh đưa được một ít, mà anh cũng đang vay bên nhà vợ. Tháng sau chắc anh không làm vậy được nữa.',
        next: 'uyen',
      },
      uyen: {
        speaker: 'uyen',
        text: 'Mình hỏi mười một người thì chín người đang vay. Vay bố mẹ, vay bạn, vay trên điện thoại, lãi tính theo ngày.',
        next: 'weather',
      },
      weather: {
        text: 'Không ai than. Họ nói về nợ như nói về thời tiết. Bạn nghĩ tới những người ở quê, đang trả thay cho một công ty họ chưa từng nghe tên.',
        choices: [
          {
            id: 'keep-it',
            text: 'Gật đầu, giữ chuyện của mình cho riêng mình',
            effects: [{ type: 'addStress', amount: 3 }],
            next: 'kept',
          },
          {
            id: 'share',
            text: 'Kể thật tình hình tiền bạc của mình',
            effects: [
              { type: 'addRelation', npc: 'deputy', amount: 6 },
              { type: 'addRelation', npc: 'uyen', amount: 6 },
              { type: 'addStress', amount: -2 },
            ],
            next: 'shared',
          },
        ],
      },
      kept: {
        text: 'Tối đó bạn mở ứng dụng vay trên điện thoại, đọc dòng lãi suất, rồi tắt đi. Chưa phải hôm nay.',
      },
      shared: {
        speaker: 'deputy',
        text: 'Cảm ơn em đã nói. Không ai ở đây phải xấu hổ vì chuyện này cả. Người đang nợ lương đâu phải là mình.',
      },
    },
  },

  'ch4-the-dollars': {
    id: 'ch4-the-dollars',
    place: 'meeting',
    start: 'summon',
    nodes: {
      summon: {
        text: 'Tuần này có thêm bốn lá đơn nghỉ việc. Cả công ty được gọi lên phòng họp, lần đầu sau nhiều tháng. Trái cây quay lại, đúng một đĩa. Trên slide chỉ có một dòng: "$1–2 TRIỆU".',
        effects: [{ type: 'setFlag', flag: 'heardDollars' }],
        next: 'boss',
      },
      boss: {
        speaker: 'boss',
        text: 'Các bạn. Anh báo tin vui. Anh vừa đào được 1–2 triệu đô. Anh nhắc lại: 1–2 triệu đô. Các bạn hiểu điều đó nghĩa là gì không?',
        next: 'uyen',
      },
      uyen: {
        speaker: 'uyen',
        text: 'Dạ anh ơi, là 1 triệu hay 2 triệu ạ? Với khoản đợt trước anh báo đã về chưa ạ?',
        next: 'boss-2',
      },
      'boss-2': {
        speaker: 'boss',
        text: 'Hai việc khác nhau, các bạn đừng nhầm lẫn giữa các giai đoạn. Quan trọng là đã có. Và đây mới là tin lớn: công ty đang hướng tới IPO.',
        next: 'boss-shares',
      },
      'boss-shares': {
        speaker: 'boss',
        text: 'Sau IPO, anh em sẽ được phát cổ phiếu nội bộ. Ai ráng ở lại là cổ đông của công ty mình đấy. Ai đi bây giờ thì rất tiếc.',
        next: 'tin',
      },
      tin: {
        speaker: 'manager',
        text: 'Phòng mình không ai đi cả! Cổ đông tương lai cả đấy! Đây là lúc chứng minh lòng trung thành, Chủ tịch đang nhìn chúng ta.',
        next: 'clap-check',
      },
      'clap-check': {
        routes: [{ when: { type: 'flag', flag: 'rogerDoubts' }, next: 'clap-thin' }],
        otherwise: 'clap',
      },
      'clap-thin': {
        text: 'Anh Roger nói đúng những chữ đó, nhưng tuần trước bạn đã thấy anh ngồi một mình. Giọng anh to, mắt anh không nhìn ai. Tiếng vỗ tay thưa thớt.',
        next: 'minh',
      },
      clap: {
        text: 'Có tiếng vỗ tay, phần lớn là của anh Roger. Anh chưa bao giờ đọc kỹ hợp đồng của mình, nhưng anh biết chắc Chủ tịch sẽ không bỏ anh.',
        next: 'minh',
      },
      minh: {
        speaker: 'deputy',
        text: 'Đợt trước anh ấy cũng đào được chừng đó, cách đây đúng sáu tháng. Anh ở lại vì anh em trong phòng, không phải vì cổ phiếu. Lương còn chưa có thì cổ phiếu là gì hả em. Em cứ tính chuyện của em nhé.',
        choices: [
          {
            id: 'do-the-math',
            text: 'Im lặng, và nhẩm xem con số đó trả được mấy tháng lương',
            effects: [
              { type: 'addTrust', amount: -5 },
              { type: 'addAwareness', amount: 4 },
              { type: 'addRelation', npc: 'deputy', amount: 4 },
              { type: 'addStress', amount: 2 },
            ],
            next: 'math',
          },
          {
            id: 'write-it-down',
            text: 'Ghi nguyên văn vào sổ, kèm ngày giờ',
            requires: { type: 'flag', flag: 'startedNotes' },
            lockedReason: 'Bạn chưa có thói quen ghi chép',
            effects: [{ type: 'addEvidence', evidence: 'group-notes' }],
            next: 'noted',
          },
          {
            id: 'cheer',
            text: 'Vỗ tay. Lần này biết đâu là thật',
            effects: [
              { type: 'addTrust', amount: 6 },
              { type: 'addRelation', npc: 'boss', amount: 6 },
              { type: 'addRelation', npc: 'manager', amount: 8 },
              { type: 'addStress', amount: -3 },
            ],
            next: 'cheered',
          },
        ],
      },
      math: {
        text: 'Đủ trả hết nợ lương cả công ty mà vẫn còn dư, nếu nó có thật. Bạn quyết định đợi tiếng "ting" rồi mới tính tiếp.',
      },
      noted: {
        text: 'Bạn viết: "1–2 triệu đô. Không rõ 1 hay 2. Không rõ bao giờ." Dòng ghi chép này nằm ngay dưới dòng "this week" của ba tháng trước.',
      },
      cheered: {
        text: 'Anh Roger gật đầu với bạn, mắt sáng lên. Đĩa trái cây hết trong bốn phút.',
      },
    },
  },

  'ch4-kpi-held': {
    id: 'ch4-kpi-held',
    place: 'desk',
    start: 'slips',
    nodes: {
      slips: {
        text: 'Hợp đồng ghi tiền KPI bằng 30% lương. Tháng đầu tiên bạn nhận đủ. Từ đó tới nay chưa thấy lại, dù bạn vẫn chạy chỉ tiêu. Tháng trước thì đến cả phiếu lương cũng không có.',
        next: 'ask',
      },
      ask: {
        speaker: 'player',
        text: 'Dạ cô ơi, tiền KPI của em nằm ở đâu ạ? Với bảng lương tháng trước em chưa nhận được.',
        next: 'accountant',
      },
      accountant: {
        speaker: 'accountant',
        text: 'KPI của em có ghi nhận rồi. Nhưng đang được giữ.',
        next: 'where',
      },
      where: {
        speaker: 'player',
        text: 'Giữ ở đâu ạ?',
        next: 'accountant-2',
      },
      'accountant-2': {
        speaker: 'accountant',
        text: 'Ở chỗ giữ. Còn bảng lương tháng đó đang được chuẩn hóa. Cô nói thật, cô nhập số mà cô cũng chưa thấy nó.',
        next: 'asked-check',
      },
      'asked-check': {
        routes: [{ when: { type: 'flag', flag: 'askedAccountant' }, next: 'accountant-recall' }],
        otherwise: 'dan',
      },
      'accountant-recall': {
        speaker: 'accountant',
        text: 'Em là người đầu tiên hỏi cô chuyện lương, từ hồi tháng 2, lúc cô bảo bên trên ở bên trên. Tới giờ bên trên vẫn ở bên trên.',
        next: 'dan',
      },
      dan: {
        speaker: 'dan',
        text: 'Giam KPI đấy ông. Nghe cứ như KPI của ông vừa phạm tội.',
        next: 'minh',
      },
      minh: {
        speaker: 'deputy',
        text: 'Không có bảng lương thì mình tự ghi. Tháng nào nhận bao nhiêu, ngày nào, ghi hết. Công ty không đưa giấy thì mình có giấy của mình.',
        effects: [
          { type: 'addStress', amount: 4 },
          { type: 'addRelation', npc: 'deputy', amount: 3 },
        ],
      },
    },
  },

  'ch4-khoa-stairs': {
    id: 'ch4-khoa-stairs',
    place: 'hallway',
    start: 'stairs',
    nodes: {
      stairs: {
        text: 'Giờ nghỉ trưa, bạn tìm thấy Khoa ngồi ở bậc cầu thang thoát hiểm, tay cầm điện thoại đã tắt màn hình. Hôm nay Khoa không xuống pantry.',
        next: 'hungry',
      },
      hungry: {
        speaker: 'player',
        text: 'Khoa mà không đói á?',
        next: 'close-check',
      },
      'close-check': {
        routes: [{ when: { type: 'relation', npc: 'khoa', max: 4 }, next: 'brush-off' }],
        otherwise: 'memory',
      },
      'brush-off': {
        speaker: 'khoa',
        text: 'Hong sao đâu, mình ổn mà! Bạn đi ăn đi.',
        next: 'nod',
      },
      nod: {
        text: 'Bạn gật đầu rồi đi. Hai người chưa bao giờ đủ thân để hỏi thêm câu nữa. Sau này bạn còn nghĩ lại cái gật đầu đó nhiều lần.',
      },
      memory: {
        routes: [
          { when: { type: 'flag', flag: 'helpedKhoa' }, next: 'the-loan' },
          { when: { type: 'flag', flag: 'treatedTeam' }, next: 'the-lunch' },
        ],
        otherwise: 'parents',
      },
      'the-loan': {
        speaker: 'khoa',
        text: 'Một triệu hồi tháng 3 mình vẫn chưa trả bạn. Mình có ghi. Mình không quên đâu.',
        next: 'parents',
      },
      'the-lunch': {
        speaker: 'khoa',
        text: 'Mình đang nhớ bữa cơm tấm tháng đầu bạn mời. Mình gọi thêm trứng đó. Giờ nghĩ lại thấy như chuyện của người khác.',
        next: 'parents',
      },
      parents: {
        speaker: 'khoa',
        text: 'Mình mới gọi về nhà. Ba mẹ hỏi chừng nào về. Hồi đó mình flex công ty ghê lắm, ba mẹ khoe khắp xóm. Giờ về rồi biết nói sao đây.',
        next: 'failed',
      },
      failed: {
        speaker: 'khoa',
        text: 'Bạn có nghĩ mình thất bại không?',
        choices: [
          {
            id: 'one-more-month',
            text: '"Cố thêm một tháng nữa đi"',
            effects: [
              { type: 'addRelation', npc: 'khoa', amount: 3 },
              { type: 'addStress', amount: 2 },
            ],
            next: 'one-more',
          },
          {
            id: 'then-go',
            text: '"Ở đây làm bạn kiệt sức thì nghỉ cũng đâu phải thất bại"',
            effects: [
              { type: 'addRelation', npc: 'khoa', amount: 5 },
              { type: 'setFlag', flag: 'khoaConfided' },
            ],
            next: 'go',
          },
          {
            id: 'not-your-fault',
            text: '"Công ty nợ lương, chứ bạn có nợ công ty đâu. Đừng nhận lỗi về mình"',
            effects: [
              { type: 'addRelation', npc: 'khoa', amount: 8 },
              { type: 'setFlag', flag: 'khoaConfided' },
            ],
            next: 'not-fault',
          },
        ],
      },
      'one-more': {
        speaker: 'khoa',
        text: 'Ừ. Chắc tuần sau có. Mình cũng nói vậy với chủ nhà.',
      },
      go: {
        speaker: 'khoa',
        text: 'Ừ ha. Nghe dễ quá trời.',
      },
      'not-fault': {
        text: 'Khoa không trả lời. Khoa quay mặt đi một lúc lâu, rồi cười. Lần này mắt cũng cười, mà đỏ hoe.',
      },
    },
  },

  'ch4-roger-crack': {
    id: 'ch4-roger-crack',
    place: 'desk',
    start: 'late',
    nodes: {
      late: {
        text: 'Bạn ở lại muộn. Cả tầng đã tắt đèn, chỉ còn bàn anh Roger sáng. Trên bàn là tấm ảnh tập thể cũ và một email in ra: "Welcome to the C* Family".',
        next: 'trust-check',
      },
      'trust-check': {
        routes: [{ when: { type: 'relation', npc: 'manager', max: -1 }, next: 'shut' }],
        otherwise: 'photo',
      },
      shut: {
        text: 'Anh ngẩng lên thấy bạn, úp tấm ảnh xuống bàn. "Em về đi, muộn rồi." Giữa hai người chưa bao giờ có chuyện gì ngoài tầm nhìn.',
      },
      photo: {
        speaker: 'manager',
        text: 'Tám năm trước anh đến đây với đúng một cái vali. Không biết tiếng, không biết đường. Chủ tịch là người đầu tiên cho anh cơ hội.',
        next: 'phone',
      },
      phone: {
        text: 'Điện thoại anh rung, một tin nhắn từ ngân hàng. Anh nhìn một lúc, rồi úp xuống bàn.',
        next: 'ask',
      },
      ask: {
        speaker: 'player',
        text: 'Anh cũng chưa có lương ạ?',
        next: 'waiting',
      },
      waiting: {
        speaker: 'manager',
        text: 'Anh... cũng đang đợi.',
        next: 'no-next-week',
      },
      'no-next-week': {
        text: 'Lần đầu tiên anh không nói "next week".',
        choices: [
          {
            id: 'leave-him-be',
            text: 'Không hỏi thêm, chúc anh ngủ ngon',
            effects: [{ type: 'addStress', amount: -2 }],
            next: 'left-alone',
          },
          {
            id: 'should-you-leave',
            text: '"Anh có nghĩ mình nên rời đi không?"',
            effects: [{ type: 'addRelation', npc: 'manager', amount: -3 }],
            next: 'leave-answer',
          },
          {
            id: 'no-need-to-defend',
            text: '"Anh đâu cần giải thích thay công ty những điều chính anh cũng chưa biết"',
            effects: [
              { type: 'addRelation', npc: 'manager', amount: 4 },
              { type: 'setFlag', flag: 'rogerDoubts' },
            ],
            next: 'admits',
          },
        ],
      },
      'left-alone': {
        text: 'Anh gật đầu. Lúc ra thang máy bạn nhìn lại, anh vẫn ngồi đó, tấm ảnh trong tay.',
      },
      'leave-answer': {
        speaker: 'manager',
        text: 'Đi đâu hả em? Anh đã nói với cả nhà là anh làm ở một công ty sẽ thay đổi tất cả. Em về đi, muộn rồi.',
      },
      admits: {
        speaker: 'manager',
        text: 'Anh đã giới thiệu công ty này cho rất nhiều người. Có người chuyển cả gia đình tới đây. Nếu những gì anh nói với họ không đúng... anh không biết phải nhìn mặt họ thế nào.',
      },
    },
  },

  'ch4-performance-review': {
    id: 'ch4-performance-review',
    place: 'meeting',
    start: 'mail',
    nodes: {
      mail: {
        text: 'Email gửi toàn công ty: "Đánh giá hiệu suất giữa năm. Nhân viên chuẩn bị báo cáo KPI cá nhân". Bạn nhìn email, rồi nhìn sổ lương.',
        next: 'proud',
      },
      proud: {
        speaker: 'boss',
        text: 'Sáu tháng vừa qua chúng ta có những bước tiến rất đáng tự hào. Từng người sẽ được đánh giá công bằng, chi tiết tới từng ticket.',
        next: 'ask',
      },
      ask: {
        speaker: 'player',
        text: 'Dạ, KPI của nhân viên có được thanh toán theo kết quả đánh giá không ạ? Tiền KPI các tháng trước vẫn đang được giữ.',
        next: 'silence',
      },
      silence: {
        text: 'Căn phòng im lặng. Công ty đo được từng ticket của bạn, nhưng chưa ai đo được bạn đã nhận bao nhiêu.',
        next: 'boss-2',
      },
      'boss-2': {
        speaker: 'boss',
        text: 'Ghi nhận hiệu suất và giải ngân là hai quy trình khác nhau. Chúng ta không nên để những vấn đề ngắn hạn ảnh hưởng tới mục tiêu dài hạn.',
        choices: [
          {
            id: 'sit-it-out',
            text: 'Im lặng, chờ cuộc họp kết thúc',
            effects: [{ type: 'addStress', amount: 3 }],
            next: 'sat',
          },
          {
            id: 'ask-accountant',
            text: 'Quay sang hỏi cô Kế toán về bảng tính KPI',
            effects: [{ type: 'addRelation', npc: 'accountant', amount: 5 }],
            next: 'accountant',
          },
          {
            id: 'show-contract',
            text: 'Đặt hợp đồng lên bàn, đọc đúng dòng ghi KPI 30%',
            requires: { type: 'evidence', evidence: 'contract' },
            lockedReason: 'Bạn không có hợp đồng trong tay',
            effects: [
              { type: 'addRelation', npc: 'boss', amount: -8 },
              { type: 'addAwareness', amount: 6 },
              { type: 'addStress', amount: 3 },
            ],
            next: 'contract',
          },
        ],
      },
      sat: {
        text: 'Cuộc họp kết thúc đúng giờ, lần đầu tiên trong năm. Trên bảng vẫn còn dòng chữ "Tự hào".',
      },
      accountant: {
        speaker: 'accountant',
        text: 'Cô chỉ nhập số. Số thì cô có. Tiền thì cô không có.',
      },
      contract: {
        text: 'Không ai nói gì trong đúng tám giây. Phó giám đốc cảm ơn bạn đã "rất sát sao", rồi chuyển sang slide tiếp theo. Dưới gầm bàn, Uyên khẽ giơ ngón cái.',
      },
    },
  },
};
