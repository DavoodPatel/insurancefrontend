// src/pages/HRLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HRLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/hr/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        localStorage.setItem('hr', JSON.stringify(data.hr));
        alert('✅ HR login successful!');
        navigate('/hr-dashboard');
      } else {
        alert('❌ Login failed: ' + data.message);
      }
    } catch (error) {
      setLoading(false);
      alert('❌ Server error. Please try again later.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>👩‍💼 HR Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px 30px',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: 400,
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
    color: '#007bff',
    fontSize: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '12px 16px',
    marginBottom: 15,
    border: '1px solid #ccc',
    borderRadius: 6,
    fontSize: 16,
  },
  button: {
    padding: '12px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: 16,
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
};

export default HRLogin;
