/** Not chapters: they play when the player hits a wall, at most once a month (GDD §5.1, §5.2). */
export const crisisScenes = {
  'crisis-broke': {
    id: 'crisis-broke',
    place: 'home',
    start: 'empty',
    nodes: {
      empty: {
        text: 'Ví không còn đủ trả hết hóa đơn. Chủ nhà nhắn tin rất lịch sự, kiểu lịch sự làm người ta mất ngủ.',
        effects: [{ type: 'addStress', amount: 6 }],
        next: 'options',
      },
      options: {
        speaker: 'player',
        text: 'Phải làm gì đó ngay trong tuần này.',
        choices: [
          {
            id: 'borrow',
            text: 'Vay bạn thân 5 triệu',
            effects: [
              { type: 'takeLoan', amount: 5_000_000 },
              { type: 'payArrears' },
              { type: 'addStress', amount: 4 },
            ],
            next: 'borrowed',
          },
          {
            id: 'sell',
            text: 'Bán chiếc máy ảnh cũ',
            effects: [
              { type: 'addCash', amount: 2_500_000 },
              { type: 'payArrears' },
              { type: 'addStress', amount: 2 },
            ],
            next: 'sold',
          },
          {
            id: 'call-home',
            text: 'Gọi về nhà',
            effects: [
              { type: 'takeLoan', amount: 3_000_000 },
              { type: 'payArrears' },
              { type: 'addStress', amount: 8 },
              { type: 'setFlag', flag: 'calledHome' },
            ],
            next: 'called',
          },
          {
            id: 'quit',
            text: 'Đủ rồi. Nghỉ việc, về quê làm lại từ đầu',
            requires: { type: 'crisisCount', crisis: 'broke', min: 3 },
            lockedReason: 'Chưa tới mức phải bỏ hết mọi thứ',
            effects: [
              { type: 'setFlag', flag: 'quitEarly' },
              { type: 'setFlag', flag: 'runOver' },
            ],
            next: 'quit-line',
          },
        ],
      },
      borrowed: {
        text: 'Bạn thân chuyển ngay, không hỏi gì. Tiếng "ting" đầu tiên sau nhiều tháng, và nó đến từ người cũng đang đi làm thuê.',
      },
      sold: {
        text: 'Người mua trả tiền đúng hẹn. Bạn đứng nhìn cái túi đựng máy ảnh rỗng một lúc. Đó là khoản thu đúng hạn duy nhất của tháng.',
      },
      called: {
        text: 'Mẹ không hỏi nhiều, chỉ bảo "có gì về nhà ăn cơm". Bạn nói "dạ" rồi nhìn trần nhà một lúc lâu.',
      },
      'quit-line': {
        speaker: 'player',
        text: 'Lần thứ ba. Mình không thể tiếp tục trả tiền để được đi làm nữa.',
      },
    },
  },

  'crisis-burnout': {
    id: 'crisis-burnout',
    place: 'home',
    start: 'wall',
    nodes: {
      wall: {
        text: 'Sáng nay bạn mở mắt, nhìn đồng hồ, và cơ thể đơn giản là không nhận lệnh.',
        next: 'lost',
      },
      lost: {
        text: 'Bạn nằm cả ngày. Rồi hai ngày. Điện thoại có 47 tin nhắn, một nửa bắt đầu bằng "em ơi".',
        effects: [
          { type: 'loseWeek' },
          { type: 'addEnergy', amount: 45 },
          { type: 'addStress', amount: -25 },
        ],
        next: 'after',
      },
      after: {
        text: 'Hết tuần bạn dậy được, thấy mình như một tài liệu chưa lưu. Không ai trong công ty hỏi vì sao. KPI thì có.',
      },
    },
  },
};
