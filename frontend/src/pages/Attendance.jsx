import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  CalendarCheck2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  CheckCheck,
  AlertCircle,
} from 'lucide-react';

const availableGrades = ['Grade 10-A', 'Grade 10-B', 'Grade 9-A', 'Grade 9-B', 'Grade 11-Science', 'Grade 12-Science'];

export default function Attendance() {
  const [selectedGrade, setSelectedGrade] = useState('Grade 10-A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadAttendance();
  }, [selectedGrade, selectedDate]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setSaveSuccess(false);
      const res = await api.getAttendance({ grade: selectedGrade, date: selectedDate });
      if (res.success) {
        setAttendanceData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (index, newStatus) => {
    if (!attendanceData || !attendanceData.records) return;
    const updatedRecords = [...attendanceData.records];
    updatedRecords[index].status = newStatus;

    // Recalculate counts
    const presentCount = updatedRecords.filter((r) => r.status === 'Present').length;
    const absentCount = updatedRecords.filter((r) => r.status === 'Absent').length;
    const lateCount = updatedRecords.filter((r) => r.status === 'Late').length;

    setAttendanceData({
      ...attendanceData,
      records: updatedRecords,
      presentCount,
      absentCount,
      lateCount,
    });
  };

  const handleRemarkChange = (index, remarks) => {
    if (!attendanceData || !attendanceData.records) return;
    const updatedRecords = [...attendanceData.records];
    updatedRecords[index].remarks = remarks;
    setAttendanceData({ ...attendanceData, records: updatedRecords });
  };

  const handleMarkAll = (status) => {
    if (!attendanceData || !attendanceData.records) return;
    const updatedRecords = attendanceData.records.map((r) => ({ ...r, status }));
    const presentCount = status === 'Present' ? updatedRecords.length : 0;
    const absentCount = status === 'Absent' ? updatedRecords.length : 0;
    const lateCount = status === 'Late' ? updatedRecords.length : 0;

    setAttendanceData({
      ...attendanceData,
      records: updatedRecords,
      presentCount,
      absentCount,
      lateCount,
    });
  };

  const handleSave = async () => {
    if (!attendanceData) return;
    try {
      setSaving(true);
      const payload = {
        date: selectedDate,
        grade: selectedGrade,
        records: attendanceData.records,
      };
      const res = await api.saveAttendance(payload);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      alert('Error saving attendance: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const records = attendanceData?.records || [];
  const total = records.length;
  const present = attendanceData?.presentCount ?? records.filter((r) => r.status === 'Present').length;
  const absent = attendanceData?.absentCount ?? records.filter((r) => r.status === 'Absent').length;
  const late = attendanceData?.lateCount ?? records.filter((r) => r.status === 'Late').length;
  const rate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <h2>Daily Attendance Tracker</h2>
          <p>Mark, record, and audit student presence across academic classes</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => handleMarkAll('Present')}>
            <CheckCheck size={16} /> Mark All Present
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || total === 0}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div
          className="card"
          style={{
            backgroundColor: '#ecfdf5',
            borderColor: '#a7f3d0',
            marginBottom: '20px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#065f46',
          }}
        >
          <CheckCircle2 size={20} />
          <span style={{ fontWeight: 600 }}>Attendance saved successfully to MongoDB!</span>
        </div>
      )}

      {/* Date & Class Selector Bar */}
      <div className="filters-bar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="#64748b" />
            <input
              type="date"
              className="form-input"
              style={{ width: 'auto' }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            {availableGrades.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Live Attendance Stats */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span className="badge-tag badge-blue">Total: {total}</span>
          <span className="badge-tag badge-green">Present: {present}</span>
          <span className="badge-tag badge-red">Absent: {absent}</span>
          <span className="badge-tag badge-amber">Late: {late}</span>
          <span className="badge-tag badge-purple" style={{ fontWeight: 700 }}>Rate: {rate}%</span>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th style={{ width: '380px' }}>Attendance Status</th>
              <th>Teacher Notes / Reason</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>
                  Loading attendance roster...
                </td>
              </tr>
            ) : records.length > 0 ? (
              records.map((rec, idx) => (
                <tr key={rec.student || idx}>
                  <td style={{ color: '#94a3b8', fontWeight: 600 }}>{idx + 1}</td>
                  <td style={{ fontWeight: 700, color: '#1e40af' }}>{rec.rollNumber}</td>
                  <td style={{ fontWeight: 600 }}>{rec.studentName}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['Present', 'Absent', 'Late', 'Excused'].map((st) => {
                        const isSelected = rec.status === st;
                        let btnStyle = {
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#fff',
                          color: '#475569',
                          transition: 'all 0.15s ease',
                        };

                        if (isSelected) {
                          if (st === 'Present') {
                            btnStyle = { ...btnStyle, backgroundColor: '#10b981', color: '#fff', borderColor: '#10b981' };
                          } else if (st === 'Absent') {
                            btnStyle = { ...btnStyle, backgroundColor: '#ef4444', color: '#fff', borderColor: '#ef4444' };
                          } else if (st === 'Late') {
                            btnStyle = { ...btnStyle, backgroundColor: '#f59e0b', color: '#fff', borderColor: '#f59e0b' };
                          } else if (st === 'Excused') {
                            btnStyle = { ...btnStyle, backgroundColor: '#6366f1', color: '#fff', borderColor: '#6366f1' };
                          }
                        }

                        return (
                          <button
                            key={st}
                            type="button"
                            style={btnStyle}
                            onClick={() => handleStatusChange(idx, st)}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Parent informed, sickness"
                      value={rec.remarks || ''}
                      onChange={(e) => handleRemarkChange(idx, e.target.value)}
                      style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <CalendarCheck2 size={40} />
                    <h4>No active students enrolled in {selectedGrade}</h4>
                    <p>Enroll students in this class section first from the Student Directory.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

