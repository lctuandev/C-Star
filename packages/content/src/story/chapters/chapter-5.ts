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
        text: 'Mỗi dòng phải có nguồn. Sao kê ghi sao kê, hợp đồng ghi hợp đồng, ai nhớ bằng lời thì đánh dấu chưa xác minh. Đây chưa phải để kiện ai, chỉ để biết chính xác mình đang nói về cái gì.',
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
    start: 'acted-check',
    nodes: {
      'acted-check': {
        routes: [{ when: { type: 'flag', flag: 'decidedToAct' }, next: 'folder' }],
        otherwise: 'think',
      },
      folder: {
        text: 'Thư mục "Của mình" đã dày lên từ cái đêm cuối tháng 6.',
        next: 'think',
      },
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
            text: 'Gửi email đòi quyền lợi, lưu làm bằng chứng nếu phải khởi kiện',
            requires: { type: 'stat', stat: 'evidenceCount', min: 3 },
            lockedReason: 'Cần ít nhất 3 giấy tờ trong Hồ sơ',
            effects: [
              { type: 'addAwareness', amount: 15 },
              { type: 'setFlag', flag: 'sentFormalRequest' },
              { type: 'addEvidence', evidence: 'demand-mail' },
              { type: 'addRelation', npc: 'hr', amount: -10 },
              { type: 'addRelation', npc: 'boss', amount: -10 },
              { type: 'addStress', amount: 6 },
            ],
            next: 'formal-sent',
          },
          {
            id: 'advice',
            text: 'Đi hỏi người có chuyên môn trước đã',
            requires: { type: 'stat', stat: 'cash', min: 500_000 },
            lockedReason: 'Không còn đủ 500 nghìn tiền tư vấn',
            effects: [
              { type: 'addAwareness', amount: 15 },
              { type: 'setFlag', flag: 'soughtAdvice' },
              { type: 'addCash', amount: -500_000 },
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
        text: 'Bạn gửi email lúc 9 giờ đúng, nêu rõ từng khoản bị nợ, kèm tệp đính kèm, có yêu cầu xác nhận đã đọc. Bạn lưu lại bản gửi đi: công ty trả lời hay không, đây cũng là bằng chứng bạn đã đòi. Tay bạn hơi run. Nhưng không phải vì sợ.',
      },
      'advice-given': {
        text: 'Người ta nghe bạn trình bày, xem qua giấy tờ, rồi hỏi: "Bạn có lưu lại không?". Đó là câu hỏi đúng nhất bạn được nghe trong bảy tháng. Người ta cũng nói thẳng: hồ sơ này còn thiếu, thiếu thì khó đi xa.',
      },
      'talk-again': {
        speaker: 'hr',
        text: 'Chị hiểu mà em. Chị sẽ ghi nhận ý kiến của em, nhưng chị không xác nhận được ngày nào nếu bên trên chưa có thông báo. Em đừng làm căng, ảnh hưởng tới lộ trình của em lắm.',
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
        next: 'memory-check',
      },
      'memory-check': {
        routes: [
          { when: { type: 'flag', flag: 'askedHrInPublic' }, next: 'hr-public' },
          { when: { type: 'flag', flag: 'askedHrPrivately' }, next: 'hr-private' },
          { when: { type: 'flag', flag: 'stayedQuiet' }, next: 'hr-quiet' },
        ],
        otherwise: 'hr-1',
      },
      'hr-public': {
        speaker: 'hr',
        text: 'Chị vẫn nhớ câu em hỏi hồi tháng 2: "Cố gắng có chuyển khoản được không". Bên chị có người chụp lại, gửi nhau cười. Giờ không ai cười nữa.',
        next: 'hr-1',
      },
      'hr-private': {
        speaker: 'hr',
        text: 'Hồi tháng 2 em nhắn riêng chị, lịch sự lắm. Chị bảo em đừng chia sẻ ra ngoài, em cũng nghe. Giờ em ngồi đây thì chị hiểu mọi chuyện đã khác.',
        next: 'hr-1',
      },
      'hr-quiet': {
        text: 'Hồi tháng 2 bạn gõ "dạ vâng ạ" rồi xóa đi. Năm tháng sau bạn ngồi đối diện chị HR, và lần này bạn sẽ nói.',
        next: 'hr-1',
      },
      'hr-1': {
        speaker: 'hr',
        text: 'Mọi người có thể cho công ty thêm một chút thời gian không em?',
        next: 'player-1',
      },
      'player-1': {
        speaker: 'player',
        text: 'Bọn em đã cho công ty mượn năm kỳ lương rồi chị.',
        next: 'hr-2',
      },
      'hr-2': {
        speaker: 'hr',
        text: 'Sự đồng hành đó công ty rất trân trọng ạ.',
        next: 'accountant',
      },
      accountant: {
        speaker: 'accountant',
        text: 'Khoản của em bên cô ghi là "đang chờ đối soát". Hỏi đối soát với ai thì cô không biết, trên hệ thống chỉ có mỗi dòng đó.',
        next: 'three',
      },
      three: {
        text: 'Trong một buổi sáng, bạn nhận được ba lời giải thích khác nhau: hệ thống, dòng tiền, và "vấn đề mang tính thời điểm".',
        next: 'table-check',
      },
      'table-check': {
        routes: [{ when: { type: 'flag', flag: 'tableHasError' }, next: 'bad-table' }],
        otherwise: 'mail-check',
      },
      'mail-check': {
        routes: [{ when: { type: 'flag', flag: 'sentFormalRequest' }, next: 'mail-reply' }],
        otherwise: 'no-mail',
      },
      'bad-table': {
        speaker: 'accountant',
        text: 'À, có người báo với cô là bảng của nhóm em có một dòng sai. Bên trên nghe được rồi, nên giờ bên trên bảo cả bảng không đáng tin.',
        effects: [{ type: 'addStress', amount: 6 }],
        next: 'mail-check',
      },
      'mail-reply': {
        text: 'Bức email hôm trước có hồi âm, đúng một dòng: "Công ty đã tiếp nhận". Tiếp nhận chứ chưa phải xác nhận số tiền. Bạn vẫn lưu nó cùng thư mục. Một dòng thôi, nhưng có ngày, có người gửi.',
      },
      'no-mail': {
        text: 'Bạn về chỗ, nhìn ba lời giải thích, và nghĩ tới những thứ mà mình chưa có trên giấy.',
      },
    },
  },

  'ch5-offer': {
    id: 'ch5-offer',
    place: 'meeting',
    start: 'dialogue-check',
    nodes: {
      'dialogue-check': {
        routes: [{ when: { type: 'flag', flag: 'askedDialogue' }, next: 'dialogue' }],
        otherwise: 'boss',
      },
      dialogue: {
        speaker: 'boss',
        text: 'Em muốn đối thoại đúng không? Đây, anh đối thoại.',
        next: 'boss',
      },
      boss: {
        speaker: 'boss',
        text: 'Em ngồi đi, em... Thôi không sao, anh nhớ mặt. Anh để ý em lâu rồi.',
        next: 'why-check',
      },
      'why-check': {
        routes: [
          { when: { type: 'flag', flag: 'keptNegotiating' }, next: 'why-calm' },
          { when: { type: 'flag', flag: 'clappedForBoss' }, next: 'why-clap' },
          {
            when: {
              type: 'any',
              conditions: [
                { type: 'flag', flag: 'askedAboutPay' },
                { type: 'flag', flag: 'askedBossSalary' },
              ],
            },
            next: 'why-asked',
          },
        ],
        otherwise: 'title',
      },
      'why-calm': {
        speaker: 'boss',
        text: 'Chị HR bảo em là người biết điều, không làm căng. Công ty đang cần những người như vậy.',
        next: 'title',
      },
      'why-clap': {
        speaker: 'boss',
        text: 'Hôm họp đầu năm, giữa cả phòng im lặng, em vỗ tay to nhất. Anh không quên đâu.',
        next: 'title',
      },
      'why-asked': {
        speaker: 'boss',
        text: 'Cả công ty có mấy người dám hỏi lương ngay trước mặt anh, em là một. Người như em đứng về phía anh thì anh em mới nghe.',
        next: 'title',
      },
      title: {
        speaker: 'boss',
        text: 'Anh muốn em làm Trưởng nhóm, báo cáo thẳng cho anh. Danh thiếp mới, ghế mới, một vị trí trong chương trình lãnh đạo tương lai. Quyền hạn cụ thể anh thông báo sau.',
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
            id: 'negotiate',
            text: 'Ra điều kiện: trả hết phần đã nợ, em sẽ nhận',
            requires: { type: 'stat', stat: 'awareness', min: 50 },
            lockedReason: 'Cần hiểu rõ quyền lợi của mình hơn (từ 50)',
            effects: [
              { type: 'setFlag', flag: 'heldOutForPay' },
              { type: 'addRelation', npc: 'boss', amount: -6 },
              { type: 'addAwareness', amount: 5 },
            ],
            next: 'negotiated',
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
      negotiated: {
        speaker: 'boss',
        text: 'Em đang đàm phán với anh đấy à? Hay lắm. Lâu rồi mới có người làm thế. Nhưng chuyện đó thì next week mình nói tiếp.',
        next: 'tin-doubt',
      },
      took: {
        text: 'Ngày mai bạn có ba mươi tấm danh thiếp mới in rất đẹp. Bạn không gửi tấm nào. Uyên nhìn tấm danh thiếp trên bàn bạn, rồi nhìn đi chỗ khác. Từ hôm đó cô không nhắn gì cho bạn nữa.',
      },
      refused: {
        speaker: 'boss',
        text: 'Em còn trẻ. Rồi em sẽ hiểu tầm nhìn là gì.',
        next: 'tin-doubt',
      },
      'tin-pleads': {
        speaker: 'manager',
        text: 'Anh biết em lo. Luật với giấy tờ anh không giỏi, nhưng anh vẫn tin Chủ tịch. Em đừng nghe nhóm kia, cũng đừng vội đi, rồi cả phòng mình cùng hưởng.',
        next: 'minh-check',
      },
      'tin-doubt': {
        routes: [{ when: { type: 'flag', flag: 'rogerDoubts' }, next: 'tin-falters' }],
        otherwise: 'tin-pleads',
      },
      'tin-falters': {
        speaker: 'manager',
        text: 'Anh muốn tin là tiền sẽ về. Nhưng anh không dám hứa thay cho ai nữa. Anh chỉ mong em đừng nghĩ tám năm anh ở đây là vô nghĩa.',
        next: 'minh-check',
      },
      'minh-check': {
        routes: [{ when: { type: 'relation', npc: 'deputy', min: 8 }, next: 'minh-signs' }],
        otherwise: 'minh-nods',
      },
      'minh-signs': {
        speaker: 'deputy',
        text: 'Anh Roger tin thật lòng đấy, em đừng giận anh ấy. Còn em làm gì là quyền của em. Cần xác nhận em đã đi làm những tháng nào, anh ký cho.',
        effects: [{ type: 'addEvidence', evidence: 'timesheet' }],
      },
      'minh-nods': {
        text: 'Anh Huấn đi ngang, không nói gì, chỉ khẽ gật đầu với bạn. Từ anh ấy, thế là đã nhiều.',
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
        next: 'crumb-check',
      },
      'crumb-check': {
        routes: [
          { when: { type: 'flag', flag: 'tookPromotion' }, next: 'crumb-title' },
          { when: { type: 'flag', flag: 'heldOutForPay' }, next: 'crumb-held' },
          { when: { type: 'flag', flag: 'joinedDragons' }, next: 'crumb' },
        ],
        otherwise: 'no-crumb',
      },
      'crumb-title': {
        text: 'Ting. 5.000.000 đ, nội dung "HO TRO TRUONG NHOM". Vẫn là một phần ba tháng lương, chỉ là giờ nó có tên khác. Phần còn lại được nợ tiếp.',
        effects: [{ type: 'companyPays', amount: 5_000_000 }],
        next: 'mom',
      },
      'crumb-held': {
        text: 'Ting. 5.000.000 đ, đúng tuần sau hôm bạn ra điều kiện. Không ai giải thích gì. Nó chỉ là một phần ba tháng lương, nhưng bạn biết vì sao mình có nó.',
        effects: [{ type: 'companyPays', amount: 5_000_000 }],
        next: 'mom',
      },
      crumb: {
        text: 'Ting. 5.000.000 đ, lại một phần ba tháng lương, đúng tuần mọi người bắt đầu đòi giấy tờ. Phần còn lại được nợ tiếp.',
        effects: [{ type: 'companyPays', amount: 5_000_000 }],
        next: 'mom',
      },
      'no-crumb': {
        text: 'Trong nhóm chat có người nói vừa được một phần ba tháng lương. Bạn thì không. Bạn không còn ngạc nhiên nữa.',
        next: 'mom',
      },
      mom: {
        routes: [{ when: { type: 'flag', flag: 'tookCredit' }, next: 'app' }],
        otherwise: 'mom-calls',
      },
      app: {
        text: 'Ứng dụng vay nhắn tin đúng 10 giờ 41 phút. Trong đời bạn vẫn còn một bên không bao giờ trễ hẹn.',
        next: 'mom-calls',
      },
      'mom-calls': {
        text: 'Mẹ gọi hỏi tháng này có về không, rồi hỏi: "Công ty tốt không con?". Bạn nói công ty đang vào giai đoạn quan trọng. Câu đó bạn học ở đâu, bạn biết rõ.',
        next: 'mom-check',
      },
      'mom-check': {
        routes: [
          { when: { type: 'flag', flag: 'calledHome' }, next: 'mom-loan' },
          { when: { type: 'flag', flag: 'sentHome' }, next: 'mom-kept' },
        ],
        otherwise: 'hang-up',
      },
      'mom-loan': {
        text: 'Ba triệu hôm đó mẹ không nhắc tới, một lần cũng không. Chính vì vậy mà bạn ngại nghe máy.',
      },
      'mom-kept': {
        text: 'Trước khi cúp máy, mẹ bảo hai triệu tháng đầu bạn gửi về vẫn để nguyên: "Khi nào con cần thì nói". Bạn chưa dám nói.',
      },
      'hang-up': {
        text: 'Cúp máy rồi, bạn ngồi yên thêm một lúc.',
      },
    },
  },

  'ch5-wrong-number': {
    id: 'ch5-wrong-number',
    place: 'hallway',
    start: 'tip-check',
    nodes: {
      'tip-check': {
        routes: [{ when: { type: 'flag', flag: 'danJoined' }, next: 'tip' }],
        otherwise: 'hearsay',
      },
      hearsay: {
        speaker: 'uyen',
        text: 'Ai điền vào cột "tiền về" đây? Dòng này ghi công ty vừa nhận một khoản lớn. À, lại là tin của Dân ở pantry.',
        next: 'wrong',
      },
      tip: {
        speaker: 'dan',
        text: 'Tin chắc đây: tuần trước công ty vừa nhận một khoản lớn từ nhà đầu tư. Tôi điền vào bảng rồi đấy, cột "tiền về".',
        next: 'wrong',
      },
      wrong: {
        speaker: 'uyen',
        text: 'Khoan. Mình vừa đối chiếu: khoản đó về tài khoản một công ty khác trong tập đoàn. Với cả dòng tháng 4 mình cộng trùng một khoản ứng. Mình sai. Mình chưa bao giờ sai.',
        next: 'quiet',
      },
      quiet: {
        text: 'Cả bàn im lặng. Uyên nhìn cái bảng như nhìn một người vừa nói dối mình. Lần đầu tiên bạn thấy cô run tay. Tin nghe được hóa ra không phải giấy tờ, và giấy tờ cũng có thể sai.',
        next: 'late',
      },
      late: {
        speaker: 'uyen',
        text: 'Muộn rồi. Mai là phải dùng tới bảng này. Soát lại từ đầu thì hết cả đêm.',
        choices: [
          {
            id: 'check-table',
            text: 'Ngồi lại soát từng dòng cùng Uyên',
            effects: [
              { type: 'addEnergy', amount: -12 },
              { type: 'addRelation', npc: 'uyen', amount: 10 },
              { type: 'addRelation', npc: 'dan', amount: 4 },
              { type: 'addAwareness', amount: 6 },
            ],
            next: 'checked',
          },
          {
            id: 'skip-check',
            text: 'Sửa đúng dòng đó thôi, gần đúng là được rồi',
            effects: [{ type: 'setFlag', flag: 'tableHasError' }],
            next: 'skipped',
          },
        ],
      },
      checked: {
        speaker: 'uyen',
        text: 'Cảm ơn bạn. Từ hồi công ty cũ đóng cửa sau một đêm, mình quen làm một mình. Có người soát lại, hóa ra nhẹ hơn nhiều.',
      },
      skipped: {
        text: 'Mọi người về lúc gần nửa đêm. Uyên vẫn nhìn cái bảng, nhưng không nói gì thêm. Ai cũng mệt rồi.',
      },
    },
  },

  'ch5-closed-door': {
    id: 'ch5-closed-door',
    place: 'hallway',
    start: 'charger',
    nodes: {
      charger: {
        text: 'Tối muộn, bạn quay lại lấy sạc điện thoại. Phòng họp nhỏ còn sáng đèn, cửa chưa đóng hẳn.',
        next: 'boss',
      },
      boss: {
        speaker: 'boss',
        text: 'Nhóm đó đang làm gì?',
        next: 'hr',
      },
      hr: {
        speaker: 'hr',
        text: 'Họ chỉ đối chiếu số liệu thôi anh.',
        next: 'boss-2',
      },
      'boss-2': {
        speaker: 'boss',
        text: 'Tôi không muốn tuần sau lại có thêm một người gửi email nữa.',
        next: 'email-check',
      },
      'email-check': {
        routes: [{ when: { type: 'flag', flag: 'sentFormalRequest' }, next: 'that-is-you' }],
        otherwise: 'door',
      },
      'that-is-you': {
        text: 'Bạn đứng im. "Một người gửi email" đó là bạn.',
        next: 'door',
      },
      door: {
        text: 'Lần đầu tiên, trong giọng của anh có thứ mà bạn chưa nghe bao giờ. Không phải tầm nhìn. Là lo lắng. Nhân viên không còn chỉ ngồi đợi nữa, và họ biết điều đó.',
        choices: [
          {
            id: 'walk-past',
            text: 'Lấy sạc rồi đi về, không muốn dính vào',
            next: 'went-home',
          },
          {
            id: 'tell-uyen',
            text: 'Về nhắn Uyên: bên trên đã để ý rồi',
            effects: [
              { type: 'addRelation', npc: 'uyen', amount: 6 },
              { type: 'addStress', amount: 3 },
            ],
            next: 'told',
          },
          {
            id: 'walk-in',
            text: 'Đẩy cửa bước vào, đề nghị một buổi đối thoại chính thức',
            effects: [
              { type: 'setFlag', flag: 'askedDialogue' },
              { type: 'addRelation', npc: 'boss', amount: -10 },
              { type: 'addStress', amount: 5 },
              { type: 'addAwareness', amount: 6 },
            ],
            next: 'walked-in',
          },
        ],
      },
      'went-home': {
        text: 'Thang máy xuống rất chậm. Bạn tự nhủ mình chưa nghe thấy gì cả.',
      },
      told: {
        speaker: 'uyen',
        text: 'Cảm ơn bạn. Chuyện nghe được chỉ để mình hiểu tình hình thôi, đừng đưa vào bảng. Cái gì của mình thì mình giữ, có gì sai đâu mà sợ.',
      },
      'walked-in': {
        text: 'Ba người nhìn bạn. Chị HR đóng laptop lại. Phó giám đốc cười, nụ cười của những buổi họp toàn công ty: "Được. Tuần sau em vào gặp anh."',
      },
    },
  },
};
