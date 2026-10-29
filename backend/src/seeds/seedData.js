require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const ExamResult = require('../models/ExamResult');
const Fee = require('../models/Fee');
const Timetable = require('../models/Timetable');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school_erp';

const studentsData = [
  {
    name: 'Aarav Sharma',
    rollNumber: 'STU-1001',
    grade: 'Grade 10-A',
    dob: new Date('2009-04-12'),
    gender: 'Male',
    email: 'aarav.sharma@school.edu',
    phone: '+91 98201 11223',
    parentName: 'Rajesh Sharma',
    parentPhone: '+91 98201 99887',
    address: '42 Orchid Heights, Mumbai',
    bloodGroup: 'B+',
    status: 'Active',
  },
  {
    name: 'Ananya Iyer',
    rollNumber: 'STU-1002',
    grade: 'Grade 10-A',
    dob: new Date('2009-08-25'),
    gender: 'Female',
    email: 'ananya.iyer@school.edu',
    phone: '+91 98202 22334',
    parentName: 'Suresh Iyer',
    parentPhone: '+91 98202 88776',
    address: '15 Green Meadows, Mumbai',
    bloodGroup: 'O+',
    status: 'Active',
  },
  {
    name: 'Rohan Verma',
    rollNumber: 'STU-1003',
    grade: 'Grade 10-A',
    dob: new Date('2009-01-15'),
    gender: 'Male',
    email: 'rohan.verma@school.edu',
    phone: '+91 98203 33445',
    parentName: 'Vikas Verma',
    parentPhone: '+91 98203 77665',
    address: '88 Rosewood Residency, Pune',
    bloodGroup: 'A+',
    status: 'Active',
  },
  {
    name: 'Diya Patel',
    rollNumber: 'STU-1004',
    grade: 'Grade 10-B',
    dob: new Date('2009-11-03'),
    gender: 'Female',
    email: 'diya.patel@school.edu',
    phone: '+91 98204 44556',
    parentName: 'Kirit Patel',
    parentPhone: '+91 98204 66554',
    address: '10 Sunflower Park, Ahmedabad',
    bloodGroup: 'AB+',
    status: 'Active',
  },
  {
    name: 'Ishaan Malhotra',
    rollNumber: 'STU-1005',
    grade: 'Grade 10-B',
    dob: new Date('2009-06-18'),
    gender: 'Male',
    email: 'ishaan.m@school.edu',
    phone: '+91 98205 55667',
    parentName: 'Amit Malhotra',
    parentPhone: '+91 98205 55443',
    address: '77 Silver Oak, New Delhi',
    bloodGroup: 'O-',
    status: 'Active',
  },
  {
    name: 'Meera Nambiar',
    rollNumber: 'STU-1006',
    grade: 'Grade 9-A',
    dob: new Date('2010-03-30'),
    gender: 'Female',
    email: 'meera.nambiar@school.edu',
    phone: '+91 98206 66778',
    parentName: 'Gopal Nambiar',
    parentPhone: '+91 98206 44332',
    address: '23 Palm Groves, Kochi',
    bloodGroup: 'B-',
    status: 'Active',
  },
  {
    name: 'Kabir Sengupta',
    rollNumber: 'STU-1007',
    grade: 'Grade 9-A',
    dob: new Date('2010-09-14'),
    gender: 'Male',
    email: 'kabir.s@school.edu',
    phone: '+91 98207 77889',
    parentName: 'Subir Sengupta',
    parentPhone: '+91 98207 33221',
    address: '14 Lakeview Villas, Kolkata',
    bloodGroup: 'A-',
    status: 'Active',
  },
  {
    name: 'Sanya Mirza',
    rollNumber: 'STU-1008',
    grade: 'Grade 11-Science',
    dob: new Date('2008-07-22'),
    gender: 'Female',
    email: 'sanya.m@school.edu',
    phone: '+91 98208 88990',
    parentName: 'Tariq Mirza',
    parentPhone: '+91 98208 22110',
    address: '5 Banjara Hills, Hyderabad',
    bloodGroup: 'O+',
    status: 'Active',
  },
  {
    name: 'Aditya Rao',
    rollNumber: 'STU-1009',
    grade: 'Grade 12-Science',
    dob: new Date('2007-12-05'),
    gender: 'Male',
    email: 'aditya.rao@school.edu',
    phone: '+91 98209 99001',
    parentName: 'Raghav Rao',
    parentPhone: '+91 98209 11009',
    address: '32 Indiranagar, Bengaluru',
    bloodGroup: 'B+',
    status: 'Active',
  },
];

