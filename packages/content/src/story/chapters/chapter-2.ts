/** Chương 2 — Payment Delay (GDD §3). */
export const chapter2Scenes = {
  'ch2-new-month': {
    id: 'ch2-new-month',
    place: 'hallway',
    start: 'machine',
    nodes: {
      machine: {
        text: 'Thứ Hai. Máy pha cà phê to bằng cái tủ lạnh không còn ở sảnh. Chỗ đó giờ là một tờ giấy A4 dán tường.',
        next: 'notice',
      },
      notice: {
        text: '"Nhằm tối ưu không gian trải nghiệm, công ty chuyển sang mô hình cà phê cá nhân. Hãy mang theo đam mê và phích nước của bạn."',
        next: 'dan-reads',
      },
      'dan-reads': {
        speaker: 'dan',
        text: 'Tối ưu đấy. Công ty lớn nào trước khi gọi vốn cũng phải tinh gọn. Đây là tín hiệu tốt, ông tin tôi.',
        next: 'uyen-photo',
      },
      'uyen-photo': {
        speaker: 'uyen',
        text: 'Mình chụp lại tờ này. Không có gì đâu, mình quen tay thôi.',
        next: 'khoa-mug',
      },
      'khoa-mug': {
        speaker: 'khoa',
        text: 'Mình có phích rồi nè! Phích công ty tặng năm ngoái đó, xịn lắm!',
      },
    },
  },

  'ch2-small-signs': {
    id: 'ch2-small-signs',
    place: 'desk',
    start: 'accountant',
    nodes: {
      accountant: {
        text: 'Bạn đi ngang phòng kế toán. Cô Kế toán đang nghe điện thoại, tay che ống nói, mắt nhìn vào một bảng tính đỏ gần hết.',
        next: 'overheard',
      },
      overheard: {
        speaker: 'accountant',
        text: '...dạ em hiểu, nhưng đợt 2 của tháng trước mới là đợt 1 của tháng này, anh hiểu ý em không ạ...',
        next: 'caught',
      },
      caught: {
        text: 'Cô ngẩng lên, thấy bạn, và đóng laptop lại nhẹ nhàng như đóng một quan tài.',
        next: 'what-do',
      },
      'what-do': {
        speaker: 'accountant',
        text: 'Em cần gì không?',
        choices: [
          {
            id: 'ask-straight',
            text: '"Dạ tháng này lương có đúng ngày không cô?"',
            effects: [
              { type: 'setFlag', flag: 'askedAccountant' },
              { type: 'addRelation', npc: 'accountant', amount: 5 },
            ],
            next: 'straight',
          },
          { id: 'pretend', text: '"Dạ em tìm bút thôi ạ"', next: 'pen' },
        ],
      },
      straight: {
        speaker: 'accountant',
        text: 'Lương là bên cô xử lý theo quy trình. Quy trình thì bên trên xử lý. Bên trên thì, em biết đấy, ở bên trên.',
        next: 'end',
      },
      pen: {
        speaker: 'accountant',
        text: 'Bút hả. Em lấy đi. Bút thì còn.',
        next: 'end',
      },
      end: {
        text: 'Bạn cầm cây bút quay về chỗ. Có một cảm giác rất nhỏ, như khi bạn nhận ra mình để quên chìa khóa nhưng chưa chắc.',
      },
    },
  },

  'ch2-payday-silence': {
    id: 'ch2-payday-silence',
    place: 'desk',
    start: 'morning',
    nodes: {
      morning: {
        text: 'Ngày mùng 5. 10 giờ 41 phút. Bạn đặt điện thoại ngửa mặt lên bàn. Không có gì xảy ra.',
        next: 'noon',
      },
      noon: {
        text: '12 giờ. Bạn mở ứng dụng ngân hàng, kéo xuống để tải lại. Rồi kéo lần nữa. Rồi đăng xuất, đăng nhập lại, cho chắc.',
        next: 'afternoon',
      },
      afternoon: {
        text: '15 giờ. Không có tiếng "ting". Bạn chưa bao giờ nghe sự im lặng to đến thế.',
        effects: [{ type: 'addStress', amount: 5 }],
        next: 'group',
      },
      group: {
        speaker: 'khoa',
        text: 'Ủa mọi người ơi, có ai nhận lương chưa vậy? Hay app ngân hàng mình bị lag?',
        next: 'group-dan',
      },
      'group-dan': {
        speaker: 'dan',
        text: 'Chưa ông. Chắc đang chờ lệnh chuyển tiền của nhà đầu tư, tiền quốc tế nó có độ trễ.',
        next: 'hr-post',
      },
      'hr-post': {
        speaker: 'hr',
        text: 'Thông báo chung: Như đã chia sẻ, do tình hình khó khăn chung, lương tháng này sẽ được xử lý trong thời gian sớm nhất. Mong cả nhà đợi thêm một chút. Cảm ơn sự đồng hành của cả nhà!',
        next: 'react',
      },
      react: {
        text: 'Một trăm hai mươi người bấm "đã xem". Không ai bấm gì khác. Bạn nhìn vào ô nhập tin nhắn.',
        choices: [
          {
            id: 'ask-public',
            text: 'Hỏi trong nhóm chung: "Sớm nhất là ngày nào ạ?"',
            effects: [
              { type: 'setFlag', flag: 'askedHrInPublic' },
              { type: 'addStress', amount: 4 },
              { type: 'addRelation', npc: 'hr', amount: -8 },
              { type: 'addRelation', npc: 'uyen', amount: 6 },
            ],
            next: 'public-answer',
          },
          {
            id: 'ask-private',
            text: 'Nhắn riêng chị HR cho lịch sự',
            effects: [
              { type: 'setFlag', flag: 'askedHrPrivately' },
              { type: 'addRelation', npc: 'hr', amount: 2 },
            ],
            next: 'private-answer',
          },
          {
            id: 'stay-quiet',
            text: 'Không nói gì, chắc mai có',
            effects: [
              { type: 'setFlag', flag: 'stayedQuiet' },
              { type: 'addStress', amount: 3 },
            ],
            next: 'quiet',
          },
        ],
      },
      'public-answer': {
        speaker: 'hr',
        text: 'Hiện tại công ty đang cố gắng ạ.',
        next: 'public-reply',
      },
      'public-reply': {
        speaker: 'player',
        text: 'Cố gắng có chuyển khoản được không chị?',
        next: 'public-after',
      },
      'public-after': {
        text: 'Tin nhắn được ba mươi lượt thả tim, tất cả đều từ những tài khoản không dám trả lời. Chị HR nhắn riêng: "Em ơi, có gì mình trao đổi riêng nhé".',
        next: 'uyen-note',
      },
      'private-answer': {
        speaker: 'hr',
        text: 'Chị hiểu em lo. Chị không có ngày cụ thể để nói với em, cũng không muốn nói một ngày rồi lại phải xin lỗi. Mà em đừng chia sẻ chuyện này ra ngoài nhé, ảnh hưởng tinh thần chung.',
        next: 'uyen-note',
      },
      quiet: {
        text: 'Bạn gõ "dạ vâng ạ", xóa đi, rồi đặt điện thoại xuống. Ở đầu bên kia hành lang, Khoa cũng vừa làm đúng như vậy.',
        next: 'uyen-note',
      },
      'uyen-note': {
        speaker: 'uyen',
        text: 'Hôm nay ngày mùng 5. Mình ghi lại nhé: công ty thông báo lúc 15 giờ 20, không có ngày cụ thể. Bạn cũng nên ghi.',
        next: 'asked-check',
      },
      'asked-check': {
        routes: [{ when: { type: 'flag', flag: 'askedAboutPay' }, next: 'uyen-recall' }],
        otherwise: 'contract-echo',
      },
      'uyen-recall': {
        speaker: 'uyen',
        text: 'Hôm họp đầu năm, bạn là người duy nhất hỏi lương trả ngày mấy. Cả phòng cười. Mình có ghi lại câu đó.',
        next: 'contract-echo',
      },
      'contract-echo': {
        routes: [{ when: { type: 'flag', flag: 'readContract' }, next: 'remember-clause' }],
        otherwise: 'end',
      },
      'remember-clause': {
        text: 'Bạn chợt nhớ trang 14, cỡ chữ 6. Bạn mở thư mục "Giấy tờ", và lần đầu tiên đọc lại nó một cách nghiêm túc.',
        next: 'end',
      },
      end: {
        text: 'Tối đó bạn mở lịch. Trái tim nhỏ bạn vẽ vẫn còn đó. Bạn vẫn còn tiền tháng trước. Chắc là không sao. Chắc là tuần sau.',
      },
    },
  },

  'ch2-hard-times': {
    id: 'ch2-hard-times',
    place: 'meeting',
    start: 'called',
    nodes: {
      called: {
        text: 'Cuối tháng, Phó giám đốc gọi cả phòng vào họp nhanh. Không có slide. Lần đầu tiên bạn thấy anh không cười trước khi nói.',
        next: 'boss',
      },
      boss: {
        speaker: 'boss',
        text: 'Thị trường đang rất khó khăn, các bạn đọc báo cũng thấy. Không riêng gì mình. Lương tháng này có thể chậm vài ngày. Anh em đợi thêm một chút nhé.',
        next: 'roger',
      },
      roger: {
        speaker: 'manager',
        text: 'Công ty lớn nào chẳng có lúc khó. Đây là lúc biết ai là người nhà. Chủ tịch đã vượt qua nhiều hơn thế này.',
        next: 'huni',
      },
      huni: {
        speaker: 'deputy',
        text: 'Anh chưa thấy con số nào nên anh không dám nói gì thêm. Tháng này ai có khoản nào gấp thì cứ nói với anh trước nhé.',
        choices: [
          {
            id: 'wait-a-bit',
            text: 'Vài ngày thôi mà, đợi được',
            effects: [{ type: 'addRelation', npc: 'manager', amount: 3 }],
            next: 'waited',
          },
          {
            id: 'tighten-belt',
            text: 'Về xem lại các khoản phải trả tháng này',
            effects: [{ type: 'addStress', amount: 3 }],
            next: 'tightened',
          },
        ],
      },
      waited: {
        text: 'Ai cũng gật đầu. Vài ngày thì có gì đâu. Bạn cũng nghĩ thế.',
      },
      tightened: {
        text: 'Bạn mở sổ ra, cộng tiền nhà, tiền điện, tiền ăn. Lần đầu tiên trong tháng bạn để ý xem ngày mùng 5 rơi vào thứ mấy.',
      },
    },
  },
};
