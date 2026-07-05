const { db } = require("../config/firebase");

const createHoliday = async (
  holidayData
) => {
  const docRef = await db
    .collection("holidays")
    .add({
      ...holidayData,
      createdAt: new Date(),
    });

  return docRef.id;
};

const getAllHolidays = async () => {
  const snapshot = await db
    .collection("holidays")
    .orderBy("date", "asc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

const getHolidayDates =
  async () => {
    const snapshot =
      await db
        .collection("holidays")
        .get();

    const holidayDates =
      new Set();

    snapshot.docs.forEach(
      (doc) => {
        holidayDates.add(
          doc.data().date
        );
      }
    );

    return holidayDates;
  };

const isHoliday = async (
  date
) => {
  const snapshot = await db
    .collection("holidays")
    .where("date", "==", date)
    .limit(1)
    .get();

  return !snapshot.empty;
};

module.exports = {
  createHoliday,
  getAllHolidays,
  getHolidayDates,
  isHoliday,
};