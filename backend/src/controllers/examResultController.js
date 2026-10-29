const ExamResult = require('../models/ExamResult');
const Student = require('../models/Student');

// Helper to calculate summary metrics from subjects
const computeMetrics = (subjects) => {
  let totalMarks = 0;
  let maxTotalMarks = 0;

  const processedSubjects = subjects.map((sub) => {
    const obtained = Number(sub.marksObtained) || 0;
    const max = Number(sub.maxMarks) || 100;
    totalMarks += obtained;
    maxTotalMarks += max;

    const subPct = max > 0 ? (obtained / max) * 100 : 0;
    let gradePoint = 'F';
    if (subPct >= 90) gradePoint = 'A+';
    else if (subPct >= 80) gradePoint = 'A';
    else if (subPct >= 70) gradePoint = 'B';
    else if (subPct >= 60) gradePoint = 'C';
    else if (subPct >= 40) gradePoint = 'D';

    return {
      name: sub.name,
      marksObtained: obtained,
      maxMarks: max,
      gradePoint,
    };
  });

  const percentage = maxTotalMarks > 0 ? Number(((totalMarks / maxTotalMarks) * 100).toFixed(2)) : 0;

  let overallGrade = 'F';
  if (percentage >= 90) overallGrade = 'A+';
  else if (percentage >= 80) overallGrade = 'A';
  else if (percentage >= 70) overallGrade = 'B';
  else if (percentage >= 60) overallGrade = 'C';
  else if (percentage >= 40) overallGrade = 'D';

  const status = percentage >= 40 ? 'Passed' : 'Failed';

  return {
    subjects: processedSubjects,
    totalMarks,
    maxTotalMarks,
    percentage,
    overallGrade,
    status,
  };
};

// Get exam results
exports.getExamResults = async (req, res) => {
  try {
    const { grade, examType, search } = req.query;
    let query = {};

    if (grade && grade !== 'All') {
      query.grade = grade;
    }

    if (examType && examType !== 'All') {
      query.examType = examType;
    }

    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const results = await ExamResult.find(query).sort({ percentage: -1 });
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single exam result (Report Card)
exports.getExamResultById = async (req, res) => {
  try {
    const result = await ExamResult.findById(req.params.id).populate('student');
    if (!result) {
      return res.status(404).json({ success: false, message: 'Exam result not found' });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create exam result
exports.createExamResult = async (req, res) => {
  try {
    const { studentId, examType, academicYear, subjects, remarks } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const metrics = computeMetrics(subjects || []);

    const examResult = await ExamResult.create({
      student: student._id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      grade: student.grade,
      examType: examType || 'Midterm Examination',
      academicYear: academicYear || '2025-2026',
      remarks: remarks || 'Good effort',
      ...metrics,
    });

    res.status(201).json({ success: true, data: examResult });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update exam result
exports.updateExamResult = async (req, res) => {
  try {
    const { subjects, examType, academicYear, remarks } = req.body;
    let updateData = { examType, academicYear, remarks };

    if (subjects && Array.isArray(subjects)) {
      const metrics = computeMetrics(subjects);
      updateData = { ...updateData, ...metrics };
    }

    const result = await ExamResult.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Exam result not found' });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete exam result
exports.deleteExamResult = async (req, res) => {
  try {
    const result = await ExamResult.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Exam result not found' });
    }
    res.json({ success: true, message: 'Exam result deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

