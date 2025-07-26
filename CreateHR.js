import React, { useState } from 'react';
import axios from 'axios';

const inputStyle = {
  width: '100%',
  marginBottom: '10px',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

const buttonStyle = {
  padding: '10px 15px',
  marginTop: '10px',
  borderRadius: '8px',
  border: 'none',
  background: '#1976d2',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 'bold',
  width: '100%'
};

function CreateHR() {
  const [hrName, setHrName] = useState('');
  const [hrEmail, setHrEmail] = useState('');
  const [hrPassword, setHrPassword] = useState('');

  const handleCreateHr = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/hr/register', {
        name: hrName,
        email: hrEmail,
        password: hrPassword,
      });
      alert('HR created successfully');
      setHrName('');
      setHrEmail('');
      setHrPassword('');
    } catch (err) {
      alert('Failed to create HR');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '50px' }}>
      <h2 style={{ textAlign: 'center' }}>➕ Create HR</h2>
      <form onSubmit={handleCreateHr}>
        <input type="text" placeholder="Name" value={hrName} onChange={(e) => setHrName(e.target.value)} required style={inputStyle} />
        <input type="email" placeholder="Email" value={hrEmail} onChange={(e) => setHrEmail(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Password" value={hrPassword} onChange={(e) => setHrPassword(e.target.value)} required style={inputStyle} />
        <button type="submit" style={buttonStyle}>Create HR</button>
      </form>
    </div>
  );
}

export default CreateHR;
