/**
 * Writes docs/kich-ban-day-du.md from the story data: every line, choice and consequence, so that
 * what the owner reviews is what the game plays. Run after a build: pnpm --filter @cstar/content story:doc
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { characterInfo } from '../dist/story/characters.js';
import { promises, syncLines } from '../dist/promises.js';
import { world } from '../dist/world.js';

const { story, beats, endings, evidence, actions, tickets, crises, rules } = world;

const CHAPTERS = [
  {
    prefix: 'ch1',
    title: 'Chương 1 — Dream Big (tháng 1)',
    about:
      'Người chơi nhận việc, làm quen đồng nghiệp, nghe tầm nhìn của công ty. Chưa có nợ: tháng đầu nhận đủ lương và tiền KPI 30%. Mọi thứ tươi mới, nhạc vui.',
  },
  {
    prefix: 'ch2',
    title: 'Chương 2 — Payment Delay (tháng 2)',
    about:
      'Những dấu hiệu đầu tiên: máy cà phê biến mất, kế toán ấp úng, công ty kêu khó khăn và xin đợi thêm. Kết chương là ngày lương đầu tiên không có tiếng "ting".',
  },
  {
    prefix: 'ch3',
    title: 'Chương 3 — KPI Never Sleeps (tháng 3–4)',
    about:
      'Lương vẫn trễ, KPI thì bắt đầu. Công ty trả 2/3 tháng lương một lần rồi im lặng, không thông báo gì về kế hoạch trả. Nhân viên bất mãn. Chiến dịch Vượt thác hóa rồng, và lối thoát đầu tiên: một lời mời việc nơi khác.',
  },
  {
    prefix: 'ch4',
    title: 'Chương 4 — Six Months Later (tháng 5–6)',
    about:
      'Lương giảm còn 1/3 và chỉ vài người có, không ai nói vì sao, nên trong phòng bắt đầu có người không nhìn mặt nhau. Khoa ngừng cười rồi rời đi. Anh Roger lần đầu không nói "next week". Người nghỉ dần, ai cũng vay mượn. Nhóm so số liệu hình thành. Phó giám đốc tung "1–2 triệu đô" và IPO để giữ người. KPI bị giam, vậy mà vẫn đánh giá hiệu suất.',
  },
  {
    prefix: 'ch5',
    title: 'Chương 5 — The Awakening (tháng 7)',
    about:
      'Người chơi đối chiếu số liệu, và thấy chính bảng của nhóm cũng có thể sai. Họ chọn cách lên tiếng, trong đó có email đòi quyền lợi làm bằng chứng. Công ty trả lời vòng vo, lần đầu lộ vẻ lo lắng sau cánh cửa phòng họp, rồi dụ dỗ bằng một chức danh.',
  },
  {
    prefix: 'ch6',
    title: 'Chương 6 — The Last Day (tháng 8)',
    about:
      'Văn phòng vắng đi một nửa, tường ảnh tập thể không còn đủ người. Chủ tịch lần đầu đến tận nơi để nói chuyện với nhân viên. Người chơi đưa ra quyết định cuối, và mỗi kết thúc có thêm đoạn "Một năm sau".',
  },
];

const nameOf = (id) => characterInfo[id]?.name ?? id;
const money = (amount) => `${new Intl.NumberFormat('vi-VN').format(amount)} đ`;
const signed = (amount) => (amount > 0 ? `+${amount}` : String(amount));
const evidenceName = (id) => evidence.find((item) => item.id === id)?.title ?? id;

const FLAGS = {
  runOver: 'kết thúc lượt chơi',
  quitEarly: 'nghỉ sớm',
  startedNotes: 'bắt đầu ghi chép (mở "Lưu giấy tờ")',
  joinedGroup: 'vào nhóm so số liệu',
  joinedDragons: 'vào nhóm Vượt thác',
  chosePursue: 'chọn theo đuổi quyền lợi',
  choseLeave: 'chọn rời đi',
  choseStay: 'ký cam kết ở lại',
  sentFormalRequest: 'đã gửi email đòi quyền lợi',
  tookPromotion: 'nhận chức Trưởng nhóm',
  heardDollars: 'đã nghe màn 1–2 triệu đô',
  askedCriteria: 'đã hỏi tiêu chí trả lương',
  heldOutForPay: 'đã ra điều kiện đòi trả nợ',
  helpedKhoa: 'đã cho Khoa mượn tiền',
  treatedTeam: 'đã mời cả nhóm ăn trưa',
  readContract: 'đã đọc kỹ hợp đồng',
  renewed: 'đang chơi lại sau khi gia hạn',
  eagerHire: 'ký hợp đồng không đọc',
  satWithDan: 'ngồi cạnh Dân',
  satWithUyen: 'ngồi cạnh Uyên',
  satWithKhoa: 'ngồi cạnh Khoa',
  clappedForBoss: 'vỗ tay to nhất',
  askedAboutPay: 'hỏi lương ở buổi họp đầu năm',
  savedFirstPay: 'để dành lương đầu',
  sentHome: 'gửi tiền về cho mẹ',
  askedAccountant: 'hỏi cô Kế toán chuyện lương',
  askedHrInPublic: 'hỏi HR trong nhóm chung',
  askedHrPrivately: 'nhắn riêng HR',
  stayedQuiet: 'im lặng ngày lương đầu tiên bị lỡ',
  askedBossSalary: 'hỏi sếp lương giữa buổi họp KPI',
  volunteeredKpi: 'đăng ký chỉ tiêu cao nhất',
  backedUyen: 'đứng về phía Uyên',
  khoaSaidGoodbye: 'Khoa đã nói lời tạm biệt',
  khoaLeft: 'Khoa đã nghỉ',
  decidedToAct: 'quyết định hành động',
  danJoined: 'Dân vào nhóm',
  soughtAdvice: 'đã hỏi người có chuyên môn',
  keptNegotiating: 'chọn nói chuyện riêng với HR',
  askedChairman: 'hỏi Chủ tịch bao giờ trả lương',
  calledHome: 'vay tiền mẹ',
  tookCredit: 'vay trên điện thoại',
  khoaConfided: 'Khoa tin bạn (sẽ tự nói lời tạm biệt)',
  rogerDoubts: 'anh Roger bắt đầu nghi ngờ',
  tableHasError: 'bảng của nhóm còn lỗi',
  askedDialogue: 'đã đề nghị đối thoại chính thức',
};

const STATS = {
  cash: 'tiền trong ví',
  arrears: 'hóa đơn chưa trả được (đồng)',
  loans: 'tiền đang vay',
  companyDebt: 'công ty đang nợ',
  energy: 'sức khỏe',
  stress: 'căng thẳng',
  month: 'tháng',
  kpi: 'KPI',
  evidenceCount: 'số giấy tờ',
  trust: 'niềm tin vào công ty',
  awareness: 'hiểu quyền lợi',
};

const MONTHS = [
  ['1', 'Nhận việc, được trả đủ. Người chơi yêu nơi này.', 'Đủ 15 triệu và KPI 4,5 triệu'],
  ['2', 'Máy cà phê biến mất, kế toán ấp úng, ngày lương không có "ting".', 'Không có gì'],
  ['3', 'KPI bắt đầu, lời hứa "this week", Khoa đi vay, weekly sync.', '10 triệu (2/3 lương T2)'],
  [
    '4',
    'Công ty im lặng, chiến dịch Vượt thác hóa rồng, người đầu tiên nghỉ, lời mời việc nơi khác.',
    '5 triệu nếu vào Vượt thác',
  ],
  [
    '5',
    'Trả 1/3 chọn lọc chia rẽ cả phòng, Khoa rời đi, ai cũng vay mượn, Uyên bắt đầu gom người.',
    '5 triệu nếu vào Vượt thác (danh sách ưu tiên) hoặc được sếp để ý (khoản ứng riêng)',
  ],
  [
    '6',
    'Nhóm so số liệu họp, anh Roger lung lay, "1–2 triệu đô" và IPO, KPI bị giam mà vẫn đánh giá hiệu suất.',
    'Không có gì',
  ],
  [
    '7',
    'Bảng đối chiếu, bảng cũng có thể sai, email đòi quyền lợi, công ty lần đầu lo lắng, lời mời làm Trưởng nhóm.',
    '5 triệu nếu vào Vượt thác, nhận chức hoặc ra điều kiện',
  ],
  [
    '8',
    'Văn phòng vắng, Khoa trả nợ, Chủ tịch tới, Bản cam kết đồng hành, quyết định cuối.',
    'Tùy kết thúc',
  ],
];

const ARCS = [
  [
    'Anh Roger',
    'Tin Chủ tịch thật lòng (`ch1-team-lunch`)',
    'Lần đầu không nói "next week" (`ch4-roger-crack`)',
    'Tùy người chơi: im lặng trước Chủ tịch, ký cùng nhóm hay về nước; hoặc vẫn "hopefully"',
  ],
  [
    'Khoa',
    'Cười, tin tuần sau có lương (`ch1-first-day`)',
    'Vay tiền, ngồi ở cầu thang (`ch3-side-rumor`, `ch4-khoa-stairs`)',
    'Rời đi tháng 5. Trả 1 triệu ở tháng 8 nếu từng được cho mượn; quán cà phê nếu đã nói lời tạm biệt',
  ],
  [
    'Uyên',
    'Cẩn thận vì công ty cũ đóng cửa (`ch1-team-lunch`)',
    'Gom người, gom giấy tờ (`ch4-different-debts`, `ch4-group`)',
    'Sai một lần và học cách để người khác soát cùng (`ch5-wrong-number`)',
  ],
  [
    'Anh Huni',
    'Người hướng dẫn tử tế (`ch1-first-day`)',
    'Cho mượn tiền rồi không kham nổi (`ch4-borrowing`)',
    'Tự quyết định: ký đầu danh sách hoặc nộp đơn (`ch6-empty-office`, các kết thúc)',
  ],
  [
    'Dân',
    'Nhiều tin đồn (`ch1-first-day`)',
    'Người quen hỏi lại "Công ty nào?" (`ch4-dan-doubts`)',
    'Tin sai vào bảng, rồi lần đầu hỏi mà không kèm tin đồn (`ch5-wrong-number`, The Investigator)',
  ],
  [
    'Phó GĐ Jeon',
    'Tầm nhìn, gia đình (`ch1-town-hall`)',
    '"1–2 triệu đô" mỗi khi có người định đi (`ch4-the-dollars`)',
    'Lần đầu lo lắng, chiêu mộ người hay hỏi lương (`ch5-closed-door`, `ch5-offer`)',
  ],
];

const conditionText = (condition) => {
  switch (condition.type) {
    case 'flag':
      return FLAGS[condition.flag] ?? `cờ "${condition.flag}"`;
    case 'stat': {
      const limits = [
        condition.min !== undefined && `từ ${condition.min}`,
        condition.max !== undefined && `không quá ${condition.max}`,
      ].filter(Boolean);
      return `${STATS[condition.stat] ?? condition.stat} ${limits.join(' ')}`;
    }
    case 'relation': {
      const limits = [
        condition.min !== undefined && `từ ${condition.min}`,
        condition.max !== undefined && `tới ${condition.max}`,
      ].filter(Boolean);
      return `quan hệ với ${nameOf(condition.npc)} ${limits.join(' ')}`;
    }
    case 'evidence':
      return `có "${evidenceName(condition.evidence)}"`;
    case 'crisisCount':
      return `khủng hoảng "${condition.crisis}" từ ${condition.min} lần`;
    case 'not':
      return `chưa ${conditionText(condition.condition).replace(/^đã /, '')}`;
    case 'all':
      return condition.conditions.map(conditionText).join(' VÀ ');
    case 'any':
      return condition.conditions.map(conditionText).join(' HOẶC ');
    default:
      return condition.type;
  }
};

const effectText = (effect) => {
  switch (effect.type) {
    case 'setFlag':
      // Flags nobody reads the name of say nothing to someone reviewing the story.
      return FLAGS[effect.flag] && effect.value === false
        ? `không còn: ${FLAGS[effect.flag]}`
        : (FLAGS[effect.flag] ?? null);
    case 'addCash':
      return `${effect.amount > 0 ? 'có thêm' : 'mất'} ${money(Math.abs(effect.amount))}`;
    case 'companyPays':
      return effect.amount >= 1_000_000_000
        ? 'công ty trả hết phần còn nợ theo sổ lương'
        : `công ty trả ${money(effect.amount)}`;
    case 'addEnergy':
      return `sức khỏe ${signed(effect.amount)}`;
    case 'addStress':
      return `căng thẳng ${signed(effect.amount)}`;
    case 'addTrust':
      return `niềm tin ${signed(effect.amount)}`;
    case 'addAwareness':
      return `hiểu quyền lợi ${signed(effect.amount)}`;
    case 'addRelation':
      return `quan hệ ${nameOf(effect.npc)} ${signed(effect.amount)}`;
    case 'addEvidence':
      return `có giấy tờ "${evidenceName(effect.evidence)}"`;
    case 'findEvidence':
      return 'lưu được một giấy tờ';
    case 'takeLoan':
      return `vay ${money(effect.amount)}`;
    case 'payArrears':
      return 'dùng tiền có được trả hóa đơn, thiếu thì nợ tiếp';
    case 'loseWeek':
      return 'mất một tuần';
    case 'chance':
      return `${Math.round(effect.chance * 100)}% khả năng: ${effect.then.map(effectText).join(', ')}`;
    default:
      return effect.type;
  }
};

const effectsText = (effects = []) => {
  const said = effects.map(effectText).filter(Boolean);
  return said.length ? ` *(${said.join('; ')})*` : '';
};
const spoken = (text) => text.replaceAll('{name}', '**[tên người chơi]**');

const whenOf = (scene) => {
  const beat = beats.find(({ scene: id }) => id === scene.id);
  if (!beat) {
    return '';
  }
  return beat.week
    ? `tháng ${beat.month}, tuần ${beat.week}`
    : `ngày lương tháng ${beat.month} (mùng 5 tháng ${beat.month + 1})`;
};

const PLACES = {
  home: 'nhà riêng',
  office: 'văn phòng',
  meeting: 'phòng họp',
  desk: 'bàn làm việc',
  hallway: 'hành lang, pantry',
};

const sceneText = (scene, heading = '###') => {
  const entries = Object.entries(scene.nodes);
  const labels = new Map();
  const incoming = new Map();
  const arrive = (id) => incoming.set(id, (incoming.get(id) ?? 0) + 1);
  for (const [, node] of entries) {
    [
      node.next,
      node.otherwise,
      ...(node.choices ?? []).map(({ next }) => next),
      ...(node.routes ?? []).map(({ next }) => next),
    ]
      .filter(Boolean)
      .forEach(arrive);
    for (const choice of node.choices ?? []) {
      labels.set(choice.next, `Nếu chọn "${spoken(choice.text).replaceAll('"', '')}"`);
    }
    for (const route of node.routes ?? []) {
      labels.set(route.next, `Nếu ${conditionText(route.when)}`);
    }
    if (node.otherwise) {
      labels.set(node.otherwise, 'Nếu không');
    }
  }
  const when = whenOf(scene);
  const lines = [
    `${heading} ${scene.id}`,
    '',
    `*${[when, PLACES[scene.place]].filter(Boolean).join(' · ')}*`,
    '',
  ];
  for (const [id, node] of entries) {
    if (labels.has(id)) {
      const shared = incoming.get(id) > 1;
      lines.push(shared ? '*Các nhánh trên gặp lại ở đây:*' : `*${labels.get(id)}:*`, '');
    }
    if ('routes' in node) {
      continue;
    }
    const who = node.speaker ? `**${nameOf(node.speaker)}:** ` : '';
    lines.push(`${who}${spoken(node.text)}${effectsText(node.effects)}`, '');
    if (node.choices) {
      for (const choice of node.choices) {
        const gate = choice.requires ? ` — *cần: ${conditionText(choice.requires)}*` : '';
        lines.push(`- ▸ ${spoken(choice.text)}${effectsText(choice.effects)}${gate}`);
      }
      lines.push('');
    }
  }
  return lines.join('\n');
};

const beatsIn = (prefix) =>
  beats.filter(({ scene }) => scene.startsWith(prefix)).map(({ scene }) => story.scenes[scene]);

const parts = [
  '# Công ty C\\* — Kịch bản đầy đủ',
  '',
  'Sinh tự động từ dữ liệu game bằng `pnpm --filter @cstar/content story:doc`: đây đúng là những gì đang có trong game. Đừng sửa tay, hãy sửa trong `packages/content`.',
  '',
  'Trong ngoặc nghiêng là hậu quả của câu thoại hay lựa chọn. `[tên người chơi]` là tên điền ở đơn ứng tuyển.',
  '',
  '## Mục lục',
  '',
  '- Timeline',
  '- Tuyến nhân vật',
  '- Lựa chọn và hậu quả về sau',
  ...CHAPTERS.map(({ title }) => `- ${title}`),
  '- Khủng hoảng',
  '- Sáu kết thúc',
  '- Phần lặp lại mỗi tuần, mỗi tháng',
  '- Nhân vật, giấy tờ, số liệu',
  '',
];

const flagUse = () => {
  const setAt = new Map();
  const readAt = new Map();
  const note = (map, flag, scene) => map.set(flag, new Set([...(map.get(flag) ?? []), scene]));
  const reads = (condition, where) => {
    if (!condition) {
      return;
    }
    if (condition.type === 'flag') {
      note(readAt, condition.flag, where);
    }
    reads(condition.condition, where);
    (condition.conditions ?? []).forEach((inner) => reads(inner, where));
  };
  for (const scene of Object.values(story.scenes)) {
    for (const node of Object.values(scene.nodes)) {
      const effects = [
        ...(node.effects ?? []),
        ...(node.choices ?? []).flatMap((choice) => choice.effects ?? []),
      ];
      effects
        .filter(({ type }) => type === 'setFlag')
        .forEach(({ flag }) => note(setAt, flag, scene.id));
      (node.routes ?? []).forEach(({ when }) => reads(when, scene.id));
      (node.choices ?? []).forEach(({ requires }) => reads(requires, scene.id));
    }
  }
  beats.forEach(({ requires, scene }) => reads(requires, scene));
  endings.forEach(({ when, id }) => reads(when, `kết thúc ${id}`));
  tickets.forEach(({ requires, id }) => reads(requires, `ticket ${id}`));
  actions.forEach(({ appearsWhen, outcomesWhen, id }) => {
    reads(appearsWhen, `hành động ${id}`);
    (outcomesWhen ?? []).forEach(({ when }) => reads(when, `hành động ${id}`));
  });
  return [...setAt.keys()]
    .filter((flag) => flag !== 'runOver')
    .map((flag) => ({ flag, setAt: [...setAt.get(flag)], readAt: [...(readAt.get(flag) ?? [])] }));
};

parts.push(
  '## Timeline',
  '',
  'Mỗi tháng có 4 tuần, mỗi tuần 3 lượt. "Ngày lương" là mùng 5 của tháng sau, nên tiền lương tháng N đến sau tuần 4 của tháng N.',
  '',
  '| Chương | Tháng | Chuyện chính | Tiền công ty trả trong tháng |',
  '| --- | --- | --- | --- |',
  ...MONTHS.map(([month, events, pay], index) => {
    const chapter = [1, 2, 3, 3, 4, 4, 5, 6][index];
    return `| ${chapter} | ${month} | ${events} | ${pay} |`;
  }),
  '',
  'Tiền trả muộn được tính vào tháng lương cũ nhất còn thiếu, đúng như nội dung chuyển khoản. Cách tính mốc: người chơi nhận email trước tháng 1, nên cuối tháng 6 là "hơn sáu tháng" kể từ email đó. Kỳ lương đầu bị lỡ là lương tháng 2, nên tuần 3 tháng 7 công ty đã lỡ năm kỳ (T2 đến T6), và tới tháng 8 là sáu kỳ (T2 đến T7).',
  '',
  '### Thứ tự các cảnh',
  '',
  '| Tháng | Lúc nào | Cảnh | Ở đâu | Điều kiện |',
  '| --- | --- | --- | --- | --- |',
  ...beats.map(
    ({ scene, month, week, requires }) =>
      `| ${month} | ${week ? `tuần ${week}` : 'ngày lương'} | \`${scene}\` | ${PLACES[story.scenes[scene].place]} | ${requires ? conditionText(requires) : ''} |`,
  ),
  '',
  '## Tuyến nhân vật',
  '',
  '| Nhân vật | Đầu game | Giữa game | Cuối game |',
  '| --- | --- | --- | --- |',
  ...ARCS.map((row) => `| ${row.join(' | ')} |`),
  '',
  '## Lựa chọn và hậu quả về sau',
  '',
  'Sinh tự động từ dữ liệu. Test `story-links.test.ts` bắt lỗi nếu có lựa chọn được ghi lại mà về sau không dùng tới.',
  '',
  '| Lựa chọn hoặc sự việc | Xảy ra ở | Có hậu quả ở |',
  '| --- | --- | --- |',
  ...flagUse().map(
    ({ flag, setAt, readAt }) =>
      `| ${FLAGS[flag] ?? flag} | ${setAt.map((id) => `\`${id}\``).join(', ')} | ${readAt.map((id) => `\`${id}\``).join(', ')} |`,
  ),
  '',
);

parts.push(`## Mở đầu`, '', sceneText(story.scenes[world.openingScene]));

for (const { prefix, title, about } of CHAPTERS) {
  parts.push(`## ${title}`, '', about, '');
  for (const scene of beatsIn(prefix)) {
    parts.push(sceneText(scene));
  }
}

parts.push(
  '## Khủng hoảng',
  '',
  'Xảy ra bất cứ lúc nào điều kiện đúng, tối đa một lần mỗi tháng.',
  '',
);
for (const crisis of crises) {
  parts.push(
    `*Điều kiện: ${conditionText(crisis.when)}*`,
    '',
    sceneText(story.scenes[crisis.scene]),
  );
}

parts.push(
  '## Sáu kết thúc',
  '',
  'Game xét từ trên xuống, gặp điều kiện đầu tiên đúng thì dừng.',
  '',
);
endings.forEach((ending, index) => {
  parts.push(
    `### Kết thúc ${index + 1}: ${ending.title}`,
    '',
    ending.summary,
    '',
    `- **Điều kiện:** ${ending.when ? conditionText(ending.when) : 'không rơi vào các kết thúc trên'}`,
    `- **Gợi ý hiện cho người chơi khi chưa mở:** ${ending.hint}`,
    '',
    sceneText(story.scenes[ending.scene], '####'),
  );
});
parts.push(
  '### Sau The Empty Promise',
  '',
  'Bấm "Tiếp tục cống hiến" để chơi lại từ đầu, khoản nợ giữ nguyên.',
  '',
  sceneText(story.scenes[world.renewalScene], '####'),
);

parts.push(
  '## Phần lặp lại mỗi tuần, mỗi tháng',
  '',
  '### Hành động trong tuần',
  '',
  `Mỗi tuần ${rules.actionsPerWeek} lượt, mỗi tháng ${rules.weeksPerMonth} tuần.`,
  '',
);
for (const action of actions) {
  const appears = action.appearsWhen ? ` Xuất hiện khi: ${conditionText(action.appearsWhen)}.` : '';
  const gate = action.requires ? ` Cần: ${conditionText(action.requires)}.` : '';
  parts.push(
    `**${action.label}** — ${action.hint}.${appears}${gate} Hậu quả:${effectsText(action.effects)}`,
    '',
  );
  parts.push(...action.outcomes.map((line) => `- ${line}`));
  parts.push(...(action.outcomesOnceOwed ?? []).map((line) => `- *(khi đã bị nợ)* ${line}`));
  parts.push(
    ...(action.outcomesWhen ?? []).flatMap(({ when, lines }) =>
      lines.map((line) => `- *(khi ${conditionText(when)})* ${line}`),
    ),
    '',
  );
}
parts.push(
  '### Weekly sync với anh Roger (từ tháng 4, sau cảnh `ch3-weekly-sync`, mỗi tuần một câu)',
  '',
  ...syncLines.map((line) => `- ${line}`),
  '',
);
parts.push(
  '### Ghi chú của Phó giám đốc trên phiếu lương chưa trả',
  '',
  ...promises.map((line) => `- ${line}`),
  '',
);
parts.push(
  '### Ticket KPI ở bàn làm việc',
  '',
  'Mỗi lượt Làm task trả lời vài ticket: làm ngay, hay đẩy sang sprint sau.',
  '',
);
parts.push(
  ...tickets.map(
    ({ from, text, answer, reply }) =>
      `- **${from}:** ${text} → *${answer === 'do' ? 'làm ngay' : 'đẩy sang sprint sau'}.* ${reply}`,
  ),
  '',
);

parts.push(
  '## Nhân vật, giấy tờ, số liệu',
  '',
  '### Nhân vật',
  '',
  ...Object.values(characterInfo).map(({ name }) => `- ${name}`),
  '',
);
parts.push(
  '### Giấy tờ trong Hồ sơ',
  '',
  ...evidence.map(({ title, description }) => `- **${title}:** ${description}`),
  '',
);
parts.push(
  '### Số liệu',
  '',
  `- Lương ${money(rules.salary)}, tiền KPI 30% lương (chỉ trả tháng 1)`,
  `- Tiền ban đầu ${money(rules.startingCash)}, sức khỏe ${rules.startingEnergy}, căng thẳng ${rules.startingStress}`,
  `- Chỉ tiêu KPI theo tháng: ${rules.kpiTargets.join(', ')}`,
  `- Niềm tin vào công ty bắt đầu từ ${rules.startingTrust}, hiểu quyền lợi từ ${rules.startingAwareness}. Mỗi tháng không có lương mất 8 niềm tin, mỗi khoản công ty trả được cộng lại 4. Hai chỉ số này hiện ở Hồ sơ, và mở khóa lựa chọn "Ra điều kiện" ở chương 5, "nghỉ luôn" ở chương 4`,
  '- Sổ lương trong Hồ sơ ghi từng tháng: hợp đồng, đã nhận, còn thiếu, KPI bị giữ. Màn kết thúc cộng lại tất cả, kèm số lần nghe hứa và số người còn liên lạc',
  `- Tổng số cảnh: ${Object.keys(story.scenes).length}`,
  '',
);

parts.push(
  '### Luật tiền, niềm tin, giấy tờ',
  '',
  '- **Thứ tự cộng trừ tiền:** tiền vào ví trước, hóa đơn trừ sau. Không đủ thì ví về 0, phần thiếu thành "hóa đơn chưa trả". Tiền không bao giờ âm.',
  '- **Vay:** tiền vào ví, đồng thời ghi riêng ở "đang vay". Vay dư thì phần dư ở lại ví. Vay thiếu thì hóa đơn còn lại vẫn nợ tiếp và khủng hoảng có thể quay lại tháng sau.',
  '- **Khủng hoảng:** mỗi loại tối đa một lần mỗi tháng, xét thiếu tiền trước, kiệt sức sau.',
  '- **Lương:** kỳ nào không đủ 15 triệu thì tính là kỳ thiếu: mất 8 niềm tin, thêm 12 căng thẳng. Khoản trả giữa chừng (10 hoặc 5 triệu) cộng 4 niềm tin và trừ vào tháng lương cũ nhất còn thiếu, kể cả khi nó được gọi là "benefit".',
  '- **Niềm tin:** các mức trong cốt truyện, như -6 ở `ch4-six-months`, là khoản riêng, cộng thêm vào luật trên.',
  '- **KPI:** tiền KPI là 30% lương theo hợp đồng, cố định, chỉ trả tháng 1 rồi bị giữ. Chỉ tiêu tháng tính bằng điểm ticket (chọn đúng 1 điểm, "Làm cho có" 2 điểm) và chỉ ảnh hưởng đánh giá của sếp và căng thẳng.',
  '- **Giấy tờ:** 8 loại, mỗi loại tính một lần dù nhận từ hai nguồn.',
  '- **Gia hạn hợp đồng (vòng lặp):** giữ nguyên số công ty nợ, khoản đang vay, tên người chơi. Làm lại từ đầu tiền trong ví, sức khỏe, quan hệ, giấy tờ, cờ sự kiện.',
  '- **Nhánh:** ở mỗi cụm điều kiện chỉ chạy nhánh đầu tiên đúng, nên một người đủ nhiều điều kiện vẫn chỉ nhận một khoản.',
  '- **Tính toàn vẹn:** validator chạy khi build bảo đảm mọi cảnh, nút, điều kiện đều tồn tại, không có ngõ cụt. Test người chơi ngẫu nhiên đi qua đủ mọi dòng thoại và cả sáu kết thúc.',
  '',
);

const target = path.resolve(import.meta.dirname, '../../../docs/kich-ban-day-du.md');
await writeFile(target, parts.join('\n'));
console.log(`story doc: ${Object.keys(story.scenes).length} scenes → ${target}`);
