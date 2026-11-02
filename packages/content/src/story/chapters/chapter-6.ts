const COMPANY_PAYS_ALL = 1_000_000_000;

/** Chương 6 — The Last Day (GDD §3), and the six endings (GDD §6). */
export const chapter6Scenes = {
  'ch6-last-day': {
    id: 'ch6-last-day',
    place: 'office',
    start: 'morning',
    nodes: {
      morning: {
        text: 'Chín giờ. Có người đang lau lại dòng chữ inox ở sảnh, dù nó đã rơi mất hai ký tự. Cái bức tường cây thì đã thành bức tường.',
        next: 'visit',
      },
      visit: {
        text: 'Giữa buổi sáng, cả tầng được gọi ra giữa phòng. Một người tóc bạc bước vào, sau lưng là hai trợ lý. Lần đầu tiên bạn thấy Chủ tịch ngoài màn hình.',
        next: 'chairman',
      },
      chairman: {
        speaker: 'chairman',
        text: 'Văn phòng đẹp. Công ty này... làm về mảng nào nhỉ? Thôi không sao. Hôm nay tôi đến để trò chuyện với các em như người trong nhà.',
        next: 'chairman-2',
      },
      'chairman-2': {
        speaker: 'chairman',
        text: 'Người ta hay hỏi tôi bí quyết thành công. Là đừng hỏi lương. Người làm việc lớn không đếm tháng. Các em không phải đang bị nợ, các em đang đầu tư vào chính mình.',
        next: 'chairman-3',
      },
      'chairman-3': {
        speaker: 'chairman',
        text: 'Ai còn nghĩ tới tiền là chưa hiểu công ty. Ai hiểu công ty rồi thì tiền sẽ tự đến, hoặc không cần đến nữa. Các em nhắc lại với tôi nào: "Tôi đang đầu tư vào chính mình".',
        next: 'room',
      },
      room: {
        routes: [{ when: { type: 'flag', flag: 'rogerDoubts' }, next: 'roger-silent' }],
        otherwise: 'roger-loud',
      },
      'roger-silent': {
        text: 'Vài chục người nhắc theo, nhỏ dần. Anh Roger đứng ngay hàng đầu. Lần đầu tiên trong tám năm, anh không nhắc lại. Chủ tịch nhìn anh một giây, rồi nhìn thẳng về phía bạn.',
        next: 'your-turn',
      },
      'roger-loud': {
        text: 'Anh Roger nhắc lại to nhất. Vài chục người nhắc theo, nhỏ dần. Chủ tịch gật đầu, rồi nhìn thẳng về phía bạn.',
        next: 'your-turn',
      },
      'your-turn': {
        speaker: 'player',
        text: 'Cả phòng đang nhìn mình.',
        choices: [
          {
            id: 'repeat-after',
            text: 'Lẩm nhẩm nhắc theo cho xong',
            effects: [{ type: 'addRelation', npc: 'manager', amount: 3 }],
            next: 'repeated',
          },
          {
            id: 'ask-chairman',
            text: 'Giơ tay: "Dạ thưa Chủ tịch, bao giờ công ty trả lương ạ?"',
            effects: [
              { type: 'setFlag', flag: 'askedChairman' },
              { type: 'addStress', amount: 6 },
              { type: 'addRelation', npc: 'deputy', amount: 5 },
              { type: 'addRelation', npc: 'uyen', amount: 5 },
            ],
            next: 'chairman-answers',
          },
          {
            id: 'note-chairman',
            text: 'Ghi lại nguyên văn vào sổ',
            requires: { type: 'flag', flag: 'startedNotes' },
            lockedReason: 'Bạn chưa có thói quen ghi chép',
            effects: [{ type: 'addEvidence', evidence: 'group-notes' }],
            next: 'noted',
          },
        ],
      },
      repeated: {
        text: 'Bạn nghe giọng mình nói câu đó. Nó nhỏ, nhưng là giọng của bạn. Cảm giác đó ở lại lâu hơn bạn tưởng.',
        next: 'tin-check',
      },
      'chairman-answers': {
        speaker: 'chairman',
        text: 'Em còn trẻ. Đó là câu hỏi của người làm thuê. Hãy hỏi mình đã cống hiến được gì cho công ty.',
        next: 'after-question',
      },
      'after-question': {
        text: 'Một trợ lý cúi xuống ghi gì đó vào điện thoại. Chủ tịch không nói thêm. Những người đang nhìn bạn bắt đầu nhìn xuống sàn, nhưng từ lúc đó không ai nhắc lại câu kia nữa.',
        next: 'tin-check',
      },
      noted: {
        text: 'Bạn viết: "Đừng hỏi lương". Ghi ngày, ghi giờ, ghi tên người nói. Hai trợ lý nhìn cây bút của bạn và không biết phải làm gì với nó.',
        next: 'tin-check',
      },
      'tin-check': {
        routes: [{ when: { type: 'flag', flag: 'rogerDoubts' }, next: 'tin-quiet' }],
        otherwise: 'tin-moved',
      },
      'tin-quiet': {
        speaker: 'manager',
        text: 'Ông ấy không biết công ty này làm gì. Tám năm, em ạ. Ông ấy không biết.',
        next: 'minh-looks',
      },
      'tin-moved': {
        speaker: 'manager',
        text: 'Các em thấy chưa? Chủ tịch đích thân đến trò chuyện với mình. Chừng đó là đủ rồi.',
        next: 'minh-looks',
      },
      'minh-looks': {
        text: 'Anh Huấn nhìn theo cánh cửa thang máy đang đóng, rồi quay lại nhìn bạn. Anh không nói gì. Có những câu không cần nói.',
        next: 'boss',
      },
      boss: {
        speaker: 'boss',
        text: 'Em vào anh bảo. Next week thôi, 1–2 triệu đô đang về, IPO cũng sắp rồi. Chúng ta còn nhiều dự án lớn lắm.',
        next: 'pledge',
      },
      pledge: {
        speaker: 'hr',
        text: 'Cả nhà ký giúp chị Bản cam kết đồng hành trước 5 giờ chiều nay nhé. Khoản lương cũ được chuyển tiếp sang kỳ phát triển mới, ai ký là người nhà của công ty.',
        next: 'hr-check',
      },
      'hr-check': {
        routes: [
          { when: { type: 'relation', npc: 'hr', min: 2 }, next: 'hr-aside' },
          { when: { type: 'relation', npc: 'hr', max: -10 }, next: 'hr-cold' },
        ],
        otherwise: 'pledge-check',
      },
      'hr-aside': {
        speaker: 'hr',
        text: 'Em đọc kỹ rồi hẵng ký nhé. Chị nói với tư cách người cũng chưa có lương.',
        next: 'pledge-check',
      },
      'hr-cold': {
        text: 'Chị HR đặt tờ giấy lên bàn bạn, không nhìn bạn, rồi đi thẳng. Cả năm nay chị chưa từng im lặng lâu như vậy.',
        next: 'pledge-check',
      },
      'pledge-check': {
        routes: [{ when: { type: 'flag', flag: 'soughtAdvice' }, next: 'advice-echo' }],
        otherwise: 'fine-print',
      },
      'advice-echo': {
        text: 'Bạn nhớ câu hỏi của người tư vấn: "Bạn có lưu lại không?". Bạn chụp lại tờ cam kết trước khi làm bất cứ điều gì.',
        next: 'fine-print',
      },
      'fine-print': {
        text: 'Bạn đọc tờ cam kết một lượt. Không có ngày thanh toán. Không có số tiền. Chỉ có chỗ ký tên.',
        next: 'deal-check',
      },
      'deal-check': {
        // Only someone who could still make trouble is worth paying off.
        routes: [
          {
            when: {
              type: 'any',
              conditions: [
                { type: 'stat', stat: 'evidenceCount', min: 3 },
                { type: 'flag', flag: 'joinedGroup' },
              ],
            },
            next: 'side-deal',
          },
        ],
        otherwise: 'mom-text-check',
      },
      'side-deal': {
        speaker: 'boss',
        text: 'Khoan ký đã, em vào đây anh nói riêng. Anh biết em đang giữ những gì, anh không trách. Chiều nay anh chuyển riêng cho em 15 triệu, tiền tươi, không phải next week.',
        next: 'side-paper',
      },
      'side-paper': {
        text: 'Anh đẩy sang một tờ khác, ngắn hơn: "Người lao động xác nhận đã nhận đủ các khoản lương còn nợ và không khiếu nại về sau". Mười lăm triệu. Đổi lại, bạn ký rằng mình đã nhận đủ.',
        choices: [
          {
            id: 'take-deal',
            text: 'Ký. Tiền trong tay chắc hơn một tập giấy',
            effects: [
              { type: 'setFlag', flag: 'signedWaiver' },
              { type: 'companyPays', amount: 15_000_000 },
              { type: 'addRelation', npc: 'boss', amount: 10 },
            ],
            next: 'took-deal',
          },
          {
            id: 'refuse-deal',
            text: 'Đẩy lại: "Em chưa nhận đủ, nên em không ký được ạ"',
            effects: [
              { type: 'addRelation', npc: 'boss', amount: -8 },
              { type: 'addStress', amount: 3 },
            ],
            next: 'refused-deal',
          },
          {
            id: 'copy-deal',
            text: 'Chụp lại tờ giấy trước, rồi mới trả lời',
            requires: {
              type: 'any',
              conditions: [
                { type: 'stat', stat: 'awareness', min: 50 },
                { type: 'flag', flag: 'soughtAdvice' },
              ],
            },
            lockedReason: 'Cần hiểu rõ quyền lợi của mình hơn (từ 50)',
            effects: [
              { type: 'setFlag', flag: 'copiedWaiver' },
              { type: 'addEvidence', evidence: 'waiver-offer' },
              { type: 'addRelation', npc: 'boss', amount: -12 },
              { type: 'addStress', amount: 8 },
            ],
            next: 'copied-deal',
          },
        ],
      },
      'took-deal': {
        text: 'Ting. 15.000.000 đ, nội dung "HO TRO CA NHAN". Lần đầu tiên công ty trả đúng giờ đã hẹn. Trên sổ vẫn còn một con số. Giờ thì có thêm một tờ giấy ghi là bạn đã nhận đủ, với chữ ký của bạn.',
        next: 'deal-group-check',
      },
      'deal-group-check': {
        routes: [{ when: { type: 'flag', flag: 'joinedGroup' }, next: 'left-group' }],
        otherwise: 'mom-text-check',
      },
      'left-group': {
        text: 'Bạn nhắn vào nhóm xin rút tên. Uyên trả lời đúng một chữ: "Ok". Một lát sau, dòng có tên bạn biến mất khỏi bảng đối chiếu.',
        effects: [
          { type: 'setFlag', flag: 'joinedGroup', value: false },
          { type: 'addRelation', npc: 'uyen', amount: -25 },
        ],
        next: 'mom-text-check',
      },
      'refused-deal': {
        speaker: 'boss',
        text: 'Anh cho em cơ hội rồi đấy nhé. Cơ hội này không có next week đâu.',
        next: 'mom-text-check',
      },
      'copied-deal': {
        text: 'Bạn giơ điện thoại lên, chụp một tấm. Anh khựng lại nửa giây. Tờ giấy ghi rõ "các khoản lương còn nợ": muốn bạn im lặng thì trước hết công ty phải viết ra là có nợ. Đó là lần đầu tiên bạn thấy câu đó trên giấy của công ty.',
        next: 'copied-boss',
      },
      'copied-boss': {
        speaker: 'boss',
        text: 'Chụp xong rồi thì em khỏi cần ký tờ nào nữa. Cam kết đồng hành là dành cho người nhà.',
        next: 'mom-text-check',
      },
      'mom-text-check': {
        routes: [{ when: { type: 'flag', flag: 'toldMom' }, next: 'mom-text' }],
        otherwise: 'boss-asks',
      },
      'mom-text': {
        text: 'Điện thoại rung trong túi. Mẹ nhắn: "Làm gì thì làm, nhớ ăn sáng nha con". Mẹ không biết hôm nay là ngày gì. Nhưng bạn thấy nhẹ đi một chút.',
        effects: [{ type: 'addStress', amount: -4 }],
        next: 'boss-asks',
      },
      'boss-asks': {
        speaker: 'boss',
        text: 'Em nghĩ kỹ chưa?',
        next: 'choice-check',
      },
      'choice-check': {
        routes: [{ when: { type: 'flag', flag: 'signedWaiver' }, next: 'choice-signed' }],
        otherwise: 'choice',
      },
      'choice-signed': {
        speaker: 'player',
        text: 'Tờ giấy kia đã ký rồi. Giờ chỉ còn chuyện ở lại hay đi.',
        choices: [
          {
            id: 'leave-signed',
            text: 'Cầm tiền, rời công ty và bắt đầu lại',
            effects: [
              { type: 'setFlag', flag: 'choseLeave' },
              { type: 'setFlag', flag: 'runOver' },
            ],
            next: 'leave-line',
          },
          {
            id: 'stay-signed',
            text: 'Ký nốt bản cam kết, ở lại',
            effects: [
              { type: 'setFlag', flag: 'choseStay' },
              { type: 'setFlag', flag: 'runOver' },
            ],
            next: 'stay-check',
          },
        ],
      },
      choice: {
        speaker: 'player',
        text: 'Hôm nay là ngày phải có câu trả lời.',
        choices: [
          {
            id: 'pursue',
            text: 'Theo đuổi quyền lợi của mình đến cùng',
            requires: {
              type: 'any',
              conditions: [
                { type: 'stat', stat: 'evidenceCount', min: 3 },
                { type: 'flag', flag: 'joinedGroup' },
              ],
            },
            lockedReason: 'Trong tay chưa có gì: cần 3 giấy tờ, hoặc một nhóm cùng đi',
            effects: [
              { type: 'setFlag', flag: 'chosePursue' },
              { type: 'setFlag', flag: 'runOver' },
            ],
            next: 'pursue-line',
          },
          {
            id: 'leave',
            text: 'Rời công ty và bắt đầu lại',
            effects: [
              { type: 'setFlag', flag: 'choseLeave' },
              { type: 'setFlag', flag: 'runOver' },
            ],
            next: 'leave-line',
          },
          {
            id: 'stay',
            text: 'Ký bản cam kết, cho công ty thêm một cơ hội',
            requires: { type: 'not', condition: { type: 'flag', flag: 'copiedWaiver' } },
            lockedReason: 'Sếp đã nói rồi: cam kết là dành cho người nhà',
            effects: [
              { type: 'setFlag', flag: 'choseStay' },
              { type: 'setFlag', flag: 'runOver' },
            ],
            next: 'stay-check',
          },
        ],
      },
      'pursue-line': {
        speaker: 'player',
        text: 'Em cũng có nhiều hóa đơn lớn cần thanh toán, anh ạ.',
      },
      'leave-line': {
        speaker: 'player',
        text: 'Em xin phép dừng ở đây. Em đặt thẻ nhân viên lên bàn nhé.',
      },
      'stay-check': {
        routes: [{ when: { type: 'stat', stat: 'awareness', min: 50 }, next: 'stay-eyes-open' }],
        otherwise: 'stay-line',
      },
      'stay-eyes-open': {
        speaker: 'player',
        text: 'Em biết tờ này không có ngày nào cả. Em vẫn ký. Em chưa đủ sức đi lúc này.',
      },
      'stay-line': {
        speaker: 'player',
        text: 'Dạ. Em ký ạ. Em sẽ cố gắng thêm.',
      },
    },
  },

  'ending-good': {
    id: 'ending-good',
    place: 'home',
    start: 'month',
    nodes: {
      month: {
        text: 'Ba tháng sau. Hồ sơ của nhóm rõ ràng tới mức công ty không còn câu "đang cố gắng" nào để nói. Từng khoản được chốt, có ngày, có chữ ký.',
        next: 'offer-check',
      },
      'offer-check': {
        routes: [{ when: { type: 'evidence', evidence: 'waiver-offer' }, next: 'offer-top' }],
        otherwise: 'ting',
      },
      'offer-top': {
        text: 'Trên cùng tập hồ sơ là tờ "không khiếu nại" công ty từng đưa bạn. Muốn mua im lặng thì phải viết ra là có nợ, và công ty đã viết.',
        next: 'ting',
      },
      ting: {
        text: 'Ting. Lần này bạn không reo lên, dù cả phần KPI bị giữ cũng đã về. Bạn chỉ ngồi yên một lúc.',
        effects: [{ type: 'companyPays', amount: COMPANY_PAYS_ALL }],
        next: 'loan-check',
      },
      'loan-check': {
        routes: [
          { when: { type: 'stat', stat: 'loans', min: 1 }, next: 'repay' },
          { when: { type: 'flag', flag: 'toldMom' }, next: 'call-told' },
        ],
        otherwise: 'call-home',
      },
      'call-told': {
        text: 'Rồi bạn gọi về nhà. Mẹ đã biết đầu đuôi từ tháng 7, nên mẹ chỉ hỏi: "Thế tháng này có về ăn cơm không?". Lần này bạn trả lời được.',
        next: 'uyen',
      },
      repay: {
        text: 'Rồi bạn trả nốt tiền cho những người đã cho bạn mượn.',
        next: 'uyen',
      },
      'call-home': {
        text: 'Rồi bạn gọi về nhà, và lần này kể thật mọi chuyện.',
        next: 'uyen',
      },
      uyen: {
        speaker: 'uyen',
        text: 'Xong rồi. Mình xóa file được chưa? Thôi, để lại. Mình quen tay rồi.',
        next: 'named-check',
      },
      'named-check': {
        routes: [{ when: { type: 'flag', flag: 'namedUyen' }, next: 'still-remembers' }],
        otherwise: 'end',
      },
      'still-remembers': {
        text: 'Uyên không nhắc lại chuyện phòng họp nhỏ. Một năm sau cũng không. Bạn vẫn nhớ, và bạn biết là cô cũng nhớ.',
        next: 'end',
      },
      end: {
        text: 'Bạn bắt đầu một công việc mới. Hôm ký hợp đồng, bạn đọc hết, kể cả trang cỡ chữ 6.',
        next: 'year',
      },
      year: {
        text: 'Một năm sau. Một bạn mới vào hỏi bạn nên đọc gì trước khi ký. Bạn trả lời: trang 14. Bạn không còn tin mù quáng vào ai, nhưng lạ thay, bạn cũng không thấy mình cay đắng.',
        next: 'year-khoa',
      },
      'year-khoa': {
        routes: [{ when: { type: 'flag', flag: 'khoaSaidGoodbye' }, next: 'khoa-photo' }],
        otherwise: 'year-end',
      },
      'khoa-photo': {
        text: 'Khoa gửi ảnh quán cà phê nhỏ ở quê, mới khai trương. Cái phích công ty tặng để trên quầy. Lần này Khoa cười, cả mắt cũng cười.',
        next: 'year-end',
      },
      'year-end': {
        text: 'Ngày mùng 5, điện thoại kêu ting. Bạn vẫn dừng lại một giây, như mọi lần. Có những thứ trả rồi vẫn còn nhớ.',
      },
    },
  },

  'ending-collective': {
    id: 'ending-collective',
    place: 'hallway',
    start: 'together',
    nodes: {
      together: {
        text: 'Giấy tờ không đủ cho mọi khoản, nhưng hai mươi ba người cùng ngồi trong một phòng thì khó giả vờ là không thấy.',
        next: 'deal',
      },
      deal: {
        text: 'Công ty chốt lộ trình trả dần cho cả nhóm. Không trọn vẹn, nhưng có văn bản, và lần này là chung một văn bản. Đợt đầu của riêng bạn là 30 triệu.',
        effects: [{ type: 'companyPays', amount: 30_000_000 }],
        next: 'minh',
      },
      minh: {
        text: 'Anh Huấn ký tên đầu tiên trong danh sách. Anh vẫn nói mình yêu công ty này, và chính vì thế anh muốn nó trả lương.',
        next: 'asked-check',
      },
      'asked-check': {
        routes: [{ when: { type: 'flag', flag: 'askedChairman' }, next: 'first-page' }],
        otherwise: 'dan',
      },
      'first-page': {
        text: 'Trang đầu tập hồ sơ, Uyên in đúng một câu: "Dạ thưa Chủ tịch, bao giờ công ty trả lương ạ?". Bên dưới là ngày giờ, và tên bạn.',
        next: 'dan',
      },
      dan: {
        speaker: 'uyen',
        text: 'Không ai trong chúng ta là trường hợp đặc biệt. Đó là điều mình mừng nhất.',
        next: 'named-check',
      },
      'named-check': {
        routes: [{ when: { type: 'flag', flag: 'namedUyen' }, next: 'last-line' }],
        otherwise: 'roger-check',
      },
      'last-line': {
        text: 'Tên bạn vẫn nằm ở dòng cuối danh sách. Uyên không nhắc lại chuyện đó, và cũng chưa bao giờ nói là đã bỏ qua.',
        next: 'roger-check',
      },
      'roger-check': {
        routes: [{ when: { type: 'flag', flag: 'rogerDoubts' }, next: 'roger-signs' }],
        otherwise: 'dan-check',
      },
      'roger-signs': {
        text: 'Hôm cuối, anh Roger đến trễ, không nói gì, ký vào dòng cuối của danh sách. Anh xin lỗi từng người anh đã giới thiệu vào công ty, từng người một. Có người gật đầu. Có người không nhìn anh. Anh không giải thích thêm.',
        next: 'dan-check',
      },
      'dan-check': {
        routes: [{ when: { type: 'flag', flag: 'danJoined' }, next: 'dan-cards' }],
        otherwise: 'year',
      },
      'dan-cards': {
        text: 'Dân đóng cả ba cửa sổ tin tức. Giờ màn hình chỉ còn một bảng: lịch trả ba cái thẻ tín dụng, ghi nguồn đàng hoàng.',
        next: 'year',
      },
      year: {
        text: 'Một năm sau. Nhóm chat vẫn còn, đổi tên thành "Không ai là trường hợp đặc biệt". Khoản trả dần chưa xong, có tháng về trễ. Nhưng tháng nào trễ, cả nhóm biết, và hỏi cùng một lúc.',
      },
    },
  },

  'ending-investigator': {
    id: 'ending-investigator',
    place: 'desk',
    start: 'alone',
    nodes: {
      alone: {
        text: 'Bạn đi một mình. Mỗi lần công ty đưa ra một lời giải thích, bạn đặt lên bàn một tờ giấy có ngày tháng.',
        next: 'offer-check',
      },
      'offer-check': {
        routes: [{ when: { type: 'evidence', evidence: 'waiver-offer' }, next: 'offer-top' }],
        otherwise: 'long',
      },
      'offer-top': {
        text: 'Tờ bạn đặt xuống cuối cùng là tờ "không khiếu nại" chính công ty từng đưa bạn. Người đối diện đọc xong thì không còn lời giải thích nào mới.',
        next: 'long',
      },
      long: {
        text: 'Việc đó tốn nhiều tháng và nhiều giấc ngủ, nhưng khoản của bạn cuối cùng cũng được giải quyết. Chỉ khoản của bạn.',
        effects: [{ type: 'companyPays', amount: COMPANY_PAYS_ALL }],
        next: 'after',
      },
      after: {
        text: 'Dân nhắn hỏi bạn đã làm thế nào, lần đầu tiên không kèm tin đồn nào. Bạn gửi lại danh sách những thứ nên giữ. Danh sách đó bắt đầu được chuyền tay.',
        next: 'year',
      },
      year: {
        text: 'Một năm sau. Tiền của bạn đã về. Thỉnh thoảng bạn lướt qua nhóm cũ: vẫn những cái tên đó, vẫn câu "tuần sau". Bạn thắng, một mình, và bạn chưa biết phải cảm thấy thế nào về chữ "một mình".',
      },
    },
  },

  'ending-survivor': {
    id: 'ending-survivor',
    place: 'home',
    start: 'box',
    nodes: {
      box: {
        text: 'Bạn mang về một thùng giấy, trong đó có một cái áo thun in chữ "gia đình".',
        next: 'friend-check',
      },
      'friend-check': {
        routes: [{ when: { type: 'flag', flag: 'turnedDownFriend' }, next: 'friend' }],
        otherwise: 'debt-check',
      },
      friend: {
        text: 'Bạn nhắn lại người bạn hôm tháng 4. Họ không hỏi gì, chỉ gửi địa chỉ văn phòng.',
        next: 'debt-check',
      },
      'debt-check': {
        routes: [{ when: { type: 'flag', flag: 'signedWaiver' }, next: 'new-waived' }],
        otherwise: 'new',
      },
      'new-waived': {
        text: 'Con số trên sổ vẫn còn, nhưng tờ giấy có chữ ký của bạn ghi là đã nhận đủ, nên giờ muốn đòi cũng khó hơn nhiều. Bạn tìm được việc mới, lương không cao, nhưng trả đúng ngày mùng 5.',
        next: 'ting',
      },
      new: {
        text: 'Khoản nợ vẫn nằm đó, một con số bạn học cách không nhìn mỗi sáng. Bạn tìm được việc mới, lương không cao, nhưng trả đúng ngày mùng 5.',
        next: 'ting',
      },
      ting: {
        text: 'Ting. Bạn đứng giữa siêu thị và mỉm cười với một cái điện thoại. Không ai hiểu vì sao.',
        next: 'left-before',
      },
      'left-before': {
        routes: [
          {
            when: { type: 'not', condition: { type: 'flag', flag: 'heardDollars' } },
            next: 'the-slide',
          },
        ],
        otherwise: 'on-time',
      },
      'the-slide': {
        text: 'Hai tháng sau, một đồng nghiệp cũ gửi bạn ảnh chụp: công ty họp toàn thể, trên slide chỉ có một dòng "$1–2 TRIỆU".',
        next: 'what-a-pity',
      },
      'what-a-pity': {
        text: 'Rồi Phó giám đốc nhắn: "Nghe nói em đi rồi. Tiếc quá. Tiếc cho em thật sự. Em đi đúng trước đợt anh đào được 1–2 triệu đô, mà sắp IPO rồi, cổ phiếu nội bộ cũng không có phần em."',
        next: 'also-a-pity',
      },
      'also-a-pity': {
        text: 'Bạn đọc tin nhắn trong giờ nghỉ trưa, bên phần cơm mua bằng lương tháng này. Vẫn một khoản tiền chưa có, một đợt gọi vốn chưa xảy ra. Bạn cũng thấy tiếc. Tiếc là đã không đi sớm hơn.',
        next: 'missed-check',
      },
      'on-time': {
        text: 'Hôm nay là mùng 5. Bạn mua thêm một hộp sữa, chỉ vì mua được.',
        next: 'missed-check',
      },
      'missed-check': {
        routes: [{ when: { type: 'flag', flag: 'quitEarly' }, next: 'the-form' }],
        otherwise: 'year',
      },
      'the-form': {
        text: 'Rồi một buổi sáng, anh Huấn nhắn, lần đầu từ hôm bạn nghỉ. Kèm một tấm ảnh: tờ "Bản cam kết đồng hành". Không có ngày thanh toán, không có số tiền, chỉ có chỗ ký tên.',
        next: 'huni-asks',
      },
      'huni-asks': {
        speaker: 'deputy',
        text: 'Hôm nay Chủ tịch tới tận tầng mình. Trước 5 giờ chiều ai cũng phải chọn. Uyên có kế hoạch của Uyên, anh Roger có niềm tin của anh Roger. Em đi rồi nên anh mới hỏi thật: nếu còn ở đây, em chọn gì?',
        next: 'huni-reply',
      },
      'huni-reply': {
        text: 'Bạn gõ rồi xóa, gõ rồi xóa. Có những câu chỉ người ở lại mới trả lời được. Nhưng anh ấy vẫn đang đợi.',
        choices: [
          {
            id: 'warn-huni',
            text: 'Nhắn lại: "Anh đừng ký tờ nào không có ngày tháng"',
            next: 'huni-warned',
          },
          {
            id: 'leave-unread',
            text: 'Để đó. Mình đi rồi, chuyện đó không còn là của mình',
            next: 'huni-left',
          },
        ],
      },
      'huni-warned': {
        text: 'Anh Huấn thả một dấu tim, không nói gì thêm. Tuần sau bạn nghe tin anh đã nộp đơn, bàn giao đủ từng việc. Bạn không biết đó là vì câu của mình, hay anh đã quyết từ trước.',
        next: 'year',
      },
      'huni-left': {
        text: 'Tin nhắn vẫn nằm đó, trạng thái đã xem. Tối đó bạn ăn cơm, trả tiền điện đúng hạn, và ngủ không ngon lắm.',
        next: 'year',
      },
      year: {
        text: 'Một năm sau, quán cà phê gần công ty mới. Đồng nghiệp hỏi: "Công ty cũ của ông có dự án lớn lắm hả, giờ sao rồi?". Bạn nói: "Không biết. Nghe nói tuần sau có tiền".',
        next: 'message-check',
      },
      'message-check': {
        routes: [
          {
            when: {
              type: 'any',
              conditions: [
                { type: 'flag', flag: 'tookPromotion' },
                { type: 'flag', flag: 'namedUyen' },
                { type: 'flag', flag: 'signedWaiver' },
              ],
            },
            next: 'year-dan',
          },
        ],
        otherwise: 'year-uyen',
      },
      'year-dan': {
        text: 'Điện thoại rung, tin nhắn của Dân: "C* đang tuyển 20 người, ông ạ. Phúc lợi vẫn có trái cây thứ Sáu". Bạn nhắn lại: "Trái cây vẫn còn à?". Dân: "Còn. Chắc mùa này được mùa".',
      },
      'year-uyen': {
        text: 'Điện thoại rung, tin nhắn của Uyên: "C* đang tuyển 20 người. Phúc lợi vẫn có trái cây thứ Sáu". Bạn nhắn lại: "Trái cây vẫn còn à?". Uyên: "Ừ. Chắc mùa này được mùa".',
      },
    },
  },

  'ending-believer': {
    id: 'ending-believer',
    place: 'meeting',
    start: 'stage',
    nodes: {
      stage: {
        text: 'Cuối năm, bạn lên sân khấu nhận danh hiệu Nhân viên Trung thành. Sếp bắt tay bạn thật lâu trước ống kính.',
        next: 'boss',
      },
      boss: {
        speaker: 'boss',
        text: 'Đây là người hiểu thế nào là tầm nhìn. Năm sau chúng ta bứt phá.',
        next: 'seat',
      },
      seat: {
        text: 'Phòng họp chỉ còn lại mười hai người vỗ tay. Bạn nhìn tấm bằng khen, rồi nhìn sổ nợ. Con số đã dài thêm một chữ số.',
        next: 'tin-check',
      },
      'tin-check': {
        routes: [{ when: { type: 'flag', flag: 'rogerDoubts' }, next: 'tin-silent' }],
        otherwise: 'tin',
      },
      'tin-silent': {
        text: 'Anh Roger đứng ở hàng cuối, vỗ tay rất khẽ, và không nhìn lên sân khấu.',
        next: 'mom-check',
      },
      tin: {
        speaker: 'manager',
        text: 'Anh đã bảo mà. Next week là có thôi, rồi còn cổ phiếu nữa. Anh em mình chỉ cần tin thêm một chút.',
        next: 'mom-check',
      },
      'mom-check': {
        routes: [{ when: { type: 'flag', flag: 'toldMom' }, next: 'mom-asks' }],
        otherwise: 'year',
      },
      'mom-asks': {
        text: 'Mẹ xem ảnh tấm bằng khen bạn gửi về, rồi gọi hỏi: "Thế họ trả con chưa?". Bạn nói: "Next week, mẹ ạ". Câu đó bạn học ở đâu, bạn biết rõ.',
        next: 'year',
      },
      year: {
        text: 'Một năm sau. Bạn lên chức, có danh thiếp mới, có cả một cái bằng khen thứ hai. Anh Huni đã nộp đơn từ lâu, bàn giao đủ từng việc. Nhóm của bạn còn đúng một người là bạn. Trên tường, tấm ảnh tập thể mới chụp vừa khít trong khung nhỏ.',
        next: 'faith-check',
      },
      'faith-check': {
        routes: [{ when: { type: 'stat', stat: 'trust', max: 25 }, next: 'no-faith' }],
        otherwise: 'year-roger',
      },
      'no-faith': {
        text: 'Thật ra bạn không còn tin từ lâu rồi. Bạn chỉ không biết nếu thôi tin thì mình là ai ở đây.',
        next: 'year-roger',
      },
      'year-roger': {
        routes: [{ when: { type: 'flag', flag: 'rogerDoubts' }, next: 'roger-gone' }],
        otherwise: 'roger-stays',
      },
      'roger-gone': {
        text: 'Anh Roger đã về nước từ tháng trước, không tiệc chia tay. Anh gửi bạn một email, một dòng: "Anh xin lỗi vì đã nói next week nhiều như vậy".',
      },
      'roger-stays': {
        text: 'Anh Roger vẫn ngồi đó, tám năm thành chín năm. Sáng nay anh vỗ vai bạn: "Next week, hopefully". Bạn nghe mình trả lời: "Dạ, hopefully".',
      },
    },
  },

  'ending-empty-promise': {
    id: 'ending-empty-promise',
    place: 'desk',
    start: 'tried-check',
    nodes: {
      'tried-check': {
        routes: [{ when: { type: 'flag', flag: 'chosePursue' }, next: 'filed' }],
        otherwise: 'nothing',
      },
      filed: {
        text: 'Hồ sơ của bạn được đóng dấu "Đã tiếp nhận", rồi nằm đó. Giấy tờ còn thiếu, người đi cùng cũng không có, nên công ty chỉ cần chờ. Công ty rất giỏi chờ.',
        next: 'nothing',
      },
      nothing: {
        text: 'Sáng thứ Hai. Bạn mở máy. Có một ticket mới. Có một thông báo: lộ trình thanh toán tiếp tục được điều chỉnh.',
        next: 'by-heart',
      },
      'by-heart': {
        text: 'Ở hành lang, Phó giám đốc vỗ vai bạn: "This week nhé em. Chậm nhất next week." Bạn gật đầu. Bạn đã thuộc lòng câu đó.',
        next: 'same',
      },
      same: {
        text: 'Không ai đuổi bạn. Không ai trả bạn. Mọi thứ vẫn tiếp tục, y như một bài hát không có đoạn kết.',
        next: 'year-check',
      },
      'year-check': {
        routes: [{ when: { type: 'flag', flag: 'chosePursue' }, next: 'year-tried' }],
        otherwise: 'year',
      },
      'year-tried': {
        text: 'Một năm sau. Hay là hôm qua, bạn không còn chắc nữa. Bạn đã từng hỏi, từng ghi chép, từng nghĩ mình sẽ làm được gì đó. Sáng nay có email chào mừng một nhân viên mới. Bạn được giao hướng dẫn bạn ấy.',
      },
      year: {
        text: 'Một năm sau. Hay là hôm qua, bạn không còn chắc nữa. Bạn chưa từng sai ở nhiệm vụ nào, và từ hôm ký tờ cam kết cũng không còn phải quyết định điều gì. Sáng nay có email chào mừng một nhân viên mới. Bạn được giao hướng dẫn bạn ấy.',
      },
    },
  },

  'loop-renewal': {
    id: 'loop-renewal',
    place: 'home',
    start: 'mail',
    nodes: {
      mail: {
        text: 'Thứ Hai, 7 giờ 12 phút. Điện thoại rung. Một email gửi {name}, tiêu đề: "Chúc mừng! Hợp đồng của bạn đã được tự động gia hạn".',
        next: 'detail',
      },
      detail: {
        text: 'Lương: 15 triệu. Phúc lợi: văn hóa gia đình. Khoản nợ cũ được "chuyển tiếp sang kỳ phát triển mới". Bạn có cảm giác mình đã đọc email này rồi.',
      },
    },
  },

  'ch6-empty-office': {
    id: 'ch6-empty-office',
    place: 'office',
    start: 'early',
    nodes: {
      early: {
        text: 'Sáng thứ Hai, bạn đến sớm hơn mọi ngày. Những chiếc ghế trước đây luôn có người ngồi giờ đã được xếp ngay ngắn.',
        next: 'desk-check',
      },
      'desk-check': {
        routes: [{ when: { type: 'flag', flag: 'khoaSaidGoodbye' }, next: 'desk-clean' }],
        otherwise: 'desk-flask',
      },
      'desk-clean': {
        text: 'Bàn của Khoa trống, lau sạch, như chưa từng có ai ngồi.',
        next: 'wall',
      },
      'desk-flask': {
        text: 'Bàn của Khoa trống. Cái phích vẫn ở đó từ tháng 5. Không ai biết nên trả nó cho ai, cũng không ai muốn là người mang nó đi.',
        next: 'wall',
      },
      wall: {
        text: 'Bạn nhìn lên tường ảnh tập thể. Hôm đầu tiên tới đây, bạn thấy trên đó hơn một trăm gương mặt đang cười. Giờ bạn thử đếm những người còn ở lại, và dừng đếm khá sớm.',
        next: 'dan',
      },
      dan: {
        speaker: 'dan',
        text: 'Ông còn nhớ không? Từ hồi ông mới vào, tôi đã bảo công ty sắp gọi vốn. Câu đó chắc tôi nói hơn trăm lần rồi. Giờ tôi không biết nữa, nhưng tiền của tôi thì vẫn chưa về.',
        next: 'lunch-check',
      },
      'lunch-check': {
        routes: [{ when: { type: 'flag', flag: 'treatedTeam' }, next: 'lunch' }],
        otherwise: 'repay-check',
      },
      lunch: {
        text: 'Dân giơ điện thoại, tấm ảnh cũ ở quán cơm tấm hôm bạn mời cả nhóm. Trong ảnh có bốn người. Bây giờ còn ba.',
        next: 'repay-check',
      },
      'repay-check': {
        routes: [{ when: { type: 'flag', flag: 'helpedKhoa' }, next: 'repaid' }],
        otherwise: 'dragon-check',
      },
      repaid: {
        text: 'Ting. Tim bạn đập một nhịp. 1.000.000 đ, nội dung: "KHOA TRA BAN. TUAN SAU CHAC CHAN LUON". Đó là lời hứa "tuần sau" duy nhất ở đây được giữ.',
        effects: [{ type: 'addCash', amount: 1_000_000 }],
        next: 'dragon-check',
      },
      'dragon-check': {
        routes: [{ when: { type: 'flag', flag: 'joinedDragons' }, next: 'dragons' }],
        otherwise: 'milk-check',
      },
      dragons: {
        text: 'Nhóm Vượt thác còn năm người. Họp 7 giờ sáng vẫn họp, chủ yếu để điểm danh nhau.',
        next: 'milk-check',
      },
      'milk-check': {
        routes: [{ when: { type: 'crisisCount', crisis: 'burnout', min: 1 }, next: 'milk' }],
        otherwise: 'uyen-check',
      },
      milk: {
        text: 'Trên bàn bạn có một hộp sữa, không ghi tên. Từ hôm bạn nằm nhà cả tuần, thỉnh thoảng lại có một hộp như vậy.',
        next: 'uyen-check',
      },
      'uyen-check': {
        routes: [
          { when: { type: 'flag', flag: 'namedUyen' }, next: 'uyen-knows' },
          // Taking the title afterwards undoes it: she stopped writing the day the cards came.
          {
            when: {
              type: 'all',
              conditions: [
                { type: 'flag', flag: 'stoodWithUyen' },
                { type: 'flag', flag: 'joinedGroup' },
              ],
            },
            next: 'uyen-stood',
          },
        ],
        otherwise: 'uyen',
      },
      'uyen-knows': {
        speaker: 'uyen',
        text: 'Mấy hôm trước mình bị gọi lên phòng họp nhỏ, người ta gọi đúng tên mình. Mình biết ai đã nói rồi. Mình không hỏi đâu. Từ hôm nay hồ sơ của nhóm không để chỗ cũ nữa.',
        next: 'knows-check',
      },
      'knows-check': {
        routes: [{ when: { type: 'flag', flag: 'joinedGroup' }, next: 'own-up' }],
        otherwise: 'huni',
      },
      'own-up': {
        speaker: 'player',
        text: 'Uyên không hỏi. Nhưng cô vẫn đứng đó, đợi xem bạn có nói gì không.',
        choices: [
          {
            id: 'confess',
            text: 'Nhận: "Là mình. Mình gửi hết giấy tờ mình có cho nhóm"',
            requires: { type: 'stat', stat: 'evidenceCount', min: 3 },
            lockedReason: 'Cần ít nhất 3 giấy tờ để nhóm còn tin bạn',
            effects: [
              { type: 'addRelation', npc: 'uyen', amount: -10 },
              { type: 'addStress', amount: 6 },
            ],
            next: 'kept-on',
          },
          {
            id: 'say-nothing',
            text: 'Không nói gì',
            effects: [
              { type: 'setFlag', flag: 'joinedGroup', value: false },
              { type: 'addRelation', npc: 'uyen', amount: -20 },
            ],
            next: 'dropped',
          },
        ],
      },
      'kept-on': {
        speaker: 'uyen',
        text: 'Giấy tờ thì mình nhận. Tên bạn vẫn ở trong danh sách, dòng cuối. Chuyện kia để sau.',
        next: 'huni',
      },
      dropped: {
        text: 'Uyên gật đầu, như thể đó cũng là một câu trả lời. Tối đó nhóm chat không còn trong danh sách của bạn nữa.',
        next: 'huni',
      },
      'uyen-stood': {
        speaker: 'uyen',
        text: 'Mình nghe chuyện hôm đó với chị HR rồi. Mấy hôm nay mọi người bắt đầu gửi hồ sơ cho bạn giữ cùng, bạn thấy chưa? Không phải tự nhiên đâu.',
        next: 'uyen',
      },
      uyen: {
        speaker: 'uyen',
        text: 'Mình lưu hết rồi. Hợp đồng, bảng công, email, sao kê. Còn lại là việc của mỗi người.',
        next: 'huni',
      },
      huni: {
        speaker: 'deputy',
        text: 'Hôm nay Chủ tịch tới. Mấy năm rồi ông ấy chưa lên tận tầng này, chắc email gửi lên nhiều quá. Anh nghĩ đến lúc mọi người phải tự quyết định rồi. Anh cũng vậy.',
      },
    },
  },
};
