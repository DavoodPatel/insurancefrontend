import React, { useState } from 'react';
import axios from 'axios';

const ClaimHistory = () => {
  const [mobileNo, setMobileNo] = useState('');
  const [patient, setPatient] = useState(null);
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setPatient(null);
    setClaims([]);
    setError('');

    try {
      const res = await axios.get(`http://localhost:5000/api/claim-history/${mobileNo}`);
      setPatient(res.data.patient);
      setClaims(res.data.claims);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('❌ Patient not found');
      } else {
        setError('❌ Failed to fetch data');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Insurance Claim History</h2>

      <form onSubmit={handleSearch} style={styles.searchBox}>
        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.searchBtn}>🔍 Search</button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {patient && (
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>👤 Patient Information</h3>
          <div style={styles.detailGrid}>
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Mobile No:</strong> {patient.mobile_no}</p>
            <p><strong>Address:</strong> {patient.address}</p>
            <p><strong>Package:</strong> {patient.package_name || 'N/A'} ({patient.package_type})</p>
            <p><strong>Amount:</strong> ₹{patient.package_amount}</p>
            <p><strong>Payment Mode:</strong> {patient.payment_mode}</p>
          </div>
        </div>
      )}

      {claims.length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>📄 Claim Records</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Hospital</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{claim.hospital_name}</td>
                    <td style={styles.td}>₹{claim.amount}</td>
                    <td style={styles.td}>{new Date(claim.date).toLocaleDateString()}</td>
                    <td style={styles.td}>{claim.description}</td>
                    <td style={styles.td}>{new Date(claim.submitted_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1000px',
    margin: '0 auto',
    fontFamily: '"Segoe UI", sans-serif',
    backgroundColor: '#f9f9f9',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    color: '#2c3e50',
  },
  searchBox: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    gap: '10px',
    flexWrap: 'wrap',
  },
  input: {
    padding: '10px 15px',
    width: '250px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  searchBtn: {
    padding: '10px 20px',
    backgroundColor: '#2980b9',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  error: {
    textAlign: 'center',
    color: 'red',
    marginTop: '10px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#34495e',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    padding: '12px',
    backgroundColor: '#3498db',
    color: 'white',
    textAlign: 'left',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
};

export default ClaimHistory;
