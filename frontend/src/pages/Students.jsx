import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  GraduationCap,
  Phone,
  Mail,
  UserCheck,
} from 'lucide-react';

const availableGrades = ['Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-Science', 'Grade 12-Science'];

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const initialForm = {
    name: '',
    rollNumber: '',
    grade: 'Grade 10-A',
    dob: '',
    gender: 'Male',
    email: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    address: '',
    bloodGroup: 'O+',
    status: 'Active',
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadStudents();
  }, [search, selectedGrade, selectedStatus]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedGrade !== 'All') params.grade = selectedGrade;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const res = await api.getStudents(params);
      if (res.success) {
        setStudents(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      ...initialForm,
      rollNumber: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setIsEditing(true);
    setCurrentStudent(student);
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber,
      grade: student.grade,
      dob: student.dob ? student.dob.split('T')[0] : '',
      gender: student.gender || 'Male',
      email: student.email || '',
      phone: student.phone || '',
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || '',
      address: student.address || '',
      bloodGroup: student.bloodGroup || 'O+',
      status: student.status || 'Active',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenView = (student) => {
    setCurrentStudent(student);
    setIsViewModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && currentStudent) {
        await api.updateStudent(currentStudent._id, formData);
      } else {
        await api.createStudent(formData);
      }
      setIsAddModalOpen(false);
      loadStudents();
    } catch (err) {
      alert('Error saving student: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete student record for ${name}?`)) {
      try {
        await api.deleteStudent(id);
        loadStudents();
      } catch (err) {
        alert('Failed to delete student');
      }
    }
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <h2>Student Directory</h2>
          <p>Manage pupil enrollments, records, and guardians</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Enroll New Student
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filters-bar">
        <div className="search-input-wrap">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by student name or roll number..."
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
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Students Data Table */}
      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Class / Section</th>
              <th>Gender</th>
              <th>Parent / Guardian</th>
              <th>Contact Phone</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '32px' }}>
                  Loading students...
                </td>
              </tr>
            ) : students.length > 0 ? (
              students.map((student) => (
                <tr key={student._id}>
                  <td style={{ fontWeight: 700, color: '#1e40af' }}>{student.rollNumber}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{student.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{student.email || 'No email registered'}</div>
                  </td>
                  <td>
                    <span className="badge-tag badge-blue">{student.grade}</span>
                  </td>
                  <td>{student.gender}</td>
                  <td>{student.parentName || 'N/A'}</td>
                  <td>{student.phone || student.parentPhone || 'N/A'}</td>
                  <td>
                    <span
                      className={`badge-tag ${
                        student.status === 'Active' ? 'badge-green' : 'badge-amber'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenView(student)}
                        title="View Profile"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEdit(student)}
                        title="Edit Student"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(student._id, student.name)}
                        title="Delete Student"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  <div className="empty-state">
                    <GraduationCap size={40} />
                    <h4>No student records found</h4>
                    <p>Try clearing filters or add a new pupil to the database.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Enroll / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={isEditing ? 'Update Student Record' : 'Enroll New Student'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {isEditing ? 'Save Changes' : 'Complete Enrollment'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Aarav Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Roll Number *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="STU-1001"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Class / Section *</label>
              <select
                className="form-select"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              >
                {availableGrades.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                className="form-input"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                className="form-select"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood Group</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. O+, B+, A+"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Student Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="student@school.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Student Phone</label>
              <input
                type="text"
                className="form-input"
                placeholder="+91 98201 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Parent / Guardian Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Rajesh Sharma"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Parent Phone</label>
              <input
                type="text"
                className="form-input"
                placeholder="+91 98201 99999"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
              />
            </div>
            <div className="form-group full-width">
              <label>Residential Address</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="Enter street, city, postal code"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Enrollment Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Student Profile Card Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Student Permanent Record"
        footer={
          <button className="btn btn-secondary" onClick={() => setIsViewModalOpen(false)}>
            Close
          </button>
        }
      >
        {currentStudent && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#2563eb',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                }}
              >
                {currentStudent.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{currentStudent.name}</h3>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <span className="badge-tag badge-blue">{currentStudent.grade}</span>
                  <span className="badge-tag badge-green">{currentStudent.rollNumber}</span>
                  <span className="badge-tag badge-purple">{currentStudent.bloodGroup || 'O+'}</span>
                </div>
              </div>
            </div>

            <div className="form-grid" style={{ fontSize: '0.9rem' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>GENDER & DOB</span>
                <p style={{ fontWeight: 600, marginTop: '2px' }}>
                  {currentStudent.gender} • {currentStudent.dob ? new Date(currentStudent.dob).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>PARENT / GUARDIAN</span>
                <p style={{ fontWeight: 600, marginTop: '2px' }}>
                  {currentStudent.parentName || 'N/A'} ({currentStudent.parentPhone || 'No Phone'})
                </p>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', gridColumn: 'span 2' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>CONTACT & RESIDENCE</span>
                <p style={{ fontWeight: 600, marginTop: '2px' }}>{currentStudent.email || 'N/A'}</p>
                <p style={{ color: '#475569', fontSize: '0.85rem' }}>{currentStudent.address || 'Address not listed'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

