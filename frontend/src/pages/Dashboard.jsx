import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import MetricCard from '../components/MetricCard';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  PlusCircle,
  TrendingUp,
  School,
  AlertCircle,
} from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      } else {
        setError(res.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <School size={48} className="animate-spin" />
        <h3>Loading ERP System Data...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b91c1c' }}>
          <AlertCircle size={24} />
          <div>
            <h4 style={{ fontWeight: 700 }}>Connection Notice</h4>
            <p style={{ fontSize: '0.85rem' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const { totalStudents, totalTeachers, totalClasses, feeOverview, todayAttendance, recentStudents, recentFees, classDistribution } = stats || {};

  return (
    <div>
      {/* Top Welcome & Quick Actions */}
      <div className="section-header">
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>School Operations Overview</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Real-time management dashboard for St. Augustine International High School
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => onNavigate('students')}>
            <PlusCircle size={16} /> Add Student
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('attendance')}>
            <CalendarCheck size={16} /> Mark Attendance
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('fees')}>
            <CreditCard size={16} /> Record Fee
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="metrics-grid">
        <MetricCard
          title="Total Students"
          value={totalStudents || 0}
          subtext={`${stats?.activeStudents || totalStudents} currently active`}
          icon={GraduationCap}
          color="blue"
        />
        <MetricCard
          title="Faculty Members"
          value={totalTeachers || 0}
          subtext="Across all departments"
          icon={Users}
          color="purple"
        />
        <MetricCard
          title="Today's Attendance"
          value={todayAttendance?.rate || '96%'}
          subtext={`${todayAttendance?.present || 0} Present / ${todayAttendance?.absent || 0} Absent`}
          icon={CalendarCheck}
          color="green"
        />
        <MetricCard
          title="Fee Collection Rate"
          value={feeOverview?.collectionRate || '0%'}
          subtext={`₹${(feeOverview?.totalCollected || 0).toLocaleString()} of ₹${(feeOverview?.totalBilled || 0).toLocaleString()}`}
          icon={CreditCard}
          color="amber"
        />
      </div>

      {/* Two Column Layout: Class Distribution + Recent Admissions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Class Distribution */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Class Enrollment Breakdown</h3>
            <span className="badge-tag badge-blue">{totalClasses || 6} Active Sections</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {classDistribution && classDistribution.length > 0 ? (
              classDistribution.map((item) => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{item._id}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '120px', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, (item.count / 10) * 100)}%`,
                          height: '100%',
                          background: '#2563eb',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', width: '40px', textAlign: 'right' }}>
                      {item.count} std
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No class data recorded yet.</p>
            )}
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Financial Summary</h3>
            <span className="badge-tag badge-green">Fiscal Q3</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>TOTAL INVOICED</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                ₹{(feeOverview?.totalBilled || 0).toLocaleString()}
              </div>
            </div>
            <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#065f46' }}>TOTAL COLLECTED</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                ₹{(feeOverview?.totalCollected || 0).toLocaleString()}
              </div>
            </div>
            <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '8px', border: '1px solid #fde68a', gridColumn: 'span 2' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e' }}>OUTSTANDING DUES / PENDING</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
                ₹{(feeOverview?.totalPending || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Admissions & Recent Payments */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Recent Admissions */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Recent Admissions</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('students')}>
              View All
            </button>
          </div>
          <div className="table-container">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents && recentStudents.length > 0 ? (
                  recentStudents.map((s) => (
                    <tr key={s._id}>
                      <td style={{ fontWeight: 600 }}>{s.rollNumber}</td>
                      <td>{s.name}</td>
                      <td>{s.grade}</td>
                      <td>
                        <span className={`badge-tag ${s.status === 'Active' ? 'badge-green' : 'badge-amber'}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8' }}>
                      No recent admissions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Fees */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Recent Fee Records</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('fees')}>
              View All
            </button>
          </div>
          <div className="table-container">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentFees && recentFees.length > 0 ? (
                  recentFees.map((f) => (
                    <tr key={f._id}>
                      <td style={{ fontWeight: 600 }}>{f.invoiceNumber}</td>
                      <td>{f.studentName}</td>
                      <td>₹{(f.amount - (f.discount || 0)).toLocaleString()}</td>
                      <td>
                        <span
                          className={`badge-tag ${
                            f.paymentStatus === 'Paid'
                              ? 'badge-green'
                              : f.paymentStatus === 'Partial'
                              ? 'badge-amber'
                              : 'badge-red'
                          }`}
                        >
                          {f.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8' }}>
                      No fee records
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

