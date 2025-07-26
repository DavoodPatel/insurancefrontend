import React, { useState } from 'react';
import axios from 'axios';

const HRDashboard = () => {
  const hr = JSON.parse(localStorage.getItem('hr'));
  const [mobileNo, setMobileNo] = useState('');
  const [patient, setPatient] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [referredPatients, setReferredPatients] = useState([]);
  const [showCommission, setShowCommission] = useState(false);

  if (!hr) {
    return <p style={styles.notLoggedIn}>⚠️ Please log in as HR to view the dashboard.</p>;
  }

  const handleToggleCommissions = async () => {
    if (showCommission) {
      setShowCommission(false);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/patients/referred-by/${hr.name}`);
      setReferredPatients(res.data);
      setShowCommission(true);
    } catch (err) {
      console.error(err);
      alert('❌ Error fetching referred patients.');
    }
  };

  const handleSearchPatient = async () => {
    setPatient(null);
    setSearchMessage('');
    try {
      const res = await axios.get(`http://localhost:5000/api/patient/by-mobile/${mobileNo}`);
      if (res.data.success && res.data.patient) {
        setPatient(res.data.patient);
      } else {
        setSearchMessage('❌ Patient not found.');
      }
    } catch (err) {
      console.error(err);
      setSearchMessage('❌ Error fetching patient info.');
    }
  };

  const getTotalAmount = () =>
    referredPatients.reduce((sum, p) => sum + (parseFloat(p.package_amount) || 0), 0).toFixed(2);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>👋 Welcome, {hr.name}</h1>
      <h2 style={styles.subheading}>HR Dashboard</h2>

      <div style={styles.centered}>
        <button onClick={handleToggleCommissions} style={styles.greenButton}>
          {showCommission ? '❌ Close Referred Patients' : '💰 View Referred Patients'}
        </button>
      </div>

      {showCommission && (
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>🧑‍🤝‍🧑 Patients Referred by You</h3>
          {referredPatients.length > 0 ? (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Package</th>
                      <th>Amount (₹)</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referredPatients.map((p, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{p.name}</td>
                        <td>{p.mobile_no}</td>
                        <td>{p.package_name || 'N/A'}</td>
                        <td>{p.package_amount ? parseFloat(p.package_amount).toFixed(2) : '0.00'}</td>
                        <td>{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={styles.total}>💵 Total Amount: ₹{getTotalAmount()}</p>
            </>
          ) : (
            <p style={styles.errorText}>No patients referred yet.</p>
          )}
        </div>
      )}

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>🔍 Search Patient Info</h3>
        <div style={styles.searchBox}>
          <input
            type="tel"
            placeholder="Enter Mobile Number"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleSearchPatient} style={styles.searchButton}>
            Search
          </button>
        </div>

        {searchMessage && <p style={styles.errorText}>{searchMessage}</p>}

        {patient && (
          <div style={styles.patientCard}>
            <h4>📋 Patient Details</h4>
            {Object.entries(patient).map(([key, value]) => (
              <p key={key}>
                <strong>{key.replace(/_/g, ' ')}:</strong> {String(value)}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// STYLES
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    fontSize: '2rem',
  },
  subheading: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#007bff',
  },
  centered: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  greenButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '40px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    marginBottom: '20px',
    color: '#333',
    fontSize: '20px',
    fontWeight: 600,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    minWidth: '600px',
  },
  total: {
    marginTop: '20px',
    fontWeight: 'bold',
    color: '#28a745',
  },
  searchBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  searchButton: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  patientCard: {
    marginTop: '20px',
    backgroundColor: '#e9f7ef',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #c3e6cb',
  },
  errorText: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  notLoggedIn: {
    textAlign: 'center',
    color: 'red',
    marginTop: '50px',
    fontSize: '18px',
  },
};

export default HRDashboard;
