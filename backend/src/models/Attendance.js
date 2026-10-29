const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  studentName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Excused'],
    default: 'Present',
  },
  remarks: { type: String, default: '' },
});

const attendanceSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    grade: { type: String, required: true },
    records: [attendanceRecordSchema],
    totalStudents: { type: Number, default: 0 },
    presentCount: { type: Number, default: 0 },
    absentCount: { type: Number, default: 0 },
    lateCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound index so one grade has at most one attendance record per day
attendanceSchema.index({ date: 1, grade: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

