import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Award,
  CheckCircle,
  XCircle,
  Printer,
} from 'lucide-react';

const examTypes = ['Midterm Examination', 'Final Examination', 'Unit Test 1', 'Unit Test 2'];
const availableGrades = ['Grade 10-A', 'Grade 10-B', 'Grade 9-A', 'Grade 9-B', 'Grade 11-Science', 'Grade 12-Science'];

const defaultSubjects = [
  { name: 'Mathematics', marksObtained: 85, maxMarks: 100 },
  { name: 'Physics', marksObtained: 78, maxMarks: 100 },
  { name: 'Chemistry', marksObtained: 82, maxMarks: 100 },
  { name: 'English Literature', marksObtained: 90, maxMarks: 100 },
  { name: 'Computer Science', marksObtained: 94, maxMarks: 100 },
];

export default function Exams() {
  const [examResults, setExamResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedExamType, setSelectedExamType] = useState('All');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);
  const [activeReportCard, setActiveReportCard] = useState(null);

  // Form
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [formExamType, setFormExamType] = useState('Midterm Examination');
  const [formAcademicYear, setFormAcademicYear] = useState('2025-2026');
  const [formSubjects, setFormSubjects] = useState(defaultSubjects);
  const [formRemarks, setFormRemarks] = useState('Commendable performance');

  useEffect(() => {
    loadExamResults();
    loadStudentsList();
  }, [search, selectedGrade, selectedExamType]);

  const loadExamResults = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedGrade !== 'All') params.grade = selectedGrade;
      if (selectedExamType !== 'All') params.examType = selectedExamType;

      const res = await api.getExamResults(params);
      if (res.success) {
        setExamResults(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentsList = async () => {
    try {
      const res = await api.getStudents();
      if (res.success) {
        setStudents(res.data);
        if (res.data.length > 0 && !selectedStudentId) {
          setSelectedStudentId(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...formSubjects];
    updated[index][field] = Number(value) || 0;
    setFormSubjects(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      alert('Please select a student');
      return;
    }

    try {
      const payload = {
        studentId: selectedStudentId,
        examType: formExamType,
        academicYear: formAcademicYear,
        subjects: formSubjects,
        remarks: formRemarks,
      };

      const res = await api.createExamResult(payload);
      if (res.success) {
        setIsCreateOpen(false);
        loadExamResults();
      }
    } catch (err) {
      alert('Error creating exam result: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete exam record for ${name}?`)) {
      try {
        await api.deleteExamResult(id);
        loadExamResults();
      } catch (err) {
        alert('Failed to delete exam record');
      }
    }
  };

  const handleOpenReportCard = (record) => {
    setActiveReportCard(record);
    setIsReportCardOpen(true);
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <h2>Examination Performance & Results</h2>
          <p>Record term marks, calculate letter grades, and publish digital report cards</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} /> Enter Examination Marks
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrap">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by student or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="select-filter"
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
        >
          <option value="All">All Grades & Sections</option>
          {availableGrades.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <select
          className="select-filter"
          value={selectedExamType}
          onChange={(e) => setSelectedExamType(e.target.value)}
        >
          <option value="All">All Exam Types</option>
          {examTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Results Table */}
      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Exam Type</th>
              <th>Score / Max</th>
              <th>Percentage</th>
              <th>Overall Grade</th>
              <th>Outcome</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '32px' }}>
                  Loading examination entries...
                </td>
              </tr>
            ) : examResults.length > 0 ? (
              examResults.map((r) => (
                <tr key={r._id}>
                  <td style={{ fontWeight: 700, color: '#1e40af' }}>{r.rollNumber}</td>
                  <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                  <td>
                    <span className="badge-tag badge-blue">{r.grade}</span>
                  </td>
                  <td>{r.examType}</td>
                  <td style={{ fontWeight: 600 }}>
                    {r.totalMarks} / {r.maxTotalMarks}
                  </td>
                  <td>
                    <span style={{ fontWeight: 800 }}>{r.percentage}%</span>
                  </td>
                  <td>
                    <span
                      className={`badge-tag ${
                        ['A+', 'A'].includes(r.overallGrade)
                          ? 'badge-green'
                          : ['B', 'C'].includes(r.overallGrade)
                          ? 'badge-amber'
                          : 'badge-red'
                      }`}
                    >
                      {r.overallGrade}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge-tag ${
                        r.status === 'Passed' ? 'badge-green' : 'badge-red'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenReportCard(r)}
                        title="View Official Report Card"
                      >
                        <Eye size={14} /> Report Card
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(r._id, r.studentName)}
                        title="Delete Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">
                  <div className="empty-state">
                    <FileSpreadsheet size={40} />
                    <h4>No examination records found</h4>
                    <p>Enter marks for students to generate academic report cards.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Enter Examination Marks Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Record Examination Marks"
        maxWidth="650px"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Compute & Publish Result
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ marginBottom: '16px' }}>
            <div className="form-group full-width">
              <label>Select Student *</label>
              <select
                className="form-select"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.rollNumber} - {s.grade})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Exam Type *</label>
              <select
                className="form-select"
                value={formExamType}
                onChange={(e) => setFormExamType(e.target.value)}
              >
                {examTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Academic Year</label>
              <input
                type="text"
                className="form-input"
                value={formAcademicYear}
                onChange={(e) => setFormAcademicYear(e.target.value)}
              />
            </div>
          </div>

          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
            Subject Marks Breakdown
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {formSubjects.map((sub, idx) => (
              <div
                key={sub.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr',
                  gap: '12px',
                  alignItems: 'center',
                  background: '#f8fafc',
                  padding: '8px 12px',
                  borderRadius: '6px',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{sub.name}</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-input"
                  placeholder="Obtained"
                  value={sub.marksObtained}
                  onChange={(e) => handleSubjectChange(idx, 'marksObtained', e.target.value)}
                />
                <input
                  type="number"
                  className="form-input"
                  placeholder="Max"
                  value={sub.maxMarks}
                  disabled
                  style={{ background: '#e2e8f0' }}
                />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Instructor Remarks</label>
            <input
              type="text"
              className="form-input"
              value={formRemarks}
              onChange={(e) => setFormRemarks(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* Official Student Report Card Modal */}
      <Modal
        isOpen={isReportCardOpen}
        onClose={() => setIsReportCardOpen(false)}
        title="Official Academic Report Card"
        maxWidth="720px"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => window.print()}>
              <Printer size={16} /> Print Report Card
            </button>
            <button className="btn btn-primary" onClick={() => setIsReportCardOpen(false)}>
              Close
            </button>
          </>
        }
      >
        {activeReportCard && (
          <div>
            <div className="report-card-banner">
              <div className="report-header-title">ST. AUGUSTINE INTERNATIONAL SCHOOL</div>
              <div className="report-sub">Affiliated to Central Board of Secondary Education</div>
              <div style={{ marginTop: '8px', fontSize: '1rem', fontWeight: 700, color: '#fef08a' }}>
                {activeReportCard.examType.toUpperCase()} - {activeReportCard.academicYear}
              </div>
            </div>

            <div className="report-student-meta">
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>STUDENT NAME</span>
                <div style={{ fontWeight: 700 }}>{activeReportCard.studentName}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>ROLL NUMBER</span>
                <div style={{ fontWeight: 700, color: '#1e40af' }}>{activeReportCard.rollNumber}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>CLASS & SECTION</span>
                <div style={{ fontWeight: 700 }}>{activeReportCard.grade}</div>
              </div>
            </div>

            <div className="table-container" style={{ marginBottom: '20px' }}>
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Subject Course</th>
                    <th>Max Marks</th>
                    <th>Marks Scored</th>
                    <th>Grade Point</th>
                  </tr>
                </thead>
                <tbody>
                  {activeReportCard.subjects.map((sub, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{sub.name}</td>
                      <td>{sub.maxMarks}</td>
                      <td style={{ fontWeight: 700 }}>{sub.marksObtained}</td>
                      <td>
                        <span
                          className={`badge-tag ${
                            ['A+', 'A'].includes(sub.gradePoint)
                              ? 'badge-green'
                              : 'badge-amber'
                          }`}
                        >
                          {sub.gradePoint}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: '#f8fafc', fontWeight: 800 }}>
                    <td>Aggregate Cumulative</td>
                    <td>{activeReportCard.maxTotalMarks}</td>
                    <td style={{ color: '#2563eb' }}>{activeReportCard.totalMarks}</td>
                    <td>{activeReportCard.percentage}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f1f5f9',
                padding: '16px',
                borderRadius: '8px',
              }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>TEACHER REMARKS</div>
                <div style={{ fontWeight: 700, fontStyle: 'italic', marginTop: '2px' }}>
                  "{activeReportCard.remarks || 'Keep working hard'}"
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span className="badge-tag badge-purple" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                  Grade: {activeReportCard.overallGrade}
                </span>
                <span
                  className={`badge-tag ${
                    activeReportCard.status === 'Passed' ? 'badge-green' : 'badge-red'
                  }`}
                  style={{ fontSize: '0.9rem', padding: '6px 14px' }}
                >
                  {activeReportCard.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

