import React from 'react';
import { Bell, Search, Sparkles } from 'lucide-react';

const titleMap = {
  dashboard: 'Executive Dashboard & School Overview',
  students: 'Student Information System (SIS)',
  teachers: 'Teacher & Staff Management',
  attendance: 'Daily Attendance Tracker',
  exams: 'Examination Performance & Report Cards',
  fees: 'Fee Invoicing & Revenue Management',
  timetable: 'Master Academic Timetable',
};

export default function Navbar({ currentTab }) {
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="topbar">
      <div className="topbar-title">
        <span>{titleMap[currentTab] || 'School Management ERP'}</span>
      </div>

      <div className="topbar-actions">
        <span className="badge-tag badge-green">
          <span className="status-indicator indicator-green"></span>
          Academic Year 2025-2026
        </span>
        <span className="badge-tag badge-blue">{todayStr}</span>
        <button
          className="btn btn-secondary btn-sm"
          title="Notifications"
          style={{ padding: '8px', borderRadius: '50%' }}
        >
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}

