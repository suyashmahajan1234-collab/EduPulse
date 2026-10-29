const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  periodNumber: { type: Number, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subject: { type: String, required: true },
  teacherName: { type: String, required: true },
  roomNumber: { type: String, default: 'Room 101' },
});

const timetableSchema = new mongoose.Schema(
  {
    grade: { type: String, required: true },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true,
    },
    periods: [periodSchema],
  },
  { timestamps: true }
);

timetableSchema.index({ grade: 1, dayOfWeek: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema);

