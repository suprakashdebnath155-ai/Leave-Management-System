const { getHolidayDates } = require("../services/holidayService");

const parseDate = (value) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!value || Number.isNaN(date.getTime())) throw new Error("Invalid date");
  return date;
};

const calculateWorkingDays = async (startDate, endDate, halfDay = false) => {
  const current = parseDate(startDate);
  const end = parseDate(endDate);
  if (current > end) throw new Error("End date must be on or after start date");
  const holidayDates = await getHolidayDates();
  let count = 0;
  while (current <= end) {
    const day = current.getUTCDay();
    const formatted = current.toISOString().slice(0, 10);
    if (day !== 0 && day !== 6 && !holidayDates.has(formatted)) count += 1;
    current.setUTCDate(current.getUTCDate() + 1);
  }
  if (count === 0) {
    throw new Error("Selected dates contain only weekends or holidays");
  }
  if (halfDay) {
    if (startDate !== endDate) {
      throw new Error("Half-day leave must start and end on the same date");
    }
    return 0.5;
  }
  return count;
};

module.exports = { calculateWorkingDays, parseDate };
