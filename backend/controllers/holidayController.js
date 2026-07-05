const { db } = require("../config/firebase");
const { createHoliday, getAllHolidays } = require("../services/holidayService");
const nationalHolidays = require("../data/nationalHolidays");

const addHoliday = async (req, res) => {
  try {
    const { name, date, type = "Public holiday" } = req.body;
    if (!name?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date || "")) {
      return res.status(400).json({
        success: false,
        message: "Holiday name and a valid date are required",
      });
    }
    const existing = await db.collection("holidays").where("date", "==", date).limit(1).get();
    if (!existing.empty) {
      return res.status(409).json({ success: false, message: "A holiday already exists on this date" });
    }
    const holidayId = await createHoliday({ name: name.trim(), date, type });
    res.status(201).json({ success: true, message: "Holiday added successfully", holidayId });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getHolidays = async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();

    // Automatic national holidays
    const autoHolidays = nationalHolidays[year] || [];

    // Holidays added by admin
    const customHolidays = await getAllHolidays();

    // Merge holidays and remove duplicate dates
    const holidayMap = new Map();

    [...autoHolidays, ...customHolidays].forEach((holiday) => {
      holidayMap.set(holiday.date, holiday);
    });

    const holidays = [...holidayMap.values()].sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    res.json({
      success: true,
      count: holidays.length,
      holidays,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeHoliday = async (req, res) => {
  try {
    await db.collection("holidays").doc(req.params.id).delete();
    res.json({ success: true, message: "Holiday removed" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { addHoliday, getHolidays, removeHoliday };
