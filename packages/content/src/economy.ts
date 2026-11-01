import type { Bill, GameRules, WeeklyAction } from '@cstar/game-core';

/** First guesses, for the owner to tune by playing (GDD §4, §5). */
export const rules: GameRules = {
  actionsPerWeek: 3,
  weeksPerMonth: 4,
  lastMonth: 4,
  startingCash: 9_000_000,
  startingEnergy: 80,
  startingStress: 10,
  salary: 15_000_000,
  weeklyEnergyRecovery: 15,
  unpaidStress: 12,
  surpriseChance: 0.4,
  kpiTargets: [0, 0, 8, 10],
  kpiMissStress: 6,
  kpiTrust: 6,
  ticketsPerRound: 4,
  quickTaskPoints: 2,
};

/** The share of the salary the company pays each month, from month 1. */
export const payroll: readonly number[] = [1];

export const bills: readonly Bill[] = [
  { label: 'Tiền nhà', amount: 4_500_000 },
  { label: 'Ăn uống', amount: 3_000_000 },
  { label: 'Điện, nước, mạng', amount: 800_000 },
];

export const surprises: readonly Bill[] = [
  { label: 'Hỏng xe', amount: 600_000 },
  { label: 'Đám cưới đồng nghiệp', amount: 500_000 },
  { label: 'Thuốc cảm', amount: 200_000 },
  { label: 'Sinh nhật mẹ', amount: 800_000 },
];

export const weeklyActions: readonly WeeklyAction[] = [
  {
    id: 'work',
    label: 'Làm task',
    hint: 'Có KPI, sếp vui hơn, bạn mệt hơn',
    tickets: true,
    requires: { type: 'stat', stat: 'energy', min: 15 },
    lockedReason: 'Không còn sức để giả vờ bận',
    effects: [
      { type: 'addEnergy', amount: -15 },
      { type: 'addStress', amount: 3 },
      { type: 'addRelation', npc: 'boss', amount: 1 },
    ],
    outcomes: [
      'Bạn đóng một ticket. Hệ thống mở thêm ba ticket.',
      'Task xong. Sếp thả tim, không thả gì khác.',
      'Bạn gửi báo cáo. Báo cáo được gửi đi để báo cáo tiếp.',
      'Bạn sửa xong một lỗi mà người tạo ra nó đã nghỉ việc.',
    ],
  },
  {
    id: 'side-gig',
    label: 'Nhận việc ngoài',
    hint: 'Có tiền ngay, mất sức nhiều',
    requires: {
      type: 'all',
      conditions: [
        { type: 'stat', stat: 'month', min: 2 },
        { type: 'stat', stat: 'energy', min: 20 },
      ],
    },
    lockedReason: 'Tháng này còn tin vào lương, hoặc đã hết sức',
    effects: [
      { type: 'addCash', amount: 1_200_000 },
      { type: 'addEnergy', amount: -20 },
      { type: 'addStress', amount: 4 },
    ],
    outcomes: [
      'Làm thêm tới 2 giờ sáng. Khách trả tiền đúng hẹn, một cảm giác xa lạ.',
      'Bạn thiết kế logo cho một quán trà sữa. Họ trả liền. Bạn suýt khóc.',
      'Dạy kèm online buổi tối. Học trò hỏi lương đi làm được bao nhiêu. Bạn đổi chủ đề.',
    ],
  },
  {
    id: 'rest',
    label: 'Nghỉ ngơi',
    hint: 'Lấy lại sức, bớt căng',
    effects: [
      { type: 'addEnergy', amount: 25 },
      { type: 'addStress', amount: -10 },
    ],
    outcomes: [
      'Bạn ngủ một giấc không mơ về Excel.',
      'Bạn đi dạo. Công viên không có KPI.',
      'Bạn tắt thông báo Slack trong đúng một buổi tối.',
    ],
  },
  {
    id: 'chat',
    label: 'Tám với đồng nghiệp',
    hint: 'Bớt căng, thân nhau hơn',
    effects: [
      { type: 'addEnergy', amount: -5 },
      { type: 'addStress', amount: -8 },
      { type: 'addRelation', npc: 'dan', amount: 2 },
      { type: 'addRelation', npc: 'uyen', amount: 2 },
      { type: 'addRelation', npc: 'khoa', amount: 2 },
    ],
    outcomes: [
      'Dân bảo công ty sắp có đợt gọi vốn mới. Dân bảo thế từ năm ngoái.',
      'Uyên đã ghi lại ngày giờ mọi lời hứa vào một file riêng.',
      'Khoa tin tuần sau có lương. Tuần trước Khoa cũng tin vậy.',
      'Cả nhóm cười về trái cây thứ Sáu. Thứ Sáu này chỉ còn một quả chuối.',
    ],
  },
  {
    id: 'investigate',
    label: 'Lưu giấy tờ',
    hint: 'Giữ lại giấy tờ của mình, HR có thể để ý',
    requires: { type: 'flag', flag: 'startedNotes' },
    lockedReason: 'Chưa nghĩ tới chuyện phải giữ giấy tờ',
    effects: [
      { type: 'findEvidence' },
      { type: 'addEnergy', amount: -5 },
      { type: 'addStress', amount: 2 },
      {
        type: 'chance',
        chance: 0.25,
        then: [{ type: 'addRelation', npc: 'hr', amount: -6 }],
      },
    ],
    outcomes: [
      'Bạn đã có đủ những gì tháng này cho phép lấy.',
      'Không còn gì mới để lưu vào lúc này.',
    ],
  },
];
