import React, { useEffect, useState } from 'react';
import axios from 'axios';

const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '15px' };
const thTdStyle = { border: '1px solid #ccc', padding: '10px', textAlign: 'left' };
const buttonStyle = {
  padding: '8px 12px',
  margin: '5px',
  borderRadius: '6px',
  border: 'none',
  background: '#1976d2',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 'bold'
};

function ViewHRs() {
  const [hrList, setHrList] = useState([]);
  const [expandedHrId, setExpandedHrId] = useState(null);
  const [referredPatients, setReferredPatients] = useState({});
  const [referredTotals, setReferredTotals] = useState({});

  useEffect(() => {
    fetchHrList();
  }, []);

  const fetchHrList = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/hr');
      setHrList(res.data);
    } catch {
      alert('Failed to fetch HR data');
    }
  };

  const toggleReferredPatients = async (hrId, hrName) => {
    if (expandedHrId === hrId) return setExpandedHrId(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/patients/referred-by/${hrName}`);
      const patients = res.data;
      setReferredPatients((prev) => ({ ...prev, [hrId]: patients }));
      const total = patients.reduce((sum, p) => sum + parseFloat(p.package_amount || 0), 0);
      setReferredTotals((prev) => ({ ...prev, [hrId]: total }));
      setExpandedHrId(hrId);
    } catch {
      alert('Failed to fetch referred patients');
    }
  };

  const handleDeleteHr = async (id) => {
    if (!window.confirm('Are you sure you want to delete this HR?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/hr/${id}`);
      alert('HR deleted successfully');
      setHrList(hrList.filter((hr) => hr.id !== id));
    } catch {
      alert('Failed to delete HR');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>👥 HR List</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTdStyle}>#</th>
              <th style={thTdStyle}>Name</th>
              <th style={thTdStyle}>Email</th>
              <th style={thTdStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hrList.map((hr, i) => (
              <React.Fragment key={hr.id}>
                <tr>
                  <td style={thTdStyle}>{i + 1}</td>
                  <td style={thTdStyle}>{hr.name}</td>
                  <td style={thTdStyle}>{hr.email}</td>
                  <td style={thTdStyle}>
                    <button style={{ ...buttonStyle, background: '#388e3c' }} onClick={() => toggleReferredPatients(hr.id, hr.name)}>Referred</button>
                    <button style={{ ...buttonStyle, background: '#d32f2f' }} onClick={() => handleDeleteHr(hr.id)}>Delete</button>
                  </td>
                </tr>
                {expandedHrId === hr.id && referredPatients[hr.id] && (
                  <tr>
                    <td colSpan="4">
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
                          {referredPatients[hr.id].map((p, j) => (
                            <tr key={j}>
                              <td style={thTdStyle}>{p.name}</td>
                              <td style={thTdStyle}>{p.package_name}</td>
                              <td style={thTdStyle}>₹{p.package_amount}</td>
                              <td style={thTdStyle}>{p.mobile_no}</td>
                              <td style={thTdStyle}>{new Date(p.created_at).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p><strong>Total:</strong> ₹{referredTotals[hr.id]}</p>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewHRs;
