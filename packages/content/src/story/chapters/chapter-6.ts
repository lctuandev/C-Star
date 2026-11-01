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
        text: 'Ông ấy không nhớ tên công ty. Tám năm, em ạ. Ông ấy không nhớ tên công ty.',
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
        next: 'boss-asks',
      },
      'boss-asks': {
        speaker: 'boss',
        text: 'Em nghĩ kỹ chưa?',
        next: 'choice',
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
            effects: [
              { type: 'setFlag', flag: 'choseStay' },
              { type: 'setFlag', flag: 'runOver' },
            ],
            next: 'stay-line',
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
        next: 'ting',
      },
      ting: {
        text: 'Ting. Lần này bạn không reo lên, dù cả phần KPI bị giữ cũng đã về. Bạn chỉ ngồi yên một lúc.',
        effects: [{ type: 'companyPays', amount: COMPANY_PAYS_ALL }],
        next: 'loan-check',
      },
      'loan-check': {
        routes: [{ when: { type: 'stat', stat: 'loans', min: 1 }, next: 'repay' }],
        otherwise: 'call-home',
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
        text: 'Công ty chốt lộ trình trả dần cho cả nhóm. Không trọn vẹn, nhưng có văn bản, và lần này là chung một văn bản. Đợt đầu về tài khoản bạn 30 triệu.',
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
        next: 'roger-check',
      },
      'roger-check': {
        routes: [{ when: { type: 'flag', flag: 'rogerDoubts' }, next: 'roger-signs' }],
        otherwise: 'year',
      },
      'roger-signs': {
        text: 'Hôm cuối, anh Roger đến trễ, không nói gì, ký vào dòng cuối của danh sách. Anh xin lỗi từng người anh đã giới thiệu vào công ty, từng người một. Có người gật đầu. Có người không nhìn anh. Anh không giải thích thêm.',
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
        next: 'new',
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
        next: 'year',
      },
      'on-time': {
        text: 'Hôm nay là mùng 5. Bạn mua thêm một hộp sữa, chỉ vì mua được.',
        next: 'year',
      },
      year: {
        text: 'Một năm sau, quán cà phê gần công ty mới. Đồng nghiệp hỏi: "Công ty cũ của ông có dự án lớn lắm hả, giờ sao rồi?". Bạn nói: "Không biết. Nghe nói tuần sau có tiền".',
        next: 'year-uyen',
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
        next: 'year',
      },
      tin: {
        speaker: 'manager',
        text: 'Anh đã bảo mà. Next week là có thôi, rồi còn cổ phiếu nữa. Anh em mình chỉ cần tin thêm một chút.',
        next: 'year',
      },
      year: {
        text: 'Một năm sau. Bạn lên chức, có danh thiếp mới, có cả một cái bằng khen thứ hai. Anh Huni đã nộp đơn từ lâu, bàn giao đủ từng việc. Nhóm của bạn còn đúng một người là bạn. Trên tường, tấm ảnh tập thể mới chụp vừa khít trong khung nhỏ.',
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
        text: 'Một năm sau. Hay là hôm qua, bạn không còn chắc nữa. Bạn chưa từng sai ở nhiệm vụ nào, và cũng chưa từng quyết định điều gì. Sáng nay có email chào mừng một nhân viên mới. Bạn được giao hướng dẫn bạn ấy.',
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
        text: 'Ông còn nhớ hôm đầu tiên không? Tôi bảo ông công ty sắp gọi vốn. Câu đó chắc tôi nói hơn trăm lần rồi. Giờ tôi không biết nữa, nhưng tiền của tôi thì vẫn chưa về.',
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
        otherwise: 'uyen',
      },
      repaid: {
        text: 'Ting. Tim bạn đập một nhịp. 1.000.000 đ, nội dung: "KHOA TRA BAN. TUAN SAU CHAC CHAN LUON". Đó là lời hứa "tuần sau" duy nhất ở đây được giữ.',
        effects: [{ type: 'addCash', amount: 1_000_000 }],
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
