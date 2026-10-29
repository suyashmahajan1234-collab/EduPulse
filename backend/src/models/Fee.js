const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    grade: { type: String, required: true },
    feeType: {
      type: String,
      enum: ['Tuition Fee', 'Laboratory Fee', 'Transport Fee', 'Annual Sports & Activity Fee'],
      required: true,
    },
    amount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paymentDate: { type: Date },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Partial', 'Overdue'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Cheque', 'None'],
      default: 'None',
    },
    transactionRef: { type: String, default: '' },
    remarks: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fee', feeSchema);

