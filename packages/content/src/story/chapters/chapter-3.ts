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
              { type: 'addAwareness', amount: 6 },
              { type: 'addTrust', amount: -4 },
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
              { type: 'addTrust', amount: 5 },
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
        text: 'Ting. Tim bạn đập một nhịp. 10.000.000 đ, hai phần ba tháng lương. Nội dung: "TAM UNG DOT 1 LUONG T2".',
        effects: [{ type: 'companyPays', amount: 10_000_000 }],
        next: 'accountant',
      },
      accountant: {
        speaker: 'accountant',
        text: 'Đợt 1 là hai phần ba của tháng 2. Đợt 2 sẽ chuyển khi đợt 1 của tháng 3 hoàn tất, trừ phần đã ứng cho đợt 1 của đợt trước. Em hiểu chứ?',
        next: 'hmm',
      },
      hmm: {
        speaker: 'player',
        text: 'Dạ... chắc là không ạ.',
        next: 'accountant-2',
      },
      'accountant-2': {
        speaker: 'accountant',
        text: 'Không sao. Cô cũng không. Cô chỉ nhập số thôi.',
        next: 'seat-check',
      },
      'seat-check': {
        routes: [{ when: { type: 'flag', flag: 'satWithUyen' }, next: 'neighbour' }],
        otherwise: 'uyen-idea',
      },
      neighbour: {
        text: 'Ngồi cạnh Uyên từ ngày đầu, bạn thấy tập hồ sơ của cô dày lên từng tháng. Hôm nay cô quay ghế sang phía bạn.',
        next: 'uyen-idea',
      },
      'uyen-idea': {
        speaker: 'uyen',
        text: 'Mình ghi từng khoản, từng lời hứa, đủ ngày giờ. Hồi công ty cũ đóng cửa, mình không có nổi một tờ giấy để đối chiếu. Lần này thì khác. Bạn làm cùng không?',
        choices: [
          {
            id: 'start-notes',
            text: 'Được, mình bắt đầu từ hôm nay',
            effects: [
              { type: 'addAwareness', amount: 15 },
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
        text: 'Mọi người ơi, tháng này ai dư hong, cho mình mượn tạm tiền nhà với, toang thật rồi. Tuần sau có lương là mình trả liền!',
        next: 'react',
      },
      react: {
        text: 'Khoa vẫn cười. Nhưng đây là lần đầu bạn thấy Khoa cười mà mắt không cười theo.',
        choices: [
          {
            id: 'lend',
            text: 'Cho Khoa mượn 1 triệu',
            requires: { type: 'stat', stat: 'cash', min: 1_000_000 },
            lockedReason: 'Trong ví không còn đủ 1 triệu',
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
        text: 'Hong sao đâu! Mình hỏi chơi thôi! Tuần sau có rồi mà!',
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
        next: 'star-check',
      },
      'star-check': {
        routes: [{ when: { type: 'flag', flag: 'volunteeredKpi' }, next: 'star' }],
        otherwise: 'saved-check',
      },
      star: {
        text: 'Bạn đăng ký chỉ tiêu cao nhất, nên huy hiệu của bạn có thêm một ngôi sao. Ngôi sao cũng là PNG.',
        next: 'saved-check',
      },
      'saved-check': {
        routes: [{ when: { type: 'flag', flag: 'savedFirstPay' }, next: 'savings' }],
        otherwise: 'hr',
      },
      savings: {
        text: 'Tối đó bạn mở khoản tiết kiệm từ tháng đầu, lần đầu rút ra để đóng tiền nhà. Bạn thầm cảm ơn chính mình của tháng 1.',
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
        next: 'uyen-thanks',
      },
      'uyen-thanks': {
        speaker: 'uyen',
        text: 'Cảm ơn bạn. Ít nhất lần này mình không phải người duy nhất hỏi.',
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
        text: 'Bạn ấy có hỏi mình cách lấy lại giấy tờ trước khi đi. Nghỉ việc không xóa được khoản đã làm, nhưng không có giấy thì khó đòi.',
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
        text: 'Thông báo chung: công ty đã ghi nhận các thắc mắc của cả nhà. Khi có thông tin, công ty sẽ thông báo. Cảm ơn sự kiên nhẫn phi thường của cả nhà!',
        next: 'reaction',
      },
      reaction: {
        speaker: 'khoa',
        text: 'Vậy là... sắp có thông tin rồi đúng không mọi người?',
        next: 'uyen',
      },
      uyen: {
        speaker: 'uyen',
        text: 'Hai tháng rồi, họ vẫn chưa đưa ra một ngày cụ thể. Mình lưu email này lại. Ít nhất sau này biết họ đã nói gì, vào lúc nào.',
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
        text: 'Bạn mở lịch ra. Trái tim nhỏ của tháng đầu tiên vẫn còn đó. Bạn định xóa nó đi, rồi thôi.',
      },
    },
  },

  'ch3-next-week': {
    id: 'ch3-next-week',
    place: 'hallway',
    start: 'corner',
    nodes: {
      corner: {
        text: 'Bạn gặp Phó giám đốc ở hành lang, lúc anh đang vội đi đâu đó. Cơ hội hiếm hoi để hỏi riêng.',
        next: 'ask',
      },
      ask: {
        speaker: 'player',
        text: 'Dạ anh ơi, phần lương còn lại của tháng trước bao giờ có ạ?',
        next: 'promise',
      },
      promise: {
        speaker: 'boss',
        text: 'This week nhé em. Anh vừa nói chuyện với bên kia xong. Chậm nhất là next week.',
        next: 'tin',
      },
      tin: {
        speaker: 'manager',
        text: 'Em thấy chưa, anh đã bảo mà. Chủ tịch chưa bỏ ai bao giờ. Mình cứ làm tốt phần mình, tiền là chuyện của những người có tầm nhìn.',
        next: 'minh',
      },
      minh: {
        speaker: 'deputy',
        text: 'Anh cũng chưa có lương, nên anh không nói "this week" với em được. Em nhớ giữ giấy tờ của mình cho cẩn thận nhé. Anh nói với tư cách người đi làm lâu năm thôi.',
        choices: [
          {
            id: 'thank-minh',
            text: 'Cảm ơn anh Huni, và về xem lại thư mục giấy tờ',
            effects: [
              { type: 'addRelation', npc: 'deputy', amount: 8 },
              { type: 'addAwareness', amount: 8 },
            ],
            next: 'after-minh',
          },
          {
            id: 'side-with-tin',
            text: 'Anh Roger ở đây tám năm rồi, chắc anh ấy biết',
            effects: [
              { type: 'addRelation', npc: 'manager', amount: 8 },
              { type: 'addRelation', npc: 'boss', amount: 3 },
            ],
            next: 'after-tin',
          },
        ],
      },
      'after-minh': {
        text: 'Anh Huấn gật đầu rồi quay lại với chồng việc của cả phòng. Anh ấy yêu nơi này thật, bạn nhìn là biết. Anh không hứa với bạn điều gì. Có lẽ anh cũng không biết nên tin vào điều gì nữa.',
      },
      'after-tin': {
        text: 'Anh Roger vỗ vai bạn hai cái. Bạn thấy vững lòng được đúng tới giờ ăn trưa.',
      },
    },
  },

  'ch3-other-offer': {
    id: 'ch3-other-offer',
    place: 'home',
    start: 'message',
    nodes: {
      message: {
        text: 'Một người bạn cũ nhắn: bên họ đang thiếu người. Lương thấp hơn một chút, không có tầm nhìn nào hết, nhưng trả đúng ngày. Họ cần câu trả lời trong tuần.',
        next: 'weigh',
      },
      weigh: {
        speaker: 'player',
        text: 'Bốn tháng rồi. Đi bây giờ thì khoản đang bị nợ tính sao? Mà ở lại thì nó chỉ dài thêm.',
        choices: [
          {
            id: 'stay-on',
            text: 'Từ chối. Nghỉ lúc này thì chưa biết phải đòi khoản còn thiếu thế nào',
            effects: [{ type: 'setFlag', flag: 'turnedDownFriend' }],
            next: 'stayed',
          },
          {
            id: 'walk-now',
            text: 'Nhận lời. Rời đi ngay, trước khi con số dài thêm',
            effects: [
              { type: 'setFlag', flag: 'quitEarly' },
              { type: 'setFlag', flag: 'runOver' },
            ],
            next: 'walked',
          },
        ],
      },
      stayed: {
        text: 'Bạn nhắn lại "cảm ơn nha". Người bạn trả lời bằng một cái mặt cười hơi buồn.',
      },
      walked: {
        text: 'Anh Huấn là người ký giấy cho bạn. "Đi đi em, chuyện này không có gì phải ngại." Anh Roger thì không ra chào: anh nói bạn đã bỏ rơi tầm nhìn.',
      },
    },
  },

  'ch3-dragon': {
    id: 'ch3-dragon',
    place: 'meeting',
    start: 'banner',
    nodes: {
      banner: {
        text: 'Sáng thứ Hai, cửa phòng họp dán một tấm băng rôn đỏ có hình con cá chép: "CHIẾN DỊCH VƯỢT THÁC HÓA RỒNG".',
        next: 'hr',
      },
      hr: {
        speaker: 'hr',
        text: 'Cả nhà ơi! Công ty lập nhóm tiên phong Vượt Thác Hóa Rồng, dành cho những ai muốn cống hiến nhiều hơn. Tăng ca tự nguyện, họp 7 giờ sáng, và cuối tuần là của chung.',
        next: 'benefit',
      },
      benefit: {
        speaker: 'hr',
        text: 'Benefit đặc biệt: thành viên nhóm được nhận trước một phần lương! Một phần thôi nhé cả nhà, phần còn lại là động lực.',
        next: 'room',
      },
      room: {
        text: 'Cả phòng im lặng một nhịp. Bạn đọc lại câu đó trên slide. Lương tháng trước, cho việc bạn đã làm xong, nay là một benefit.',
        next: 'tin',
      },
      tin: {
        speaker: 'manager',
        text: 'Anh đăng ký cả phòng rồi nhé. Đùa thôi, nhưng ai là người của công ty thì tự biết phải làm gì. Cá chép nào mà chẳng phải vượt thác.',
        next: 'minh',
      },
      minh: {
        speaker: 'deputy',
        text: 'Anh không cấm ai, ai cũng có hóa đơn cả. Anh chỉ thấy lạ là tiền mình làm ra rồi mà giờ phải xin bằng cách làm thêm.',
        choices: [
          {
            id: 'stay-fish',
            text: 'Không đăng ký. Mình đã vượt đủ thác trong giờ làm rồi',
            effects: [
              { type: 'addRelation', npc: 'manager', amount: -5 },
              { type: 'addRelation', npc: 'deputy', amount: 4 },
            ],
            next: 'stayed-fish',
          },
          {
            id: 'join-dragons',
            text: 'Đăng ký. Tiền nhà thì không chờ được',
            effects: [
              { type: 'setFlag', flag: 'joinedDragons' },
              { type: 'addTrust', amount: 6 },
              { type: 'companyPays', amount: 5_000_000 },
              { type: 'addEnergy', amount: -12 },
              { type: 'addStress', amount: 5 },
              { type: 'addRelation', npc: 'boss', amount: 5 },
              { type: 'addRelation', npc: 'manager', amount: 8 },
            ],
            next: 'joined-dragons',
          },
        ],
      },
      'stayed-fish': {
        text: 'Bạn về chỗ. Trên nhóm chat, danh sách thành viên dài dần. Uyên chụp lại tấm băng rôn. Không có gì đâu, quen tay thôi.',
      },
      'joined-dragons': {
        text: 'Ting. 5.000.000 đ, nội dung "BENEFIT VUOT THAC". Vẫn chỉ một phần ba tháng lương, và trong sổ của bạn nó chỉ là phần còn thiếu của tháng 2. Tối đó bạn ở lại tới 10 giờ: lần đầu tiên bạn làm thêm để được trả tiền cho việc đã làm.',
      },
    },
  },

  'ch3-weekly-sync': {
    id: 'ch3-weekly-sync',
    place: 'meeting',
    start: 'friday',
    nodes: {
      friday: {
        text: 'Chiều thứ Sáu, weekly sync với anh Roger. Mỗi người báo cáo tiến độ một lượt. Tới lượt bạn, bạn báo xong việc rồi khẽ hỏi chuyện lương.',
        next: 'tin',
      },
      tin: {
        speaker: 'manager',
        text: 'Anh có hỏi rồi. Next week, hopefully.',
        next: 'what',
      },
      what: {
        speaker: 'player',
        text: 'Dạ "hopefully" là sao anh?',
        next: 'tin-2',
      },
      'tin-2': {
        speaker: 'manager',
        text: 'Là mình phải có niềm tin, em ạ. Tuần sau mình sync tiếp.',
        next: 'refresh',
      },
      refresh: {
        text: 'Anh vừa nói vừa bấm tải lại hộp thư, dù chẳng có email nào mới.',
        next: 'minh',
      },
      minh: {
        speaker: 'deputy',
        text: 'Từ giờ thứ Sáu nào em cũng sẽ nghe câu đó. Anh Roger không nói dối đâu, anh ấy tin thật. Em cứ báo cáo cho đủ, việc mình làm thì mình làm đàng hoàng.',
      },
    },
  },

  'ch3-no-news': {
    id: 'ch3-no-news',
    place: 'hallway',
    start: 'corner',
    nodes: {
      corner: {
        text: 'Góc pantry dạo này đông hơn phòng họp. Không ai còn nói chuyện dự án. Nhóm chat công ty thì im, hỏi gì cũng chỉ nhận về một trái tim của chị HR.',
        next: 'dan',
      },
      dan: {
        speaker: 'dan',
        text: 'Tôi không sợ chậm, tôi sợ không ai nói gì. Nhà đầu tư nào cũng có báo cáo. Bọn mình làm ở đây mà không biết công ty còn bao nhiêu tiền. Tôi hỏi ba người về cái biên bản ghi nhớ rồi, chưa ai tận mắt thấy.',
        next: 'khoa',
      },
      khoa: {
        speaker: 'khoa',
        text: 'Chủ nhà nhắn mà mình seen hoài cũng kỳ, trả lời thì biết nói gì. Cười hoài cũng mệt á.',
        next: 'intern',
      },
      intern: {
        text: 'Một bạn thực tập nhắn vào nhóm chung: "Cho em hỏi tuần sau là tuần nào ạ, em hỏi thật". Hai phút sau tin nhắn bị thu hồi.',
        next: 'uyen',
      },
      uyen: {
        speaker: 'uyen',
        text: 'Năm tuần rồi, không có một thông báo nào về kế hoạch trả. Có người còn đang tính nghỉ, mà nghỉ thì tiền ai trả.',
        next: 'huni',
      },
      huni: {
        speaker: 'deputy',
        text: 'Anh hỏi lên trên ba lần rồi, đều chưa có câu trả lời. Anh xin lỗi, anh không có gì hơn để nói với các em.',
        choices: [
          {
            id: 'grumble',
            text: 'Than với nhóm một lúc rồi về làm tiếp',
            effects: [
              { type: 'addStress', amount: -3 },
              { type: 'addRelation', npc: 'khoa', amount: 3 },
            ],
            next: 'grumbled',
          },
          {
            id: 'ask-in-chat',
            text: 'Hỏi thẳng trong nhóm chung: "Công ty có kế hoạch trả lương chưa ạ?"',
            effects: [
              { type: 'addStress', amount: 5 },
              { type: 'addRelation', npc: 'hr', amount: -6 },
              { type: 'addRelation', npc: 'deputy', amount: 4 },
            ],
            next: 'asked',
          },
        ],
      },
      grumbled: {
        text: 'Than xong thấy nhẹ người được một lúc. Rồi ai về chỗ nấy, mở ticket lên, như chưa có chuyện gì.',
      },
      asked: {
        text: 'Tin nhắn của bạn được 43 lượt thả tim trong năm phút, từ những người chưa bao giờ dám hỏi. Chị HR đã xem. Không ai trả lời.',
      },
    },
  },
};
