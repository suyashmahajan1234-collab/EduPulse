const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, unique: true, trim: true },
    grade: { type: String, required: true, trim: true },
    dob: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    parentName: { type: String, trim: true },
    parentPhone: { type: String, trim: true },
    address: { type: String, trim: true },
    admissionDate: { type: Date, default: Date.now },
    bloodGroup: { type: String, default: 'O+' },
    status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);

