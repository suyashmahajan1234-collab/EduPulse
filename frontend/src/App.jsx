import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Attendance from './pages/Attendance';
import Exams from './pages/Exams';
import Fees from './pages/Fees';
import Timetable from './pages/Timetable';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'students':
        return <Students />;
      case 'teachers':
        return <Teachers />;
      case 'attendance':
        return <Attendance />;
      case 'exams':
        return <Exams />;
      case 'fees':
        return <Fees />;
      case 'timetable':
        return <Timetable />;
      default:
        return <Dashboard onNavigate={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />
      <div className="main-wrapper">
        <Navbar currentTab={currentTab} />
        <main className="content-area">{renderContent()}</main>
      </div>
    </div>
  );
}

