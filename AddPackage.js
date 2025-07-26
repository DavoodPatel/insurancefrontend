import React, { useState } from 'react';

const AddPackage = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    package_type: '',
  });

  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/add/package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Package added successfully!');
        setFormData({
          id: '',
          name: '',
          description: '',
          price: '',
          package_type: '',
        });
      } else {
        setMessage(data.message || '❌ Failed to add package');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('❌ Server error');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>➕ Add Insurance Package</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {['id', 'name', 'description', 'price'].map((field) => (
            <div style={styles.formGroup} key={field}>
              <label style={styles.label} htmlFor={field}>{field.toUpperCase()}</label>
              <input
                type={field === 'price' ? 'number' : 'text'}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
          ))}

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="package_type">PACKAGE TYPE</label>
            <select
              name="package_type"
              id="package_type"
              value={formData.package_type}
              onChange={handleInputChange}
              required
              style={styles.input}
            >
              <option value="">Select Type</option>
              <option value="single">Single</option>
              <option value="family">Family</option>
            </select>
          </div>

          <button
            type="submit"
            style={styles.submitButton}
          >
            Add Package
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: '20px',
              color: message.includes('successfully') ? 'green' : 'red',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    background: 'linear-gradient(to right, #e0f7fa, #fce4ec)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 'clamp(20px, 5vw, 40px)',
  },
  card: {
    maxWidth: '500px',
    width: '100%',
    background: '#ffffff',
    borderRadius: '16px',
    padding: 'clamp(24px, 5vw, 40px) clamp(20px, 5vw, 30px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: 'clamp(1.6rem, 3vw, 2rem)',
    color: '#007bff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 'bold',
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    fontSize: '1rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default AddPackage;
