import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  User,
  Trash2,
  Edit,
  CheckCircle2,
} from 'lucide-react';

const availableGrades = ['Grade 10-A', 'Grade 10-B', 'Grade 9-A', 'Grade 9-B', 'Grade 11-Science', 'Grade 12-Science'];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const subjectColors = {
  Mathematics: '#2563eb',
  Physics: '#7c3aed',
  Chemistry: '#059669',
  Biology: '#10b981',
  'English Literature': '#d97706',
  'Computer Science': '#0284c7',
  'Physical Education & Library': '#ea580c',
};

export default function Timetable() {
  const [selectedGrade, setSelectedGrade] = useState('Grade 10-A');
  const [timetables, setTimetables] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [periodForm, setPeriodForm] = useState({
    periodNumber: 1,
    startTime: '08:30 AM',
    endTime: '09:15 AM',
    subject: 'Mathematics',
    teacherName: 'Dr. Vikramaditya Kulkarni',
    roomNumber: 'Room 201',
  });

  useEffect(() => {
    loadTimetable();
    loadTeachers();
  }, [selectedGrade]);

  const loadTimetable = async () => {
    try {
      setLoading(true);
      const res = await api.getTimetables({ grade: selectedGrade });
      if (res.success) {
        setTimetables(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTeachers = async () => {
    try {
      const res = await api.getTeachers();
      if (res.success && res.data.length > 0) {
        setTeachers(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAdd = (day) => {
    setSelectedDay(day);
    const daySchedule = timetables.find((t) => t.dayOfWeek === day);
    const nextPeriodNum = daySchedule ? daySchedule.periods.length + 1 : 1;

    setPeriodForm({
      periodNumber: nextPeriodNum,
      startTime: '09:00 AM',
      endTime: '09:45 AM',
      subject: 'Mathematics',
      teacherName: teachers.length > 0 ? teachers[0].name : 'Assigned Faculty',
      roomNumber: 'Room 101',
    });
    setIsModalOpen(true);
  };

  const handleSavePeriod = async (e) => {
    e.preventDefault();
    try {
      const daySchedule = timetables.find((t) => t.dayOfWeek === selectedDay);
      const existingPeriods = daySchedule ? [...daySchedule.periods] : [];

      existingPeriods.push({
        periodNumber: Number(periodForm.periodNumber),
        startTime: periodForm.startTime,
        endTime: periodForm.endTime,
        subject: periodForm.subject,
        teacherName: periodForm.teacherName,
        roomNumber: periodForm.roomNumber,
      });

      // Sort by period number
      existingPeriods.sort((a, b) => a.periodNumber - b.periodNumber);

      const res = await api.saveTimetable({
        grade: selectedGrade,
        dayOfWeek: selectedDay,
        periods: existingPeriods,
      });

      if (res.success) {
        setIsModalOpen(false);
        loadTimetable();
      }
    } catch (err) {
      alert('Error saving period: ' + err.message);
    }
  };

  const handleDeletePeriod = async (day, periodIdx) => {
    try {
      const daySchedule = timetables.find((t) => t.dayOfWeek === day);
      if (!daySchedule) return;

      const updated = daySchedule.periods.filter((_, idx) => idx !== periodIdx);

      await api.saveTimetable({
        grade: selectedGrade,
        dayOfWeek: day,
        periods: updated,
      });

      loadTimetable();
    } catch (err) {
      alert('Failed to remove period');
    }
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <h2>Master Academic Timetable</h2>
          <p>Schedule lecture slots, classroom assignments, and faculty rotation</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
      </div>

      {/* Timetable Weekly Columns */}
      <div className="timetable-grid">
        {daysOfWeek.map((day) => {
          const dayData = timetables.find((t) => t.dayOfWeek === day);
          const periods = dayData ? dayData.periods : [];

          return (
            <div key={day} className="day-column">
              <div className="day-header">
                <span>{day}</span>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '2px 8px', fontSize: '0.75rem', color: '#fff', borderColor: '#334155', background: '#1e293b' }}
                  onClick={() => handleOpenAdd(day)}
                  title={`Add period for ${day}`}
                >
                  <Plus size={12} /> Add
                </button>
              </div>

              <div className="period-list">
                {periods.length > 0 ? (
                  periods.map((period, idx) => {
                    const borderColor = subjectColors[period.subject] || '#2563eb';
                    return (
                      <div
                        key={idx}
                        className="period-card"
                        style={{ borderLeftColor: borderColor }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="time">
                            <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            {period.startTime} - {period.endTime}
                          </span>
                          <button
                            onClick={() => handleDeletePeriod(day, idx)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#94a3b8',
                            }}
                            title="Remove period"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <div className="subject">{period.subject}</div>
                        <div className="teacher">
                          <span>
                            <User size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            {period.teacherName}
                          </span>
                          <span>
                            <MapPin size={12} style={{ display: 'inline', marginRight: '2px' }} />
                            {period.roomNumber}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 12px', color: '#94a3b8', fontSize: '0.85rem' }}>
                    No periods scheduled
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Period Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Add Class Period for ${selectedDay}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSavePeriod}>
              Schedule Slot
            </button>
          </>
        }
      >
        <form onSubmit={handleSavePeriod}>
          <div className="form-grid">
            <div className="form-group">
              <label>Period Number</label>
              <input
                type="number"
                min="1"
                max="10"
                required
                className="form-input"
                value={periodForm.periodNumber}
                onChange={(e) => setPeriodForm({ ...periodForm, periodNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Subject *</label>
              <select
                className="form-select"
                value={periodForm.subject}
                onChange={(e) => setPeriodForm({ ...periodForm, subject: e.target.value })}
              >
                {Object.keys(subjectColors).map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Start Time *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="09:00 AM"
                value={periodForm.startTime}
                onChange={(e) => setPeriodForm({ ...periodForm, startTime: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>End Time *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="09:45 AM"
                value={periodForm.endTime}
                onChange={(e) => setPeriodForm({ ...periodForm, endTime: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Instructor / Faculty *</label>
              <select
                className="form-select"
                value={periodForm.teacherName}
                onChange={(e) => setPeriodForm({ ...periodForm, teacherName: e.target.value })}
              >
                {teachers.map((t) => (
                  <option key={t._id} value={t.name}>
                    {t.name} ({t.subjectSpecialization})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Classroom / Laboratory</label>
              <input
                type="text"
                className="form-input"
                placeholder="Room 101 or Lab 2"
                value={periodForm.roomNumber}
                onChange={(e) => setPeriodForm({ ...periodForm, roomNumber: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

