import React from 'react';
import { useNavigate } from 'react-router-dom';

const buttonStyle = {
  padding: '10px 15px',
  margin: '5px',
  borderRadius: '8px',
  border: 'none',
  background: '#1976d2',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 'bold'
};

function DoctorDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🏥 Doctor Dashboard</h1>
      <button style={buttonStyle} onClick={() => navigate('/view-stats')}>📊 View Stats</button>
      <button style={buttonStyle} onClick={() => navigate('/create-hr')}>➕ Create HR ID</button>
      <button style={buttonStyle} onClick={() => navigate('/view-hrs')}>👥 View HRs</button>
      <button style={buttonStyle} onClick={() => navigate('/add-package')}>📦 Add Package</button>
      <button style={buttonStyle} onClick={() => navigate('/view-packages')}>📄 View Packages</button>
      <button style={buttonStyle} onClick={() => navigate('/claim-history')}>📋 Claim History</button>
      <button style={buttonStyle} onClick={() => navigate('/view-patients')}>🧍 View Patients</button>
    </div>
  );
}

export default DoctorDashboard;
