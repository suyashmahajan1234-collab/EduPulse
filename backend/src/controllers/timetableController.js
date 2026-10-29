const Timetable = require('../models/Timetable');

// Get timetables for a grade
exports.getTimetables = async (req, res) => {
  try {
    const { grade, dayOfWeek } = req.query;
    let query = {};

    if (grade && grade !== 'All') {
      query.grade = grade;
    }

    if (dayOfWeek && dayOfWeek !== 'All') {
      query.dayOfWeek = dayOfWeek;
    }

    const timetables = await Timetable.find(query).sort({ dayOfWeek: 1 });
    res.json({ success: true, count: timetables.length, data: timetables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create or update timetable
exports.saveTimetable = async (req, res) => {
  try {
    const { grade, dayOfWeek, periods } = req.body;

    if (!grade || !dayOfWeek || !Array.isArray(periods)) {
      return res.status(400).json({ success: false, message: 'Invalid timetable payload' });
    }

    const timetable = await Timetable.findOneAndUpdate(
      { grade, dayOfWeek },
      { grade, dayOfWeek, periods },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Timetable updated successfully', data: timetable });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete timetable for grade and day
exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) {
      return res.status(404).json({ success: false, message: 'Timetable entry not found' });
    }
    res.json({ success: true, message: 'Timetable entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

