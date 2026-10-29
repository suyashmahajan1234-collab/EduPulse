import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarCheck2,
  FileSpreadsheet,
  Receipt,
  CalendarDays,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Student Directory', icon: GraduationCap },
  { id: 'teachers', label: 'Faculty Management', icon: Users },
  { id: 'attendance', label: 'Attendance Tracking', icon: CalendarCheck2 },
  { id: 'exams', label: 'Examination & Results', icon: FileSpreadsheet },
  { id: 'fees', label: 'Fee Management', icon: Receipt },
  { id: 'timetable', label: 'Timetable Scheduling', icon: CalendarDays },
];

export default function Sidebar({ currentTab, onSelectTab }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <GraduationCap size={24} />
        </div>
        <div className="brand-text">
          <h1>EduPulse ERP</h1>
          <span>Centralized School OS</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-avatar">SA</div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>Super Admin</div>
          <div style={{ color: '#64748b', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={12} color="#10b981" /> Verified Session
          </div>
        </div>
      </div>
    </aside>
  );
}

