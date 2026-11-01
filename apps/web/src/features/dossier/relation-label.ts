/** Words, not numbers: a relationship should not read like a score. */
export const relationLabel = (value: number): string => {
  if (value >= 40) {
    return 'Thân thiết';
  }
  if (value >= 15) {
    return 'Tin bạn';
  }
  if (value > -15) {
    return 'Bình thường';
  }
  return value > -40 ? 'Dè chừng' : 'Khó xử';
};
