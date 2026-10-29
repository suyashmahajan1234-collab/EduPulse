const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    employeeId: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subjectSpecialization: { type: String, required: true, trim: true },
    qualification: { type: String, trim: true, default: 'B.Ed.' },
    assignedClasses: [{ type: String, trim: true }],
    joinDate: { type: Date, default: Date.now },
    salary: { type: Number, default: 45000 },
    status: { type: String, enum: ['Active', 'On Leave', 'Resigned'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherSchema);

