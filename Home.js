import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleMouseEnter = (index) => setHoveredButton(index);
  const handleMouseLeave = () => setHoveredButton(null);

  const handleClick = (path, e) => {
    e.currentTarget.blur();
    navigate(path);
  };

  const buttons = [
    { label: '📦 View Packages', path: '/packages' },
    { label: '👨‍⚕️ Doctor Login', path: '/doctor-login' },
    { label: '🧑‍💼 HR Login', path: '/hr-login' },
    { label: '📝 Claim Insurance', path: '/claim-insurance' },
    { label: '🛠️ User Update', path: '/user-update' }, // NEW BUTTON
  ];

  const buttonStyle = (index) => ({
    ...styles.button,
    ...(hoveredButton === index ? styles.buttonHover : {}),
  });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏥 Health Insurance Portal</h1>
          <p style={styles.subtitle}>Secure your health with our trusted policies</p>
        </div>

        <div style={styles.buttons}>
          {buttons.map((btn, index) => (
            <button
              key={index}
              onClick={(e) => handleClick(btn.path, e)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              style={buttonStyle(index)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #e3f2fd, #fffde7)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px 25px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '480px',
    textAlign: 'center',
  },
  header: {
    marginBottom: '35px',
  },
  title: {
    fontSize: '2.2rem',
    color: '#007bff',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#555',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  button: {
    padding: '14px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '12px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    outline: 'none',
    transition: 'all 0.25s ease-in-out',
    boxShadow: '0 4px 10px rgba(0, 123, 255, 0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    touchAction: 'manipulation',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  },
};

export default Home;
