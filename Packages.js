// Packages.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [mobileNo, setMobileNo] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get('http://localhost:5000/api/packages')
      .then((res) => setPackages(res.data))
      .catch(() => alert('Failed to fetch packages'));

    if (location.state?.registered && location.state?.selectedPackage && location.state?.mobile_no) {
      const pkgWithMobile = {
        ...location.state.selectedPackage,
        mobile_no: location.state.mobile_no,
      };
      setSelectedPackage(pkgWithMobile);
      setMobileNo(location.state.mobile_no);
      setShowPaymentOptions(true);
    }
  }, [location.state]);

  const handleSelectPackage = (pkg) => {
    navigate('/hr-refer-patient-dashboard', { state: { selectedPackage: pkg } });
  };

  const sendSMSNotification = async (phone) => {
    try {
      const res = await axios.post('http://localhost:5000/api/send-sms', { phone });
      console.log('📩 SMS sent:', res.data.message);
    } catch (err) {
      console.error('❌ Failed to send SMS:', err);
    }
  };

  const savePackageToDatabase = async (payment_mode) => {
    try {
      if (!mobileNo || !selectedPackage) {
        alert('Missing mobile number or selected package.');
        return;
      }

      const payload = {
        mobile_no: mobileNo,
        package_name: selectedPackage.name,
        package_amount: Number(selectedPackage.price),
        package_type: selectedPackage.package_type,
        payment_mode,
      };

      const res = await axios.post('http://localhost:5000/api/patient/save-package', payload);

      if (res.status === 200 || res.status === 201) {
        setSuccessMessage(`✅ Payment done with ${payment_mode.toUpperCase()} and package saved.`);
        setPurchaseMessage('✅ Package successfully purchased!');
        setShowPaymentOptions(false);
        alert('Successfully purchased');
        await sendSMSNotification(mobileNo);

        setTimeout(() => {
          setSuccessMessage('');
          setPurchaseMessage('');
          navigate('/packages');
        }, 3000);
      } else {
        alert('❌ Unexpected server response.');
      }
    } catch (err) {
      console.error('❌ Error saving package:', err);
      if (err.response) {
        alert(`❌ ${err.response.data.message}`);
      } else {
        alert('❌ Failed to save package. Server may be down.');
      }
      setIsProcessing(false);
    }
  };

  const handlePaymentChoice = async (method) => {
    setIsProcessing(true);
    if (method === 'cash') {
      await savePackageToDatabase('cash');
      setIsProcessing(false);
    } else if (method === 'online') {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;

      script.onload = () => {
        const options = {
          key: 'rzp_test_pJmYPmKKs1w1Ct',
          amount: Number(selectedPackage.price) * 100,
          currency: 'INR',
          name: 'Medical Insurance Portal',
          description: `Payment for ${selectedPackage.name}`,
          handler: async function (response) {
            await savePackageToDatabase('online');
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
        alert("❌ Failed to load Razorpay SDK.");
        setIsProcessing(false);
      };

      document.body.appendChild(script);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>🌟 Choose the Best Insurance Plan for You</h1>

      {showPaymentOptions && selectedPackage && (
        <div style={styles.paymentBox}>
          <h3>Make Payment for: <span style={{ color: '#007bff' }}>{selectedPackage.name}</span></h3>
          <p style={{ fontSize: '18px', fontWeight: '500' }}>Price: ₹{selectedPackage.price}</p>

          <button onClick={() => handlePaymentChoice('cash')} style={styles.cashBtn} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : '💵 Pay with Cash'}
          </button>

          <button onClick={() => handlePaymentChoice('online')} style={styles.onlineBtn} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : '💳 Pay Online'}
          </button>
        </div>
      )}

      {(successMessage || purchaseMessage) && (
        <div style={styles.successBox}>
          {successMessage && <p>{successMessage}</p>}
          {purchaseMessage && <p>{purchaseMessage}</p>}
          <p>🔁 Redirecting to View Packages...</p>
        </div>
      )}

      <div style={styles.cardContainer}>
        {packages.map((pkg) => (
          <div key={pkg.id} style={styles.card}>
            <div style={styles.cardHeader}>{pkg.name}</div>
            <div style={styles.cardBody}>
              <p style={styles.description}>{pkg.description}</p>
              <p style={styles.type}>Type: <strong>{pkg.package_type?.toUpperCase()}</strong></p>
              <p style={styles.price}>₹ {parseFloat(pkg.price).toFixed(2)}</p>
              <button style={styles.button} onClick={() => handleSelectPackage(pkg)}>
                🛒 Buy Package
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '40px 20px',
    background: 'linear-gradient(135deg, #e3f2fd, #fdfbfb)',
    minHeight: '100vh',
  },
  title: {
    textAlign: 'center',
    marginBottom: 40,
    fontSize: 'clamp(1.5rem, 2.5vw, 2.4rem)',
    color: '#007bff',
    fontWeight: '600',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
    backgroundColor: '#ffffff',
    transition: 'transform 0.3s ease',
  },
  cardHeader: {
    background: 'linear-gradient(90deg, #007bff, #00c6ff)',
    color: '#fff',
    padding: '16px',
    fontSize: '1.3rem',
    fontWeight: '600',
    textAlign: 'center',
  },
  cardBody: {
    padding: '20px',
    textAlign: 'center',
  },
  description: {
    fontSize: '0.95rem',
    color: '#555',
    margin: '10px 0 15px',
  },
  type: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#333',
    marginBottom: '10px',
  },
  price: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: '15px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  paymentBox: {
    backgroundColor: '#fffbea',
    padding: '25px',
    marginBottom: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px solid #ffeeba',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  cashBtn: {
    padding: '12px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    margin: '10px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  onlineBtn: {
    padding: '12px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    margin: '10px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  successBox: {
    backgroundColor: '#d4edda',
    padding: '20px',
    marginBottom: '30px',
    borderRadius: '10px',
    border: '1px solid #c3e6cb',
    color: '#155724',
    textAlign: 'center',
    fontWeight: 'bold',
  },
};

export default Packages;
