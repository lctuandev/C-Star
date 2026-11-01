const COMPANY_PAYS_ALL = 1_000_000_000;

/** Chương 6 — The Last Day (GDD §3), and the six endings (GDD §6). */
export const chapter6Scenes = {
  'ch6-last-day': {
    id: 'ch6-last-day',
    place: 'office',
    start: 'morning',
    nodes: {
      morning: {
        text: 'Sáng thứ Hai. Dòng chữ inox ở sảnh đã rơi mất hai ký tự. Cái bức tường cây thì đã thành bức tường.',
        next: 'boss',
      },
      boss: {
        speaker: 'boss',
        text: 'Em vào anh bảo. Tình hình rồi sẽ ổn thôi. Chúng ta còn nhiều dự án lớn lắm. Em nghĩ kỹ chưa?',
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
            text: 'Ở lại, cho công ty thêm một cơ hội',
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
        text: 'Dạ. Em sẽ cố gắng thêm ạ.',
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
        text: 'Ting. Lần này bạn không reo lên. Bạn chỉ ngồi yên một lúc, rồi trả nốt tiền cho người đã cho bạn mượn.',
        effects: [{ type: 'companyPays', amount: COMPANY_PAYS_ALL }],
        next: 'uyen',
      },
      uyen: {
        speaker: 'uyen',
        text: 'Xong rồi. Mình xóa file được chưa? Thôi, để lại. Mình quen tay rồi.',
        next: 'end',
      },
      end: {
        text: 'Bạn bắt đầu một công việc mới. Hôm ký hợp đồng, bạn đọc hết, kể cả trang cỡ chữ 6.',
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
        text: 'Công ty chốt lộ trình trả dần cho cả nhóm. Không trọn vẹn, nhưng có văn bản, và lần này là chung một văn bản.',
        effects: [{ type: 'companyPays', amount: 30_000_000 }],
        next: 'dan',
      },
      dan: {
        speaker: 'uyen',
        text: 'Không ai trong chúng ta là trường hợp đặc biệt. Đó là điều mình mừng nhất.',
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
        effects: [{ type: 'companyPays', amount: 45_000_000 }],
        next: 'after',
      },
      after: {
        text: 'Một đồng nghiệp cũ nhắn hỏi bạn đã làm thế nào. Bạn gửi cho họ danh sách những thứ nên giữ. Danh sách đó bắt đầu được chuyền tay.',
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
      },
    },
  },

  'ending-empty-promise': {
    id: 'ending-empty-promise',
    place: 'desk',
    start: 'nothing',
    nodes: {
      nothing: {
        text: 'Sáng thứ Hai. Bạn mở máy. Có một ticket mới. Có một thông báo: lộ trình thanh toán tiếp tục được điều chỉnh.',
        next: 'same',
      },
      same: {
        text: 'Không ai đuổi bạn. Không ai trả bạn. Mọi thứ vẫn tiếp tục, y như một bài hát không có đoạn kết.',
      },
    },
  },

  'loop-renewal': {
    id: 'loop-renewal',
    place: 'home',
    start: 'mail',
    nodes: {
      mail: {
        text: 'Thứ Hai, 7 giờ 12 phút. Điện thoại rung. Một email có tiêu đề: "Chúc mừng! Hợp đồng của bạn đã được tự động gia hạn".',
        next: 'detail',
      },
      detail: {
        text: 'Lương: 15 triệu. Phúc lợi: văn hóa gia đình. Khoản nợ cũ được "chuyển tiếp sang kỳ phát triển mới". Bạn có cảm giác mình đã đọc email này rồi.',
      },
    },
  },
};
