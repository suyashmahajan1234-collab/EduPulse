const mongoose = require('mongoose');

const subjectMarkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  maxMarks: { type: Number, default: 100 },
  gradePoint: { type: String, default: 'A' },
});

const examResultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    grade: { type: String, required: true },
    examType: {
      type: String,
      enum: ['Unit Test 1', 'Midterm Examination', 'Unit Test 2', 'Final Examination'],
      required: true,
    },
    academicYear: { type: String, default: '2025-2026' },
    subjects: [subjectMarkSchema],
    totalMarks: { type: Number, required: true },
    maxTotalMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    overallGrade: { type: String, required: true },
    status: { type: String, enum: ['Passed', 'Failed'], default: 'Passed' },
    remarks: { type: String, default: 'Good performance' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExamResult', examResultSchema);

