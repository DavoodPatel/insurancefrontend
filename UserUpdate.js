import React, { useState } from 'react';
import axios from 'axios';

const UserUpdate = () => {
  const [mobileNo, setMobileNo] = useState('');
  const [patient, setPatient] = useState(null);
  const [others, setOthers] = useState([{ name: '' }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/patients/${mobileNo}`);
      setPatient(res.data);
      setSuccessMessage('');
    } catch (err) {
      alert('❌ Patient not found!');
      setPatient(null);
    }
  };

  const handleAddMore = () => {
    setOthers([...others, { name: '' }]);
  };

  const handleChange = (index, value) => {
    const updated = [...others];
    updated[index].name = value;
    setOthers(updated);
  };

  const sendSMSNotification = async (phone) => {
    try {
      const res = await axios.post('http://localhost:5000/api/send-sms/add-members', {
        phone,
        message: '✅ Additional members have been successfully added to your insurance.',
      });
      console.log('📩 SMS sent:', res.data.message);
    } catch (err) {
      console.error('❌ SMS failed:', err);
    }
  };

  const saveToDatabase = async (payment_mode, amount) => {
    try {
      const names = others.filter(o => o.name.trim() !== '').map(o => o.name);

      const res = await axios.post('http://localhost:5000/api/patient/add-others', {
        mobile_no: mobileNo,
        names,
        total_amount: amount,
        payment_mode,
      });

      if (res.status === 200 || res.status === 201) {
        setSuccessMessage(`✅ ${names.length} member(s) added and paid ₹${amount} via ${payment_mode.toUpperCase()}`);
        setOthers([{ name: '' }]);
        await sendSMSNotification(mobileNo); // Send message after success
      } else {
        alert('❌ Failed to update members.');
      }
    } catch (err) {
      alert('❌ Error saving members.');
      console.error(err);
    }
  };

  const handlePayment = async (method) => {
    const memberCount = others.filter(o => o.name.trim() !== '').length;
    if (memberCount === 0) {
      alert('Please enter at least one additional name.');
      return;
    }

    const amount = memberCount * 150;

    if (method === 'cash') {
      await saveToDatabase('cash', amount);
    } else if (method === 'online') {
      setIsProcessing(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;

      script.onload = () => {
        const options = {
          key: 'rzp_test_pJmYPmKKs1w1Ct',
          amount: amount * 100,
          currency: 'INR',
          name: 'Medical Insurance Portal',
          description: 'Add family members',
          handler: async function () {
            await saveToDatabase('online', amount);
            setIsProcessing(false);
          },
          prefill: {
            contact: mobileNo,
          },
          theme: {
            color: '#007bff',
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      script.onerror = () => {
        alert("❌ Razorpay SDK load failed");
        setIsProcessing(false);
      };

      document.body.appendChild(script);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>🔍 Update User Details</h2>

      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.searchBtn}>Search</button>
      </div>

      {patient && (
        <div style={styles.detailsBox}>
          <h3>👤 Patient Details</h3>
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Mobile:</strong> {patient.mobile_no}</p>
          <p><strong>Package:</strong> {patient.package_name}</p>

          <h4 style={{ marginTop: '20px' }}>➕ Add Family Members</h4>
          {others.map((other, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Name ${index + 1}`}
              value={other.name}
              onChange={(e) => handleChange(index, e.target.value)}
              style={styles.input}
            />
          ))}
          <button onClick={handleAddMore} style={styles.addBtn}>+ Add Another</button>

          <div style={styles.paymentSection}>
            <h4>Total: ₹{others.filter(o => o.name.trim() !== '').length * 150}</h4>
            <button onClick={() => handlePayment('cash')} style={styles.cashBtn} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : '💵 Pay with Cash'}
            </button>
            <button onClick={() => handlePayment('online')} style={styles.onlineBtn} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : '💳 Pay Online'}
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div style={styles.successBox}>{successMessage}</div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '40px 20px',
    fontFamily: 'Segoe UI, sans-serif',
    background: '#f5fafd',
    minHeight: '100vh',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '1.8rem',
    color: '#007bff',
  },
  searchBox: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '250px',
  },
  searchBtn: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  detailsBox: {
    backgroundColor: '#fff',
    padding: '25px',
    margin: '0 auto',
    maxWidth: '500px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  addBtn: {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  paymentSection: {
    marginTop: '20px',
    textAlign: 'center',
  },
  cashBtn: {
    marginRight: '10px',
    padding: '10px 18px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  onlineBtn: {
    padding: '10px 18px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  successBox: {
    marginTop: '20px',
    textAlign: 'center',
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '15px',
    borderRadius: '6px',
    fontWeight: 'bold',
  },
};

export default UserUpdate;
