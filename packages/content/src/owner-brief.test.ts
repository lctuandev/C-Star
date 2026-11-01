import { beginRun } from '@cstar/game-core';
import { describe, expect, it } from 'vitest';
import { promises, syncLines } from './promises.js';
import { characterInfo } from './story/characters.js';
import { beats } from './story/schedule.js';
import { world } from './world.js';

const textOf = (sceneId: string) =>
  Object.values(world.story.scenes[sceneId]?.nodes ?? {})
    .flatMap((node) => {
      const line = node as { text?: string; choices?: { text: string }[] };
      return [line.text ?? '', ...(line.choices ?? []).map((choice) => choice.text)];
    })
    .join(' ');

const scheduled = new Set(beats.map(({ scene }) => scene));

/** Everything the owner asked to have in the story, and where it lives: it must not quietly go. */
describe("the owner's additions to the story", () => {
  it('uses the names the owner gave', () => {
    expect(characterInfo.chairman.name).toContain('Jeon Kim-jung');
    expect(characterInfo.boss.name).toContain('Jeon Gwang-hoe');
    expect(characterInfo.manager.name).toBe('Anh Roger');
    expect(characterInfo.deputy.name).toBe('Anh Huấn');
    expect(textOf('ch1-first-day')).toMatch(/Roger.*Ấn Độ.*Chủ tịch Jeon/);
    expect(textOf('ch1-first-day')).toMatch(/Huấn.*Huni/);
  });

  const cases: [string, string, RegExp][] = [
    [
      'the chairman barely shows up, on a video call',
      'ch1-town-hall',
      /Chủ tịch.*nhiều công ty khác/,
    ],
    ['and then once in person', 'ch6-last-day', /Chủ tịch ngoài màn hình/],
    ['the deputy director promises this week, next week', 'ch3-next-week', /This week.*next week/],
    ['the department head answers with hopefully', 'ch3-weekly-sync', /Next week, hopefully/],
    [
      'the dragon campaign pays a part of the salary as a benefit',
      'ch3-dragon',
      /VƯỢT THÁC HÓA RỒNG.*Benefit/,
    ],
    ['and never the whole of it', 'ch3-dragon', /một phần ba tháng lương/],
    ['the first crumb is two thirds of a month', 'ch3-first-tranche', /hai phần ba/],
    ['then it falls to a third', 'ch4-second-tranche', /giảm còn một phần ba/],
    ['and only a few people get it', 'ch4-second-tranche', /chỉ vài người có/],
    ['many go months with nothing', 'ch4-second-tranche', /ba bốn tháng liền/],
    ['month one pays the salary and the 30% KPI', 'ch1-payday', /15\.000\.000.*4\.500\.000/],
    ['colleagues get to know each other', 'ch1-team-lunch', /Dân.*Uyên.*Khoa/],
    ['the company pleads hard times and asks to wait', 'ch2-hard-times', /khó khăn.*đợi thêm/],
    [
      'people grow bitter while the company says nothing',
      'ch3-no-news',
      /không có một thông báo nào về kế hoạch trả/,
    ],
    [
      'the demand email serves as evidence for a lawsuit',
      'ch5-choose-way',
      /email đòi quyền lợi.*khởi kiện/,
    ],
    [
      'the chairman talks to the staff and works on their heads',
      'ch6-last-day',
      /đừng hỏi lương.*đầu tư vào chính mình/,
    ],
    ['everyone is borrowing', 'ch4-borrowing', /thẻ tín dụng.*vay bên nhà vợ.*Vay bố mẹ/],
    ['the 1 to 2 million dollars', 'ch4-the-dollars', /1–2 triệu đô/],
    ['the IPO and the internal shares', 'ch4-the-dollars', /IPO.*cổ phiếu nội bộ/],
    ['the KPI money is held', 'ch4-kpi-held', /Giam KPI/],
    ["and last month's payslip never came", 'ch4-kpi-held', /chuẩn hóa/],
    ['leaving early brings a "what a pity"', 'ending-survivor', /Tiếc quá.*Tiếc cho em/],
  ];

  it.each(cases)('%s', (_, sceneId, pattern) => {
    expect(textOf(sceneId)).toMatch(pattern);
  });

  it('schedules every one of those scenes', () => {
    const played = cases.map(([, sceneId]) => sceneId).filter((id) => !id.startsWith('ending-'));
    expect(played.filter((id) => !scheduled.has(id))).toEqual([]);
  });

  it('keeps the promises coming on the payslip and in the weekly sync', () => {
    expect(promises.some((line) => /this week/i.test(line))).toBe(true);
    expect(promises.some((line) => /next week/i.test(line))).toBe(true);
    expect(syncLines.every((line) => /next week|hopefully/i.test(line))).toBe(true);
  });

  it('starts with nothing owed and nothing that says otherwise (SCENARIO-086)', () => {
    const run = beginRun(1, world);
    expect(run.money.companyDebt).toBe(0);
    const firstMonth = ['ch1-first-day', 'ch1-town-hall', 'ch1-fruit-friday', 'ch1-payday'];
    const lateWords = /nợ lương|chậm lương|chưa có lương|lương trễ|next week|this week/i;
    expect(firstMonth.filter((id) => lateWords.test(textOf(id)))).toEqual([]);
  });
});
