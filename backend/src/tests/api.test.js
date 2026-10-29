const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('School Management ERP API Suite', () => {
  before(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school_erp_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  after(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  it('GET /api/health should return status OK', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'OK');
    assert.ok(res.body.message.includes('School Management ERP'));
  });

  it('POST /api/students should create a new student', async () => {
    const uniqueRoll = `TEST-ROLL-${Date.now()}`;
    const res = await request(app)
      .post('/api/students')
      .send({
        name: 'Test Student',
        rollNumber: uniqueRoll,
        grade: 'Grade 10-A',
        email: 'test.student@school.edu',
        phone: '+91 99999 88888',
        parentName: 'Parent Test',
        parentPhone: '+91 99999 77777',
        status: 'Active',
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.name, 'Test Student');
    assert.strictEqual(res.body.data.rollNumber, uniqueRoll);
  });

  it('GET /api/students should return list of students', async () => {
    const res = await request(app).get('/api/students');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  it('POST /api/teachers should create a new teacher', async () => {
    const uniqueEmpId = `EMP-TEST-${Date.now()}`;
    const res = await request(app)
      .post('/api/teachers')
      .send({
        name: 'Dr. Test Professor',
        employeeId: uniqueEmpId,
        email: `prof.${Date.now()}@school.edu`,
        phone: '+91 91111 22222',
        subjectSpecialization: 'Mathematics',
        qualification: 'Ph.D.',
        assignedClasses: ['Grade 10-A'],
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.employeeId, uniqueEmpId);
  });

  it('GET /api/teachers should return list of teachers', async () => {
    const res = await request(app).get('/api/teachers');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  it('GET /api/dashboard/stats should return dashboard metrics', async () => {
    const res = await request(app).get('/api/dashboard/stats');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.totalStudents >= 0);
    assert.ok(res.body.data.totalTeachers >= 0);
    assert.ok(res.body.data.feeOverview !== undefined);
  });

  it('GET /api/fees should return fee records and stats', async () => {
    const res = await request(app).get('/api/fees');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    const statsRes = await request(app).get('/api/fees/stats');
    assert.strictEqual(statsRes.status, 200);
    assert.ok(statsRes.body.data.collectionRate !== undefined);
  });

  it('GET /api/exams should return exam results', async () => {
    const res = await request(app).get('/api/exams');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('GET /api/timetables should return timetable schedules', async () => {
    const res = await request(app).get('/api/timetables');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });
});

