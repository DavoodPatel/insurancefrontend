import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HrReferPatientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPackage = location.state?.selectedPackage;
  const isFamily = selectedPackage?.package_type === 'family';

  const [formData, setFormData] = useState({
    name: '',
    mobile_no: '',
    father_name: '',
    mother_name: '',
    address: '',
    no_of_others: 0,
    others_names: [],
    referred_by: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'no_of_others') {
      const count = parseInt(value, 10);
      if (!isNaN(count) && count >= 0) {
        setFormData((prev) => ({
          ...prev,
          no_of_others: count,
          others_names: Array(count).fill(''),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleOtherNameChange = (index, value) => {
    const updatedNames = [...formData.others_names];
    updatedNames[index] = value;
    setFormData((prev) => ({
      ...prev,
      others_names: updatedNames,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, selectedPackage };
    try {
      const res = await axios.post('http://localhost:5000/api/hr/refer-patient-dashboard', payload);
      if (res.status === 200 || res.status === 201) {
        alert('✅ Patient registered successfully!');
        navigate('/packages', {
          state: {
            registered: true,
            selectedPackage,
            mobile_no: formData.mobile_no,
          },
        });
      } else {
        alert('❌ Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('❌ Error submitting form:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Error registering patient. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        Patient Registration{selectedPackage ? ` for: ${selectedPackage.name}` : ''}
      </h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />

        <label>Mobile Number</label>
        <input type="tel" name="mobile_no" value={formData.mobile_no} onChange={handleInputChange} required />

        <label>Address</label>
        <textarea name="address" value={formData.address} onChange={handleInputChange} required />

        <label>Referred By</label>
        <input type="text" name="referred_by" value={formData.referred_by} onChange={handleInputChange} required />

        {isFamily && (
          <>
            <label>Father's Name</label>
            <input type="text" name="father_name" value={formData.father_name} onChange={handleInputChange} />

            <label>Mother's Name</label>
            <input type="text" name="mother_name" value={formData.mother_name} onChange={handleInputChange} />

            <label>No. of Others</label>
            <input
              type="number"
              name="no_of_others"
              min="0"
              value={formData.no_of_others}
              onChange={handleInputChange}
            />

            {formData.others_names.map((name, index) => (
              <div key={index}>
                <label>Other {index + 1} Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleOtherNameChange(index, e.target.value)}
                />
              </div>
            ))}
          </>
        )}

        <button type="submit" style={styles.submitBtn}>Submit</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: 'clamp(20px, 5vw, 40px)',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.08)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '24px',
    fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
    color: '#007bff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  submitBtn: {
    padding: '12px',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

export default HrReferPatientDashboard;
