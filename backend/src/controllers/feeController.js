const Fee = require('../models/Fee');
const Student = require('../models/Student');

// Get all fee records
exports.getFees = async (req, res) => {
  try {
    const { grade, paymentStatus, search } = req.query;
    let query = {};

    if (grade && grade !== 'All') {
      query.grade = grade;
    }

    if (paymentStatus && paymentStatus !== 'All') {
      query.paymentStatus = paymentStatus;
    }

    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const fees = await Fee.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: fees.length, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get fee stats
exports.getFeeStats = async (req, res) => {
  try {
    const allFees = await Fee.find();
    let totalBilled = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    const today = new Date();

    allFees.forEach((f) => {
      totalBilled += f.amount - (f.discount || 0);
      totalCollected += f.paidAmount || 0;
      totalPending += f.balanceAmount || 0;

      if (f.paymentStatus === 'Paid') paidCount++;
      else if (f.paymentStatus === 'Pending') pendingCount++;
      else if (f.paymentStatus === 'Overdue' || (f.dueDate && new Date(f.dueDate) < today && f.balanceAmount > 0)) {
        overdueCount++;
      }
    });

    res.json({
      success: true,
      data: {
        totalBilled,
        totalCollected,
        totalPending,
        collectionRate: totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) + '%' : '0%',
        paidCount,
        pendingCount,
        overdueCount,
        totalInvoices: allFees.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single fee invoice
exports.getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate('student');
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee invoice not found' });
    }
    res.json({ success: true, data: fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create fee invoice
exports.createFee = async (req, res) => {
  try {
    const { studentId, feeType, amount, discount, dueDate, remarks } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const netAmount = Number(amount) - (Number(discount) || 0);
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const fee = await Fee.create({
      invoiceNumber,
      student: student._id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      grade: student.grade,
      feeType,
      amount: Number(amount),
      discount: Number(discount) || 0,
      paidAmount: 0,
      balanceAmount: netAmount,
      dueDate: dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      paymentStatus: 'Pending',
      remarks: remarks || '',
    });

    res.status(201).json({ success: true, data: fee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Record payment
exports.recordPayment = async (req, res) => {
  try {
    const { paymentAmount, paymentMethod, transactionRef } = req.body;
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee invoice not found' });
    }

    const payNow = Number(paymentAmount);
    if (isNaN(payNow) || payNow <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount' });
    }

    const newPaidAmount = (fee.paidAmount || 0) + payNow;
    const netTotal = fee.amount - (fee.discount || 0);
    const newBalance = Math.max(0, netTotal - newPaidAmount);

    let newStatus = 'Partial';
    if (newBalance <= 0) {
      newStatus = 'Paid';
    } else if (newPaidAmount === 0) {
      newStatus = 'Pending';
    }

    fee.paidAmount = newPaidAmount;
    fee.balanceAmount = newBalance;
    fee.paymentStatus = newStatus;
    fee.paymentDate = new Date();
    fee.paymentMethod = paymentMethod || 'Cash';
    if (transactionRef) fee.transactionRef = transactionRef;

    await fee.save();

    res.json({ success: true, message: 'Payment recorded successfully', data: fee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete fee invoice
exports.deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee invoice not found' });
    }
    res.json({ success: true, message: 'Fee invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

