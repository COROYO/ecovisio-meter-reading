export const readingIsInCurrentMonthAndYear = (reading: {
  readingDate: Date;
}) => {
  return (
    reading.readingDate.getMonth() === new Date().getMonth() &&
    reading.readingDate.getFullYear() === new Date().getFullYear()
  );
};
