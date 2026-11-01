import type { Ticket } from '@cstar/game-core';
import { KHOA_IS_HERE, WAGES_ARE_OWED } from './economy.js';

/**
 * The desk mini-game: do what is actual work, push what is not. The joke is that the pool gets the
 * player to think like the company, and that the replies notice.
 */
export const tickets: readonly Ticket[] = [
  {
    id: 'login-down',
    from: 'Khách hàng',
    text: 'Không đăng nhập được từ sáng, cả phòng đang đứng hình.',
    answer: 'do',
    reply: 'Sửa xong trong 12 phút. Không ai biết, vì khi chạy đúng thì không ai nhìn.',
  },
  {
    id: 'logo-bigger',
    from: 'Sếp',
    text: 'Logo to hơn 10%, nhưng vẫn phải tinh tế.',
    answer: 'defer',
    reply: 'Đẩy sang sprint sau. Sprint sau sếp sẽ muốn nhỏ lại 10%.',
  },
  {
    id: 'invoice-bug',
    from: 'Cô Kế toán',
    text: 'Hóa đơn tháng trước tính sai thuế, cần sửa trước khi nộp.',
    answer: 'do',
    reply: 'Sửa xong. Cô Kế toán gật đầu một cái, tương đương huân chương ở phòng này.',
  },
  {
    id: 'vision-deck',
    from: 'Sếp',
    text: 'Làm 40 slide tầm nhìn 2035, thứ Hai cần, không gấp.',
    answer: 'defer',
    reply: 'Sprint sau. Tầm nhìn 2035 chờ được, tầm nhìn 2030 còn đang chờ kia kìa.',
  },
  {
    id: 'data-loss',
    from: 'Dân',
    text: 'Bản sao lưu không chạy từ đầu tuần, cả tuần chưa ai để ý.',
    answer: 'do',
    reply: 'Chạy lại được. Bạn vừa cứu công ty mà không có ai để kể.',
  },
  {
    id: 'mission-rewrite',
    from: 'Chị HR',
    text: 'Viết lại sứ mệnh công ty cho "Gen Z hơn".',
    answer: 'defer',
    reply: 'Đẩy đi. Sứ mệnh hiện tại vẫn chưa được thực hiện, chưa cần bản mới.',
  },
  {
    id: 'security-patch',
    from: 'Uyên',
    text: 'Có bản vá bảo mật, chậm là lộ mật khẩu khách hàng.',
    answer: 'do',
    reply: 'Vá xong. Uyên ghi vào file của cô ấy. File đó ngày càng dày.',
  },
  {
    id: 'team-song',
    from: 'Chị HR',
    text: 'Mỗi phòng thu một bài hát nội bộ cho lễ tổng kết.',
    answer: 'defer',
    reply: 'Sprint sau. Nhạc nội bộ không trả được tiền nhà.',
  },
  {
    id: 'payroll-export',
    from: 'Cô Kế toán',
    text: 'Xuất bảng công tháng này, thiếu là không tính được lương.',
    answer: 'do',
    reply: 'Bạn xuất bảng công cho một khoản lương chưa biết bao giờ có. Bạn vẫn làm đúng.',
    requires: WAGES_ARE_OWED,
  },
  {
    id: 'kpi-dashboard',
    from: 'Sếp',
    text: 'Làm bảng theo dõi KPI của cái bảng theo dõi KPI.',
    answer: 'defer',
    reply: 'Đẩy đi. Tuy nhiên bảng này có khả năng sẽ quay lại, mạnh hơn.',
  },
  {
    id: 'customer-refund',
    from: 'Khách hàng',
    text: 'Trừ tiền hai lần, xin hoàn lại một lần.',
    answer: 'do',
    reply: 'Hoàn xong. Ít nhất có người được trả đúng tiền trong tháng này.',
    requires: WAGES_ARE_OWED,
  },
  {
    id: 'wall-slogan',
    from: 'Sếp',
    text: 'Đề xuất ba khẩu hiệu mới cho bức tường sảnh.',
    answer: 'defer',
    reply: 'Sprint sau. Bức tường đã nói quá nhiều rồi.',
  },
  {
    id: 'server-full',
    from: 'Khoa',
    text: 'Ổ đĩa máy chủ còn 2%, chiều nay là hết.',
    answer: 'do',
    reply: 'Dọn xong. Khoa gửi sticker trái tim, và bảo tuần sau chắc có lương.',
    requires: { type: 'all', conditions: [KHOA_IS_HERE, WAGES_ARE_OWED] },
  },
  {
    id: 'birthday-video',
    from: 'Chị HR',
    text: 'Dựng video chúc mừng sinh nhật công ty, dài 8 phút.',
    answer: 'defer',
    reply: 'Đẩy đi. Công ty tròn tuổi, còn lương thì chưa tròn.',
    requires: WAGES_ARE_OWED,
  },
];
