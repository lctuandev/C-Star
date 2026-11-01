import type { EvidenceItem } from '@cstar/game-core';

/**
 * Only the character's own papers: nothing taken from where they should not be (contracts/content.md
 * §4). Order matters: `findEvidence` takes the first one the month allows.
 */
export const evidence: readonly EvidenceItem[] = [
  {
    id: 'contract',
    title: 'Hợp đồng lao động',
    description: 'Bản bạn đã ký, kể cả trang 14 cỡ chữ 6. Ghi rõ mức lương và ngày nhận việc.',
  },
  {
    id: 'bank-history',
    title: 'Lịch sử nhận lương',
    description:
      'Sao kê tài khoản của chính bạn: một tháng đủ, rồi những khoản lẻ không theo ngày nào.',
    fromMonth: 2,
  },
  {
    id: 'timesheet',
    title: 'Bảng chấm công',
    description: 'Bảng công ghi rõ những tháng bạn vẫn đi làm đều.',
    fromMonth: 3,
    toMonth: 5,
  },
  {
    id: 'kpi-mails',
    title: 'Email giao việc và KPI',
    description: 'Các email giao chỉ tiêu gửi tới bạn, trong đúng những tháng không có lương.',
    fromMonth: 3,
    toMonth: 6,
  },
  {
    id: 'group-notes',
    title: 'Sổ ghi lời hứa',
    description: 'Ngày giờ của từng lời hứa trả lương, ghi lại ngay khi nghe thấy.',
    fromMonth: 4,
    requires: { type: 'flag', flag: 'startedNotes' },
  },
  {
    id: 'hr-promises',
    title: 'Các thông báo của HR',
    description: 'Mọi thông báo gửi chung về lương, xếp theo ngày. Không cái nào có con số.',
    fromMonth: 5,
    toMonth: 7,
  },
  {
    id: 'demand-mail',
    title: 'Email đòi quyền lợi',
    description:
      'Bản bạn gửi công ty, nêu rõ từng khoản bị nợ, cùng mọi hồi âm. Ghi rõ ngày bạn đã đòi.',
    fromMonth: 7,
    requires: { type: 'flag', flag: 'sentFormalRequest' },
  },
  {
    id: 'lost-slips',
    title: 'Phiếu lương bị thiếu',
    description: 'Phiếu lương những tháng công ty không gửi, cô Kế toán đưa tận tay.',
    requires: { type: 'flag', flag: 'gotLostSlips' },
  },
  {
    id: 'debt-table',
    title: 'Bảng đối chiếu của nhóm',
    description: 'Ai, tháng nào, được hứa gì, đã nhận bao nhiêu, còn thiếu bao nhiêu.',
    fromMonth: 8,
  },
];
