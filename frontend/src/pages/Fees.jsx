import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import MetricCard from '../components/MetricCard';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Trash2,
} from 'lucide-react';

const feeTypes = [
  'Tuition Fee',
  'Laboratory Fee',
  'Transport Fee',
  'Annual Sports & Activity Fee',
];
const paymentMethods = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Cheque'];

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  // Form states
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: '',
    feeType: 'Tuition Fee',
    amount: 25000,
    discount: 0,
    dueDate: '',
    remarks: '',
  });

  const [paymentForm, setPaymentForm] = useState({
    paymentAmount: '',
    paymentMethod: 'UPI',
    transactionRef: '',
  });

  useEffect(() => {
    loadFees();
    loadStats();
    loadStudents();
  }, [search, selectedStatus]);

  const loadFees = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedStatus !== 'All') params.paymentStatus = selectedStatus;

      const res = await api.getFees(params);
      if (res.success) {
        setFees(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.getFeeStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await api.getStudents();
      if (res.success && res.data.length > 0) {
        setStudents(res.data);
        setInvoiceForm((prev) => ({ ...prev, studentId: res.data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createFee(invoiceForm);
      if (res.success) {
        setIsInvoiceModalOpen(false);
        loadFees();
        loadStats();
      }
    } catch (err) {
      alert('Error creating invoice: ' + err.message);
    }
  };

  const handleOpenPay = (fee) => {
    setSelectedFee(fee);
    setPaymentForm({
      paymentAmount: fee.balanceAmount,
      paymentMethod: 'UPI',
      transactionRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    });
    setIsPayModalOpen(true);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedFee) return;
    try {
      const res = await api.recordPayment(selectedFee._id, paymentForm);
      if (res.success) {
        setIsPayModalOpen(false);
        loadFees();
        loadStats();
      }
    } catch (err) {
      alert('Error processing payment: ' + err.message);
    }
  };

  const handleDelete = async (id, inv) => {
    if (window.confirm(`Delete fee invoice ${inv}?`)) {
      try {
        await api.deleteFee(id);
        loadFees();
        loadStats();
      } catch (err) {
        alert('Failed to delete invoice');
      }
    }
  };

  const handleOpenReceipt = (fee) => {
    setSelectedFee(fee);
    setIsReceiptModalOpen(true);
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <h2>Fee Management & Invoicing</h2>
          <p>Collect tuition, track student dues, issue invoices, and manage school finances</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsInvoiceModalOpen(true)}>
          <Plus size={16} /> Generate Fee Invoice
        </button>
      </div>

      {/* KPI Stats */}
      <div className="metrics-grid">
        <MetricCard
          title="Total Invoiced"
          value={`₹${(stats?.totalBilled || 0).toLocaleString()}`}
          subtext={`${stats?.totalInvoices || 0} bills issued`}
          icon={Receipt}
          color="blue"
        />
        <MetricCard
          title="Total Collected"
          value={`₹${(stats?.totalCollected || 0).toLocaleString()}`}
          subtext={`Rate: ${stats?.collectionRate || '0%'}`}
          icon={CheckCircle2}
          color="green"
        />
        <MetricCard
          title="Pending Receivables"
          value={`₹${(stats?.totalPending || 0).toLocaleString()}`}
          subtext={`${stats?.pendingCount || 0} unpaid invoices`}
          icon={Clock}
          color="amber"
        />
        <MetricCard
          title="Overdue Notices"
          value={stats?.overdueCount || 0}
          subtext="Requires follow-up"
          icon={AlertTriangle}
          color="purple"
        />
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="search-input-wrap">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by student name or invoice number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="select-filter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">All Invoicing Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {/* Fees Invoices Table */}
      <div className="table-container">
        <table className="erp-table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Fee Category</th>
              <th>Total Billed</th>
              <th>Paid Amount</th>
              <th>Balance Due</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '32px' }}>
                  Loading fee records...
                </td>
              </tr>
            ) : fees.length > 0 ? (
              fees.map((fee) => (
                <tr key={fee._id}>
                  <td style={{ fontWeight: 700, color: '#1e40af' }}>{fee.invoiceNumber}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{fee.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{fee.rollNumber}</div>
                  </td>
                  <td>
                    <span className="badge-tag badge-blue">{fee.grade}</span>
                  </td>
                  <td>{fee.feeType}</td>
                  <td style={{ fontWeight: 600 }}>
                    ₹{(fee.amount - (fee.discount || 0)).toLocaleString()}
                  </td>
                  <td style={{ color: '#059669', fontWeight: 600 }}>
                    ₹{(fee.paidAmount || 0).toLocaleString()}
                  </td>
                  <td style={{ color: fee.balanceAmount > 0 ? '#dc2626' : '#64748b', fontWeight: 700 }}>
                    ₹{fee.balanceAmount.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`badge-tag ${
                        fee.paymentStatus === 'Paid'
                          ? 'badge-green'
                          : fee.paymentStatus === 'Partial'
                          ? 'badge-amber'
                          : 'badge-red'
                      }`}
                    >
                      {fee.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      {fee.balanceAmount > 0 && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleOpenPay(fee)}
                          title="Record Payment"
                        >
                          <CreditCard size={14} /> Pay
                        </button>
                      )}
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenReceipt(fee)}
                        title="View Receipt"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(fee._id, fee.invoiceNumber)}
                        title="Delete Invoice"
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
                    <Receipt size={40} />
                    <h4>No fee invoices found</h4>
                    <p>Issue an invoice to start tracking tuition fees.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Generate New Fee Invoice"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsInvoiceModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateInvoice}>
              Generate Invoice
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateInvoice}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Select Student *</label>
              <select
                className="form-select"
                value={invoiceForm.studentId}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
              >
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.rollNumber} - {s.grade})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Fee Category *</label>
              <select
                className="form-select"
                value={invoiceForm.feeType}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, feeType: e.target.value })}
              >
                {feeTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input
                type="number"
                min="0"
                required
                className="form-input"
                value={invoiceForm.amount}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Scholarship / Discount (₹)</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={invoiceForm.discount}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, discount: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Payment Due Date</label>
              <input
                type="date"
                className="form-input"
                value={invoiceForm.dueDate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
              />
            </div>
            <div className="form-group full-width">
              <label>Invoice Description / Remarks</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Term 1 Tuition Fee with Lab Access"
                value={invoiceForm.remarks}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, remarks: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Record Fee Payment"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsPayModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleRecordPayment}>
              Confirm & Post Payment
            </button>
          </>
        }
      >
        {selectedFee && (
          <form onSubmit={handleRecordPayment}>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Student:</span>
                <span style={{ fontWeight: 700 }}>{selectedFee.studentName} ({selectedFee.rollNumber})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Invoice:</span>
                <span style={{ fontWeight: 600 }}>{selectedFee.invoiceNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Outstanding Balance:</span>
                <span style={{ fontWeight: 800, color: '#dc2626' }}>₹{selectedFee.balanceAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Amount to Pay (₹) *</label>
                <input
                  type="number"
                  min="1"
                  max={selectedFee.balanceAmount}
                  required
                  className="form-input"
                  value={paymentForm.paymentAmount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentAmount: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Payment Mode *</label>
                <select
                  className="form-select"
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                >
                  {paymentMethods.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="form-group full-width">
                <label>Transaction Reference / Cheque No.</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. UPI-99881122 or CHQ-400192"
                  value={paymentForm.transactionRef}
                  onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                />
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* Official Fee Receipt Modal */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="Fee Payment Receipt"
        footer={
          <button className="btn btn-secondary" onClick={() => setIsReceiptModalOpen(false)}>
            Close
          </button>
        }
      >
        {selectedFee && (
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', background: '#ffffff' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>ST. AUGUSTINE INTERNATIONAL SCHOOL</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Accounts & Bursar's Office • Official Tax Invoice</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.88rem', marginBottom: '16px' }}>
              <div>
                <span style={{ color: '#64748b' }}>Receipt / Invoice #:</span> <strong>{selectedFee.invoiceNumber}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Date:</span> <strong>{new Date(selectedFee.updatedAt || selectedFee.createdAt).toLocaleDateString()}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Student Name:</span> <strong>{selectedFee.studentName}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Roll Number:</span> <strong>{selectedFee.rollNumber}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Class / Section:</span> <strong>{selectedFee.grade}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Payment Mode:</span> <strong>{selectedFee.paymentMethod || 'None'}</strong>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Fee Category:</span>
                <strong>{selectedFee.feeType}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Gross Amount:</span>
                <span>₹{selectedFee.amount.toLocaleString()}</span>
              </div>
              {selectedFee.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#059669' }}>
                  <span>Discount:</span>
                  <span>- ₹{selectedFee.discount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                <span>Total Paid:</span>
                <span style={{ color: '#059669' }}>₹{selectedFee.paidAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '4px' }}>
                <span>Remaining Balance:</span>
                <span style={{ color: selectedFee.balanceAmount > 0 ? '#dc2626' : '#64748b' }}>
                  ₹{selectedFee.balanceAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span
                className={`badge-tag ${
                  selectedFee.paymentStatus === 'Paid'
                    ? 'badge-green'
                    : selectedFee.paymentStatus === 'Partial'
                    ? 'badge-amber'
                    : 'badge-red'
                }`}
                style={{ padding: '6px 16px', fontSize: '0.9rem' }}
              >
                STATUS: {selectedFee.paymentStatus.toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

