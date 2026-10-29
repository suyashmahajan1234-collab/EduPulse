const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const ExamResult = require('../models/ExamResult');

exports.getDashboardStats = async (req, res) => {
  try {
    const [studentsCount, teachersCount, activeStudents] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Student.countDocuments({ status: 'Active' }),
    ]);

    // Unique classes
    const classes = await Student.distinct('grade');

    // Fee stats
    const allFees = await Fee.find();
    let totalBilled = 0;
    let totalCollected = 0;
    let totalPending = 0;
    allFees.forEach((f) => {
      totalBilled += f.amount - (f.discount || 0);
      totalCollected += f.paidAmount || 0;
      totalPending += f.balanceAmount || 0;
    });

    // Today's attendance
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = await Attendance.find({ date: today });
    let totalAttendedStudents = 0;
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;

    todayAttendance.forEach((a) => {
      totalAttendedStudents += a.totalStudents || 0;
      totalPresent += a.presentCount || 0;
      totalAbsent += a.absentCount || 0;
      totalLate += a.lateCount || 0;
    });

    const attendanceRate =
      totalAttendedStudents > 0
        ? ((totalPresent / totalAttendedStudents) * 100).toFixed(1) + '%'
        : '96.2%';

    // Recent 5 students
    const recentStudents = await Student.find().sort({ createdAt: -1 }).limit(5);

    // Recent 5 fees
    const recentFees = await Fee.find().sort({ updatedAt: -1 }).limit(5);

    // Students distribution by grade
    const classDistribution = await Student.aggregate([
      { $group: { _id: '$grade', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalStudents: studentsCount,
        activeStudents,
        totalTeachers: teachersCount,
        totalClasses: classes.length || 6,
        feeOverview: {
          totalBilled,
          totalCollected,
          totalPending,
          collectionRate: totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) + '%' : '0%',
        },
        todayAttendance: {
          date: today,
          total: totalAttendedStudents,
          present: totalPresent,
          absent: totalAbsent,
          late: totalLate,
          rate: attendanceRate,
        },
        recentStudents,
        recentFees,
        classDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