const teachersData = [
  {
    name: 'Dr. Vikramaditya Kulkarni',
    employeeId: 'TCH-001',
    email: 'v.kulkarni@school.edu',
    phone: '+91 98111 22334',
    subjectSpecialization: 'Mathematics',
    qualification: 'Ph.D. in Applied Mathematics, B.Ed.',
    assignedClasses: ['Grade 10-A', 'Grade 10-B', 'Grade 12-Science'],
    salary: 68000,
    status: 'Active',
  },
  {
    name: 'Prof. Shalini Roy',
    employeeId: 'TCH-002',
    email: 'shalini.roy@school.edu',
    phone: '+91 98112 33445',
    subjectSpecialization: 'Physics',
    qualification: 'M.Sc. Physics, B.Ed.',
    assignedClasses: ['Grade 10-A', 'Grade 11-Science', 'Grade 12-Science'],
    salary: 62000,
    status: 'Active',
  },
  {
    name: 'Marcus Anthony',
    employeeId: 'TCH-003',
    email: 'marcus.anthony@school.edu',
    phone: '+91 98113 44556',
    subjectSpecialization: 'English Literature',
    qualification: 'M.A. English, Cambridge CELTA',
    assignedClasses: ['Grade 9-A', 'Grade 10-A', 'Grade 10-B'],
    salary: 58000,
    status: 'Active',
  },
  {
    name: 'Dr. Neha Saxena',
    employeeId: 'TCH-004',
    email: 'neha.saxena@school.edu',
    phone: '+91 98114 55667',
    subjectSpecialization: 'Computer Science',
    qualification: 'M.Tech Computer Science, B.Ed.',
    assignedClasses: ['Grade 10-A', 'Grade 11-Science', 'Grade 12-Science'],
    salary: 65000,
    status: 'Active',
  },
  {
    name: 'Anita Deshmukh',
    employeeId: 'TCH-005',
    email: 'anita.deshmukh@school.edu',
    phone: '+91 98115 66778',
    subjectSpecialization: 'Chemistry',
    qualification: 'M.Sc. Organic Chemistry, B.Ed.',
    assignedClasses: ['Grade 10-A', 'Grade 11-Science'],
    salary: 59000,
    status: 'Active',
  },
  {
    name: 'Rajeev Menon',
    employeeId: 'TCH-006',
    email: 'rajeev.menon@school.edu',
    phone: '+91 98116 77889',
    subjectSpecialization: 'Biology',
    qualification: 'M.Sc. Zoology, B.Ed.',
    assignedClasses: ['Grade 9-A', 'Grade 10-B'],
    salary: 57000,
    status: 'Active',
  },
];

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected successfully.');

    // Clear existing data
    await Promise.all([
      Student.deleteMany({}),
      Teacher.deleteMany({}),
      Attendance.deleteMany({}),
      ExamResult.deleteMany({}),
      Fee.deleteMany({}),
      Timetable.deleteMany({}),
    ]);
    console.log('[Seed] Cleared existing records.');

    // Insert Students and Teachers
    const createdStudents = await Student.insertMany(studentsData);
    const createdTeachers = await Teacher.insertMany(teachersData);
    console.log(`[Seed] Created ${createdStudents.length} students and ${createdTeachers.length} teachers.`);

    // Seed Attendance
    const today = new Date().toISOString().split('T')[0];
    const grade10Students = createdStudents.filter((s) => s.grade === 'Grade 10-A');
    await Attendance.create({
      date: today,
      grade: 'Grade 10-A',
      records: grade10Students.map((s, idx) => ({
        student: s._id,
        studentName: s.name,
        rollNumber: s.rollNumber,
        status: idx === 2 ? 'Absent' : 'Present',
        remarks: idx === 2 ? 'Medical fever' : 'On time',
      })),
      totalStudents: grade10Students.length,
      presentCount: grade10Students.length - 1,
      absentCount: 1,
      lateCount: 0,
    });

    // Seed Exam Results
    const s1 = createdStudents[0]; // Aarav
    const s2 = createdStudents[1]; // Ananya
    const s3 = createdStudents[2]; // Rohan

    await ExamResult.create([
      {
        student: s1._id,
        studentName: s1.name,
        rollNumber: s1.rollNumber,
        grade: s1.grade,
        examType: 'Midterm Examination',
        academicYear: '2025-2026',
        subjects: [
          { name: 'Mathematics', marksObtained: 94, maxMarks: 100, gradePoint: 'A+' },
          { name: 'Physics', marksObtained: 88, maxMarks: 100, gradePoint: 'A' },
          { name: 'Chemistry', marksObtained: 91, maxMarks: 100, gradePoint: 'A+' },
          { name: 'English Literature', marksObtained: 85, maxMarks: 100, gradePoint: 'A' },
          { name: 'Computer Science', marksObtained: 98, maxMarks: 100, gradePoint: 'A+' },
        ],
        totalMarks: 456,
        maxTotalMarks: 500,
        percentage: 91.2,
        overallGrade: 'A+',
        status: 'Passed',
        remarks: 'Outstanding academic excellence',
      },
      {
        student: s2._id,
        studentName: s2.name,
        rollNumber: s2.rollNumber,
        grade: s2.grade,
        examType: 'Midterm Examination',
        academicYear: '2025-2026',
        subjects: [
          { name: 'Mathematics', marksObtained: 96, maxMarks: 100, gradePoint: 'A+' },
          { name: 'Physics', marksObtained: 92, maxMarks: 100, gradePoint: 'A+' },
          { name: 'Chemistry', marksObtained: 95, maxMarks: 100, gradePoint: 'A+' },
          { name: 'English Literature', marksObtained: 90, maxMarks: 100, gradePoint: 'A+' },
          { name: 'Computer Science', marksObtained: 99, maxMarks: 100, gradePoint: 'A+' },
        ],
        totalMarks: 472,
        maxTotalMarks: 500,
        percentage: 94.4,
        overallGrade: 'A+',
        status: 'Passed',
        remarks: 'Exemplary performance, class topper',
      },
      {
        student: s3._id,
        studentName: s3.name,
        rollNumber: s3.rollNumber,
        grade: s3.grade,
        examType: 'Midterm Examination',
        academicYear: '2025-2026',
        subjects: [
          { name: 'Mathematics', marksObtained: 72, maxMarks: 100, gradePoint: 'B' },
          { name: 'Physics', marksObtained: 68, maxMarks: 100, gradePoint: 'C' },
          { name: 'Chemistry', marksObtained: 75, maxMarks: 100, gradePoint: 'B' },
          { name: 'English Literature', marksObtained: 82, maxMarks: 100, gradePoint: 'A' },
          { name: 'Computer Science', marksObtained: 78, maxMarks: 100, gradePoint: 'B' },
        ],
        totalMarks: 375,
        maxTotalMarks: 500,
        percentage: 75.0,
        overallGrade: 'B',
        status: 'Passed',
        remarks: 'Good progress, focus on physics numericals',
      },
    ]);

    // Seed Fee Records
    await Fee.create([
      {
        invoiceNumber: 'INV-2026-001',
        student: s1._id,
        studentName: s1.name,
        rollNumber: s1.rollNumber,
        grade: s1.grade,
        feeType: 'Tuition Fee',
        amount: 25000,
        discount: 2000,
        paidAmount: 23000,
        balanceAmount: 0,
        dueDate: new Date('2026-11-15'),
        paymentDate: new Date('2026-10-20'),
        paymentStatus: 'Paid',
        paymentMethod: 'UPI',
        transactionRef: 'UPI-98472918',
        remarks: 'Annual semester 1 payment cleared',
      },
      {
        invoiceNumber: 'INV-2026-002',
        student: s2._id,
        studentName: s2.name,
        rollNumber: s2.rollNumber,
        grade: s2.grade,
        feeType: 'Laboratory Fee',
        amount: 8500,
        discount: 500,
        paidAmount: 4000,
        balanceAmount: 4000,
        dueDate: new Date('2026-11-10'),
        paymentDate: new Date('2026-10-15'),
        paymentStatus: 'Partial',
        paymentMethod: 'Credit Card',
        transactionRef: 'TXN-773120',
        remarks: 'First installment paid',
      },
      {
        invoiceNumber: 'INV-2026-003',
        student: s3._id,
        studentName: s3.name,
        rollNumber: s3.rollNumber,
        grade: s3.grade,
        feeType: 'Transport Fee',
        amount: 12000,
        discount: 0,
        paidAmount: 0,
        balanceAmount: 12000,
        dueDate: new Date('2026-10-15'),
        paymentStatus: 'Overdue',
        paymentMethod: 'None',
        remarks: 'Reminder notice issued to parent',
      },
      {
        invoiceNumber: 'INV-2026-004',
        student: createdStudents[3]._id,
        studentName: createdStudents[3].name,
        rollNumber: createdStudents[3].rollNumber,
        grade: createdStudents[3].grade,
        feeType: 'Tuition Fee',
        amount: 25000,
        discount: 0,
        paidAmount: 0,
        balanceAmount: 25000,
        dueDate: new Date('2026-11-30'),
        paymentStatus: 'Pending',
        paymentMethod: 'None',
        remarks: 'Term 2 tuition fee',
      },
    ]);

    // Seed Timetable for Grade 10-A
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const periodTemplates = [
      { periodNumber: 1, startTime: '08:30 AM', endTime: '09:15 AM', subject: 'Mathematics', teacherName: 'Dr. Vikramaditya Kulkarni', roomNumber: 'Room 201' },
      { periodNumber: 2, startTime: '09:15 AM', endTime: '10:00 AM', subject: 'Physics', teacherName: 'Prof. Shalini Roy', roomNumber: 'Lab Physics 1' },
      { periodNumber: 3, startTime: '10:15 AM', endTime: '11:00 AM', subject: 'English Literature', teacherName: 'Marcus Anthony', roomNumber: 'Room 201' },
      { periodNumber: 4, startTime: '11:00 AM', endTime: '11:45 AM', subject: 'Chemistry', teacherName: 'Anita Deshmukh', roomNumber: 'Lab Chem 2' },
      { periodNumber: 5, startTime: '12:30 PM', endTime: '01:15 PM', subject: 'Computer Science', teacherName: 'Dr. Neha Saxena', roomNumber: 'Computer Lab 3' },
      { periodNumber: 6, startTime: '01:15 PM', endTime: '02:00 PM', subject: 'Physical Education & Library', teacherName: 'Rajeev Menon', roomNumber: 'Sports Complex' },
    ];

    for (const day of days) {
      await Timetable.create({
        grade: 'Grade 10-A',
        dayOfWeek: day,
        periods: periodTemplates,
      });
    }

    console.log('[Seed] Database populated successfully with full ERP records!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();

