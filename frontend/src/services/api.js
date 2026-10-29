const BASE_URL = '/api';

export const api = {
  // Dashboard
  async getDashboardStats() {
    const res = await fetch(`${BASE_URL}/dashboard/stats`);
    return res.json();
  },

  // Students
  async getStudents(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/students${query ? `?${query}` : ''}`);
    return res.json();
  },
  async getStudentById(id) {
    const res = await fetch(`${BASE_URL}/students/${id}`);
    return res.json();
  },
  async createStudent(data) {
    const res = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async updateStudent(id, data) {
    const res = await fetch(`${BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async deleteStudent(id) {
    const res = await fetch(`${BASE_URL}/students/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Teachers
  async getTeachers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/teachers${query ? `?${query}` : ''}`);
    return res.json();
  },
  async createTeacher(data) {
    const res = await fetch(`${BASE_URL}/teachers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async updateTeacher(id, data) {
    const res = await fetch(`${BASE_URL}/teachers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async deleteTeacher(id) {
    const res = await fetch(`${BASE_URL}/teachers/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Attendance
  async getAttendance(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/attendance${query ? `?${query}` : ''}`);
    return res.json();
  },
  async saveAttendance(data) {
    const res = await fetch(`${BASE_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async getAttendanceSummary() {
    const res = await fetch(`${BASE_URL}/attendance/summary`);
    return res.json();
  },

  // Exam Results
  async getExamResults(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/exams${query ? `?${query}` : ''}`);
    return res.json();
  },
  async getExamResultById(id) {
    const res = await fetch(`${BASE_URL}/exams/${id}`);
    return res.json();
  },
  async createExamResult(data) {
    const res = await fetch(`${BASE_URL}/exams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async deleteExamResult(id) {
    const res = await fetch(`${BASE_URL}/exams/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Fees
  async getFees(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/fees${query ? `?${query}` : ''}`);
    return res.json();
  },
  async getFeeStats() {
    const res = await fetch(`${BASE_URL}/fees/stats`);
    return res.json();
  },
  async createFee(data) {
    const res = await fetch(`${BASE_URL}/fees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async recordPayment(id, data) {
    const res = await fetch(`${BASE_URL}/fees/${id}/pay`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async deleteFee(id) {
    const res = await fetch(`${BASE_URL}/fees/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Timetable
  async getTimetables(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/timetables${query ? `?${query}` : ''}`);
    return res.json();
  },
  async saveTimetable(data) {
    const res = await fetch(`${BASE_URL}/timetables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async deleteTimetable(id) {
    const res = await fetch(`${BASE_URL}/timetables/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },
};

