import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewPatients = () => {
  const [patients, setPatients] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients');
      setPatients(res.data);
    } catch (error) {
      setMessage('❌ Failed to fetch patients');
    }
  };

  const handleDelete = async (mobile_no) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this patient?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/patients/${mobile_no}`);
      setMessage('✅ Patient deleted successfully');
      fetchPatients();
    } catch (error) {
      setMessage('❌ Error deleting patient');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🧑‍🤝‍🧑 All Patients</h2>
      {message && <p style={styles.message}>{message}</p>}

      {patients.length === 0 ? (
        <p style={styles.noData}>No patients found.</p>
      ) : (
        <div style={styles.list}>
          {patients.map((patient) => (
            <div key={patient.mobile_no} style={styles.card}>
              <div style={styles.left}>
                <h3 style={styles.name}>{patient.name}</h3>
                <p style={styles.email}>PH-NO: {patient.mobile_no}</p>
              </div>
              <button
                onClick={() => handleDelete(patient.mobile_no)}
                style={styles.deleteButton}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '950px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    textAlign: 'center',
    fontSize: '28px',
    color: '#007bff',
    marginBottom: '20px',
  },
  message: {
    textAlign: 'center',
    color: '#28a745',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  noData: {
    textAlign: 'center',
    color: '#888',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  left: {
    flex: 1,
    minWidth: '200px',
  },
  name: {
    margin: 0,
    fontSize: '18px',
    color: '#333',
  },
  email: {
    margin: '8px 0 0',
    fontSize: '14px',
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px',
    alignSelf: 'flex-end',
    transition: 'background-color 0.3s ease',
  },
};

export default ViewPatients;
