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
  Users,
  Award,
  BookOpen,
} from 'lucide-react';

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English Literature',
  'Computer Science',
  'History',
  'Physical Education',
];

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);

  const initialForm = {
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    subjectSpecialization: 'Mathematics',
    qualification: 'M.Sc., B.Ed.',
    assignedClasses: 'Grade 10-A, Grade 10-B',
    salary: 55000,
    status: 'Active',
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadTeachers();
  }, [search, selectedSubject, selectedStatus]);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedSubject !== 'All') params.subject = selectedSubject;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const res = await api.getTeachers(params);
      if (res.success) {
        setTeachers(res.data);
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
      employeeId: `TCH-00${Math.floor(10 + Math.random() * 90)}`,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (teacher) => {
    setIsEditing(true);
    setCurrentTeacher(teacher);
    setFormData({
      name: teacher.name,
      employeeId: teacher.employeeId,
      email: teacher.email,
      phone: teacher.phone || '',
      subjectSpecialization: teacher.subjectSpecialization,
      qualification: teacher.qualification || '',
      assignedClasses: Array.isArray(teacher.assignedClasses) ? teacher.assignedClasses.join(', ') : '',
      salary: teacher.salary || 50000,
      status: teacher.status || 'Active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        assignedClasses: formData.assignedClasses
          ? formData.assignedClasses.split(',').map((c) => c.trim()).filter(Boolean)
          : [],
      };

      if (isEditing && currentTeacher) {
        await api.updateTeacher(currentTeacher._id, payload);
      } else {
        await api.createTeacher(payload);
      }

      setIsModalOpen(false);
      loadTeachers();
    } catch (err) {
      alert('Error saving faculty member: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from faculty?`)) {
      try {
        await api.deleteTeacher(id);
        loadTeachers();
      } catch (err) {
        alert('Failed to delete teacher record');
      }
    }
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <h2>Faculty & Teacher Management</h2>
          <p>Oversee academic instructors, departments, and class workloads</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Appoint Faculty Member
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrap">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by faculty name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="select-filter"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="All">All Subject Departments</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className="select-filter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Resigned">Resigned</option>
        </select>
      </div>

      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>Faculty ID</th>
              <th>Teacher Name</th>
              <th>Subject Department</th>
              <th>Academic Qualification</th>
              <th>Assigned Classes</th>
              <th>Contact Details</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '32px' }}>
                  Loading faculty records...
                </td>
              </tr>
            ) : teachers.length > 0 ? (
              teachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td style={{ fontWeight: 700, color: '#4338ca' }}>{teacher.employeeId}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{teacher.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{teacher.email}</div>
                  </td>
                  <td>
                    <span className="badge-tag badge-purple">{teacher.subjectSpecialization}</span>
                  </td>
                  <td>{teacher.qualification || 'B.Ed.'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
                        teacher.assignedClasses.map((cls, idx) => (
                          <span key={idx} className="badge-tag badge-blue" style={{ fontSize: '0.7rem' }}>
                            {cls}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#94a3b8' }}>None</span>
                      )}
                    </div>
                  </td>
                  <td>{teacher.phone || 'No phone'}</td>
                  <td>
                    <span
                      className={`badge-tag ${
                        teacher.status === 'Active' ? 'badge-green' : 'badge-amber'
                      }`}
                    >
                      {teacher.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEdit(teacher)}
                        title="Edit Teacher"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(teacher._id, teacher.name)}
                        title="Remove Teacher"
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
                    <Users size={40} />
                    <h4>No faculty records found</h4>
                    <p>Add instructors or adjust search parameters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Faculty Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Update Faculty Information' : 'Appoint New Faculty Member'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {isEditing ? 'Save Changes' : 'Confirm Appointment'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Faculty Full Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Dr. Shalini Roy"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Employee ID *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Subject Specialization *</label>
              <select
                className="form-select"
                value={formData.subjectSpecialization}
                onChange={(e) => setFormData({ ...formData, subjectSpecialization: e.target.value })}
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Qualification</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ph.D. in Physics, B.Ed."
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="faculty@school.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="+91 98111 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group full-width">
              <label>Assigned Classes (Comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Grade 10-A, Grade 10-B, Grade 12-Science"
                value={formData.assignedClasses}
                onChange={(e) => setFormData({ ...formData, assignedClasses: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Employment Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Resigned">Resigned</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

