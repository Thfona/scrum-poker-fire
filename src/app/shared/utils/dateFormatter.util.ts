export const dateFormatterUtil = (date: Date) => {
  return date.toISOString().split('T')[0];
};
