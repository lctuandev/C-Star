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
    description: 'Sao kê tài khoản của chính bạn: một lần "ting", rồi im lặng.',
    fromMonth: 2,
  },
  {
    id: 'timesheet',
    title: 'Bảng chấm công',
    description: 'Bản xuất từ hệ thống cho riêng bạn. Chứng minh bạn vẫn đi làm đều.',
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
];
