const test = require("node:test");
const assert = require("node:assert/strict");

const holidayServicePath = require.resolve("../services/holidayService");
require.cache[holidayServicePath] = {
  id: holidayServicePath,
  filename: holidayServicePath,
  loaded: true,
  exports: {
    getHolidayDates: async () => new Set(["2026-01-26"]),
  },
};

const { calculateWorkingDays } = require("../utils/dateUtils");

test("excludes weekends and configured holidays", async () => {
  const days = await calculateWorkingDays("2026-01-23", "2026-01-27");
  assert.equal(days, 2);
});

test("counts a valid half day as 0.5", async () => {
  const days = await calculateWorkingDays("2026-01-27", "2026-01-27", true);
  assert.equal(days, 0.5);
});

test("rejects reversed ranges", async () => {
  await assert.rejects(
    calculateWorkingDays("2026-02-10", "2026-02-09"),
    /End date/
  );
});

test("rejects ranges containing no working day", async () => {
  await assert.rejects(
    calculateWorkingDays("2026-01-24", "2026-01-26"),
    /only weekends or holidays/
  );
});
