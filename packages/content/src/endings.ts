import type { Condition, EndingRule } from '@cstar/game-core';

const ENOUGH_EVIDENCE: Condition = { type: 'stat', stat: 'evidenceCount', min: 5 };
const IN_A_GROUP: Condition = { type: 'flag', flag: 'joinedGroup' };
const PURSUING: Condition = { type: 'flag', flag: 'chosePursue' };

const allOf = (...conditions: Condition[]): Condition => ({ type: 'all', conditions });

/** Checked from the top (GDD §6). The conditions are first guesses, for the owner to tune. */
export const endings: readonly EndingRule[] = [
  {
    id: 'good',
    title: 'The Good Ending',
    summary: 'Các khoản quyền lợi được giải quyết, và bạn bước sang chương mới.',
    hint: 'Đủ giấy tờ, có người đi cùng, và đã gửi yêu cầu chính thức.',
    scene: 'ending-good',
    when: allOf(PURSUING, ENOUGH_EVIDENCE, IN_A_GROUP, {
      type: 'flag',
      flag: 'sentFormalRequest',
    }),
  },
  {
    id: 'collective',
    title: 'The Collective',
    summary: 'Không ai đi một mình, và không ai là trường hợp đặc biệt nữa.',
    hint: 'Có một nhóm cùng đi, dù giấy tờ chưa đủ.',
    scene: 'ending-collective',
    when: allOf(PURSUING, IN_A_GROUP),
  },
  {
    id: 'investigator',
    title: 'The Investigator',
    summary: 'Một mình, với một tập giấy tờ có ngày tháng rõ ràng.',
    hint: 'Đủ giấy tờ và đi tới cùng, không cần ai bên cạnh.',
    scene: 'ending-investigator',
    when: allOf(PURSUING, ENOUGH_EVIDENCE),
  },
  {
    id: 'survivor',
    title: 'The Survivor',
    summary: 'Bạn rời đi. Tiền không về, nhưng bạn thì đã về.',
    hint: 'Biết lúc nào nên dừng lại.',
    scene: 'ending-survivor',
    when: {
      type: 'any',
      conditions: [
        { type: 'flag', flag: 'choseLeave' },
        { type: 'flag', flag: 'quitEarly' },
        PURSUING,
      ],
    },
  },
  {
    id: 'believer',
    title: 'The Believer',
    summary: 'Bạn tin đến cùng. Công ty rất trân trọng điều đó.',
    hint: 'Ở lại, và thật lòng tin vào tầm nhìn.',
    scene: 'ending-believer',
    when: { type: 'relation', npc: 'boss', min: 20 },
  },
  {
    id: 'empty-promise',
    title: 'The Empty Promise',
    summary: 'Công ty tiếp tục hứa hẹn. Mọi thứ vẫn chưa thay đổi.',
    hint: 'Không làm gì cả. Rất nhiều người đã đạt kết thúc này.',
    scene: 'ending-empty-promise',
    loops: true,
  },
];
