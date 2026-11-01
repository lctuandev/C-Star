import type { GameWorld } from './calendar/world-types.js';

/** A small world for the tests: round numbers, no luck unless a test asks for it. */
export const testWorld: GameWorld = {
  openingScene: 'meeting',
  story: {
    scenes: {
      meeting: {
        id: 'meeting',
        place: 'meeting',
        start: 'hello',
        nodes: {
          hello: { speaker: 'boss', text: 'Chào em.', next: 'ask' },
          ask: {
            speaker: 'boss',
            text: 'Em thấy sao?',
            effects: [{ type: 'setFlag', flag: 'heardTheAsk' }],
            choices: [
              {
                id: 'polite',
                text: 'Dạ tốt ạ.',
                effects: [{ type: 'setFlag', flag: 'polite' }],
                next: 'turn',
              },
              {
                id: 'blunt',
                text: 'Lương đâu ạ?',
                requires: { type: 'flag', flag: 'hasReceipts' },
                lockedReason: 'Chưa có phiếu lương trong tay',
                next: 'turn',
              },
            ],
          },
          turn: {
            routes: [{ when: { type: 'flag', flag: 'polite' }, next: 'nice' }],
            otherwise: 'cold',
          },
          nice: { speaker: 'boss', text: 'Tốt lắm.' },
          cold: { speaker: 'boss', text: 'Ừ.' },
        },
      },
      'week-two': {
        id: 'week-two',
        place: 'office',
        start: 'only',
        nodes: { only: { text: 'Tuần hai.' } },
      },
      'pay-one': {
        id: 'pay-one',
        place: 'desk',
        start: 'only',
        nodes: { only: { text: 'Ngày lương.' } },
      },
      broke: {
        id: 'broke',
        place: 'home',
        start: 'only',
        nodes: {
          only: {
            text: 'Hết tiền.',
            effects: [{ type: 'takeLoan', amount: 2_000 }, { type: 'payArrears' }],
          },
        },
      },
      finale: {
        id: 'finale',
        place: 'office',
        start: 'only',
        nodes: { only: { text: 'Hết.', effects: [{ type: 'setFlag', flag: 'runOver' }] } },
      },
      'end-good': {
        id: 'end-good',
        place: 'home',
        start: 'only',
        nodes: { only: { text: 'Tốt.' } },
      },
      'end-loop': {
        id: 'end-loop',
        place: 'desk',
        start: 'only',
        nodes: { only: { text: 'Lại nữa.' } },
      },
      renewal: {
        id: 'renewal',
        place: 'desk',
        start: 'only',
        nodes: { only: { text: 'Gia hạn.' } },
      },
      burnout: {
        id: 'burnout',
        place: 'home',
        start: 'only',
        nodes: {
          only: {
            text: 'Kiệt sức.',
            effects: [{ type: 'loseWeek' }, { type: 'addEnergy', amount: 40 }],
          },
        },
      },
    },
  },
  rules: {
    actionsPerWeek: 2,
    weeksPerMonth: 2,
    lastMonth: 2,
    startingCash: 1_000,
    startingEnergy: 50,
    startingStress: 20,
    startingTrust: 75,
    startingAwareness: 20,
    kpiShare: 0.3,
    salary: 1_000,
    weeklyEnergyRecovery: 10,
    unpaidStress: 10,
    surpriseChance: 0,
    kpiTargets: [0, 3],
    kpiMissStress: 5,
    kpiTrust: 10,
    ticketsPerRound: 2,
    quickTaskPoints: 1,
  },
  actions: [
    {
      id: 'work',
      label: 'Làm task',
      hint: 'Tốn sức',
      requires: { type: 'stat', stat: 'energy', min: 20 },
      lockedReason: 'Không còn sức',
      effects: [
        { type: 'addEnergy', amount: -20 },
        { type: 'addStress', amount: 5 },
      ],
      outcomes: ['Xong một task.'],
    },
    {
      id: 'rest',
      label: 'Nghỉ',
      hint: 'Lấy lại sức',
      effects: [{ type: 'addEnergy', amount: 25 }],
      outcomes: ['Ngủ.'],
    },
    {
      id: 'desk',
      label: 'Làm ticket',
      hint: 'Có KPI',
      tickets: true,
      effects: [{ type: 'addEnergy', amount: -5 }],
      outcomes: ['Xong ticket.'],
    },
    {
      id: 'look',
      label: 'Tìm hiểu',
      hint: 'Tìm giấy tờ',
      effects: [{ type: 'findEvidence' }],
      outcomes: ['Không tìm thêm được gì.'],
    },
  ],
  beats: [
    { scene: 'week-two', month: 1, week: 2 },
    { scene: 'pay-one', month: 1 },
  ],
  payroll: [1, 0],
  bills: [{ label: 'Tiền nhà', amount: 600 }],
  surprises: [{ label: 'Hỏng xe', amount: 300 }],
  tickets: [
    { id: 't1', from: 'Sếp', text: 'Sửa lỗi', answer: 'do', reply: 'Tốt.' },
    { id: 't2', from: 'Sếp', text: 'Đổi màu logo', answer: 'defer', reply: 'Khôn.' },
    { id: 't3', from: 'HR', text: 'Điền khảo sát', answer: 'do', reply: 'Ừ.' },
  ],
  evidence: [
    { id: 'contract', title: 'Hợp đồng', description: 'Bản ký.' },
    { id: 'early', title: 'Giấy tháng đầu', description: 'Chỉ có tháng 1.', toMonth: 1 },
    { id: 'late', title: 'Giấy tháng hai', description: 'Từ tháng 2.', fromMonth: 2 },
  ],
  endings: [
    {
      id: 'good',
      title: 'Tốt',
      summary: 'Kết thúc tốt.',
      hint: 'Cần giấy tờ.',
      scene: 'end-good',
      when: { type: 'evidence', evidence: 'contract' },
    },
    {
      id: 'loop',
      title: 'Lại nữa',
      summary: 'Không có gì đổi.',
      hint: 'Không làm gì.',
      scene: 'end-loop',
      loops: true,
    },
  ],
  renewalScene: 'renewal',
  crises: [
    { id: 'broke', scene: 'broke', when: { type: 'stat', stat: 'arrears', min: 1 } },
    { id: 'burnout', scene: 'burnout', when: { type: 'stat', stat: 'energy', max: 0 } },
  ],
};
