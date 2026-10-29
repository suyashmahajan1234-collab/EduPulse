# EduPulse ERP - School Management System (MERN Stack)

A comprehensive, enterprise-grade web-based School Management ERP System built with **MongoDB, Express.js, React.js, and Node.js**.

---

## 🌟 Key Modules & Features

1. **Executive Overview Dashboard**
   - Live KPI cards: Total Students, Faculty Members, Today's Attendance %, and Fee Collection Rate.
   - Quick action shortcuts (enroll student, mark attendance, record fee payment).
   - Visual class enrollment breakdown and recent admissions feed.

2. **Student Management (SIS)**
   - Complete pupil lifecycle management (enrollment, editing, records, profile card modal).
   - Search by name or roll number; filter by grade and status.
   - Tracks roll number, parent details, blood group, contact info, and status (Active, Inactive, Suspended).

3. **Faculty & Teacher Management**
   - Instructor roster, employee IDs, department specialization (Math, Physics, CS, Chemistry, Biology, etc.).
   - Workload assignment (assigned classes and sections).
   - Contact details, salary, and employment status.

4. **Daily Attendance Tracking**
   - Class and date selector with live status calculation (Present, Absent, Late, Excused).
   - One-click bulk action (*Mark All Present*) and per-student remarks.
   - Persisted daily attendance records and aggregate percentage rates.

5. **Examination & Report Cards**
   - Multi-term examinations (Unit Tests, Midterms, Final Exams).
   - Automated computation of total marks, maximum possible, percentage, and letter grades (`A+` down to `F`).
   - Official School Report Card generation view with printable layout and remarks.

6. **Fee Management & Invoicing**
   - Tuition, laboratory, transport, and sports fee billing.
   - Invoicing lifecycle: `Pending` -> `Partial` -> `Paid` / `Overdue`.
   - Payment recording with real-time balance calculations, multiple payment modes (UPI, Card, Cash, Cheque), and official printable tax receipts.

7. **Master Academic Timetable**
   - Interactive weekly matrix schedule (Monday through Friday).
   - Period scheduling with start/end times, assigned teacher, and classroom location.
   - Dynamic period creation and deletion per grade.

---

## 🏗️ Architecture & Tech Stack

```
school-management-erp/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # MongoDB connection handler
│   │   ├── models/               # Mongoose schemas (Student, Teacher, Attendance, ExamResult, Fee, Timetable)
│   │   ├── controllers/          # Business logic for all modules
│   │   ├── routes/               # RESTful API routing
│   │   ├── seeds/seedData.js     # Realistic demo dataset seeder
│   │   ├── tests/api.test.js     # Automated test suite using Node.js test runner & Supertest
│   │   └── server.js             # Express application entrypoint
│   ├── data/db/                  # Local MongoDB storage
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/           # Sidebar, Navbar, MetricCard, Modal
│   │   ├── pages/                # Dashboard, Students, Teachers, Attendance, Exams, Fees, Timetable
│   │   ├── services/api.js       # Centralized API client
│   │   ├── App.jsx
│   │   ├── index.css             # Modern ERP design system
│   │   └── main.jsx
│   ├── vite.config.js            # Vite build setup with reverse proxy to backend
│   └── package.json
├── start.sh                      # One-click start script
├── test-all.sh                   # Comprehensive test runner
└── README.md
```

---

## 🚀 Running the Application

### Option A: Using the all-in-one launcher
```bash
cd /Users/suyashanilmahajan/.gemini/antigravity/scratch/school-management-erp
./start.sh
```

### Option B: Running individually
1. **Start MongoDB**:
   ```bash
   mongod --dbpath backend/data/db --port 27017 --fork --logpath backend/data/mongod.log
   ```

2. **Start Backend Server**:
   ```bash
   cd backend
   npm start
   # Server listens on http://localhost:5001
   ```

3. **Start Frontend Dev Server**:
   ```bash
   cd frontend
   npm run dev
   # App opens on http://localhost:3000
   ```

---

## 🧪 Running Tests & Seeding Data

- **Run Automated Backend API Tests**:
  ```bash
  cd backend && npm test
  ```
- **Re-seed Initial School Records**:
  ```bash
  cd backend && npm run seed
  ```
- **Verify Frontend Production Build**:
  ```bash
  cd frontend && npm run build
  ```
- **Run All Verification Suites**:
  ```bash
  ./test-all.sh
  ```

---

## 📡 API Reference Overview

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Health** | `GET` | `/api/health` | Service uptime and status check |
| **Dashboard** | `GET` | `/api/dashboard/stats` | Aggregated executive KPIs |
| **Students** | `GET`, `POST` | `/api/students` | List (with search/filter) & enroll student |
| **Students** | `GET`, `PUT`, `DELETE` | `/api/students/:id` | View, update, or remove student |
| **Teachers** | `GET`, `POST` | `/api/teachers` | List & appoint faculty member |
| **Teachers** | `GET`, `PUT`, `DELETE` | `/api/teachers/:id` | View, update, or remove faculty |
| **Attendance** | `GET`, `POST` | `/api/attendance` | Retrieve roster & persist daily attendance |
| **Exams** | `GET`, `POST` | `/api/exams` | Query results & calculate report cards |
| **Exams** | `GET`, `DELETE` | `/api/exams/:id` | Retrieve report card or delete exam record |
| **Fees** | `GET`, `POST` | `/api/fees` | Query fee invoices & generate new invoice |
| **Fees** | `GET` | `/api/fees/stats` | Invoicing metrics (billed, collected, pending) |
| **Fees** | `PUT` | `/api/fees/:id/pay` | Record fee payment & update balance |
| **Timetable** | `GET`, `POST` | `/api/timetables` | View weekly grid & update period slots |

