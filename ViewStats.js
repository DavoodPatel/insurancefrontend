import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ Required for table PDF

const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '15px' };
const thTdStyle = { border: '1px solid #ccc', padding: '10px', textAlign: 'left' };
const buttonStyle = {
  padding: '8px 16px',
  marginBottom: '20px',
  marginRight: '10px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

function ViewStats() {
  const [cashPayments, setCashPayments] = useState([]);
  const [onlinePayments, setOnlinePayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const cashRes = await axios.get('http://localhost:5000/api/payments?method=cash');
      const onlineRes = await axios.get('http://localhost:5000/api/payments?method=online');
      setCashPayments(cashRes.data);
      setOnlinePayments(onlineRes.data);
    } catch (error) {
      alert('Failed to fetch payment data');
    }
  };

  const calculateTotal = (payments) =>
    payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0).toFixed(2);

  const generatePdf = (data, title) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(title, 14, 20);

    const tableData = data.map((p, i) => [
      i + 1,
      p.patient_name,
      p.package_name,
      `₹${p.amount}`,
      p.mobile_no,
      new Date(p.created_at).toLocaleString()
    ]);

    autoTable(doc, {
      head: [['#', 'Patient', 'Package', 'Amount', 'Mobile', 'Date']],
      body: tableData,
      startY: 30
    });

    doc.text(`Total ${title}: ₹${calculateTotal(data)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>💵 Cash Payments</h2>
      <button style={buttonStyle} onClick={() => generatePdf(cashPayments, 'Cash Payments')}>
        📄 Export Cash Payments PDF
      </button>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Patient</th>
            <th style={thTdStyle}>Package</th>
            <th style={thTdStyle}>Amount</th>
            <th style={thTdStyle}>Mobile</th>
            <th style={thTdStyle}>Date</th>
          </tr>
        </thead>
        <tbody>
          {cashPayments.map((p, i) => (
            <tr key={i}>
              <td style={thTdStyle}>{p.patient_name}</td>
              <td style={thTdStyle}>{p.package_name}</td>
              <td style={thTdStyle}>₹{p.amount}</td>
              <td style={thTdStyle}>{p.mobile_no}</td>
              <td style={thTdStyle}>{new Date(p.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><strong>Total Cash:</strong> ₹{calculateTotal(cashPayments)}</p>

      <h2>💳 Online Payments</h2>
      <button style={buttonStyle} onClick={() => generatePdf(onlinePayments, 'Online Payments')}>
        📄 Export Online Payments PDF
      </button>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Patient</th>
            <th style={thTdStyle}>Package</th>
            <th style={thTdStyle}>Amount</th>
            <th style={thTdStyle}>Mobile</th>
            <th style={thTdStyle}>Date</th>
          </tr>
        </thead>
        <tbody>
          {onlinePayments.map((p, i) => (
            <tr key={i}>
              <td style={thTdStyle}>{p.patient_name}</td>
              <td style={thTdStyle}>{p.package_name}</td>
              <td style={thTdStyle}>₹{p.amount}</td>
              <td style={thTdStyle}>{p.mobile_no}</td>
              <td style={thTdStyle}>{new Date(p.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><strong>Total Online:</strong> ₹{calculateTotal(onlinePayments)}</p>
    </div>
  );
}

export default ViewStats;
