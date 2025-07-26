import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewPackages = () => {
  const [packages, setPackages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/packages');
      setPackages(res.data);
    } catch (error) {
      setMessage('❌ Failed to fetch packages');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this package?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/packages/${id}`);
      setMessage('✅ Package deleted successfully');
      fetchPackages();
    } catch (error) {
      setMessage('❌ Error deleting package');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📦 All Insurance Packages</h2>
      {message && <p style={styles.message}>{message}</p>}

      {packages.length === 0 ? (
        <p style={styles.noData}>No packages available.</p>
      ) : (
        <div style={styles.list}>
          {packages.map((pkg) => (
            <div key={pkg.id} style={styles.card}>
              <div style={styles.leftSection}>
                <h3 style={styles.name}>{pkg.name}</h3>
                <p style={styles.desc}>{pkg.description}</p>
              </div>
              <div style={styles.rightSection}>
                <span style={styles.price}>₹{pkg.price}</span>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  style={styles.deleteButton}
                >
                  🗑️ Delete
                </button>
              </div>
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
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#28a745',
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
    gap: '20px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    flexWrap: 'wrap',
  },
  leftSection: {
    flex: 2,
    minWidth: '200px',
  },
  name: {
    margin: '0 0 6px 0',
    fontSize: '20px',
    color: '#333',
  },
  desc: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
  },
  rightSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: '130px',
  },
  price: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '10px',
    whiteSpace: 'nowrap',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
};

export default ViewPackages;
