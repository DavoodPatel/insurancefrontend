import React, { useState } from 'react';
import axios from 'axios';

const ClaimInsurance = () => {
  const [formData, setFormData] = useState({
    mobile_no: '',
    name: '',
    hospital_name: '',
    amount: '',
    date: '',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    console.log('📤 Submitting claim:', formData);

    try {
      const res = await axios.post('http://localhost:5000/api/claim-insurance', formData);
      alert(res.data.message || '✅ Claim submitted successfully!');
      console.log('✅ Server response:', res.data);

      // Reset form
      setFormData({
        mobile_no: '',
        name: '',
        hospital_name: '',
        amount: '',
        date: '',
        description: '',
      });
    } catch (err) {
      if (err.response) {
        console.error('❌ Server error:', err.response.data);
        alert(err.response.data.message || '❌ Server returned an error');
      } else {
        console.error('⚠️ Network error or server not running:', err);
        alert('⚠️ Failed to submit claim. Please check backend server or network.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📝 Claim Insurance</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="mobile_no"
            placeholder="Mobile Number"
            value={formData.mobile_no}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="hospital_name"
            placeholder="Hospital Name"
            value={formData.hospital_name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="amount"
            placeholder="Claim Amount (₹)"
            value={formData.amount}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <textarea
            name="description"
            placeholder="Medical Report Details"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
            style={styles.textarea}
          />
          <button type="submit" disabled={submitting} style={styles.button}>
            {submitting ? 'Submitting...' : 'Submit Claim'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #e0f7fa, #f1f8e9)',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  heading: {
    textAlign: 'center',
    color: '#007bff',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  input: {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    resize: 'vertical',
  },
  button: {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background 0.2s ease-in-out',
    opacity: '1',
  },
};

export default ClaimInsurance;
