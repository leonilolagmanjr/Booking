import React, { useState, useEffect } from 'react';
import { editJob } from '../../services/api';
import LocationSelector from './LocationSelector';

const UpdateJob = ({ job, onJobUpdated, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    category: '',
    location: { type: 'remote', address: '', coordinates: { lat: 0, lng: 0 } },
  });
  const [message, setMessage] = useState('');

  const currencies = ['USD', 'PHP'];

  // Safely format price whether it's string or number
  const formatPrice = (value, currency) => {
    if (value === null || value === undefined) return '';
    const strValue = value.toString();
    const num = parseFloat(strValue.replace(/[^\d.]/g, ''));
    if (isNaN(num)) return '';
    const symbol = currency === 'USD' ? '$' : '₱';
    return `${symbol}${num.toFixed(2)}`;
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    const formattedPrice = formatPrice(formData.price, newCurrency);
    setFormData({ ...formData, currency: newCurrency, price: formattedPrice });
  };

  useEffect(() => {
    if (job) {
      let location = { type: 'remote', address: '', coordinates: { lat: 0, lng: 0 } };
      if (typeof job.location === 'string') {
        // Backward compatibility: old string location
        location = { type: 'physical', address: job.location, coordinates: { lat: 0, lng: 0 } };
      } else if (job.location) {
        location = job.location;
      }

      const currency = job.currency || 'USD';
      const formattedPrice = formatPrice(job.price || '', currency);

      setFormData({
        title: job.title || '',
        description: job.description || '',
        price: formattedPrice,
        currency,
        category: job.category || '',
        location,
      });
    }
  }, [job]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Convert the formatted price back to number
      const priceNum = parseFloat(formData.price.toString().replace(/[^\d.]/g, '')) || 0;
      await editJob(job._id, { ...formData, price: priceNum }, token);
      setMessage('Job updated successfully!');
      onJobUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      setMessage('Failed to update job. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Update Job</h3>
      {message && <p style={styles.message}>{message}</p>}
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          style={styles.input}
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          style={styles.textarea}
          maxLength={500}
          required
        />
        <input
          type="text"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: formatPrice(e.target.value, formData.currency) })}
          style={styles.input}
          required
        />
        <select
          value={formData.currency}
          onChange={handleCurrencyChange}
          style={styles.input}
          required
        >
          <option value="" disabled>Select Currency</option>
          {currencies.map((curr) => (
            <option key={curr} value={curr}>{curr}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          style={styles.input}
          required
        />
        <LocationSelector
          location={formData.location}
          onLocationChange={(location) => setFormData({ ...formData, location })}
        />
        <div style={styles.buttonContainer}>
          <button type="button" onClick={onClose} style={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" style={styles.button}>
            Update Job
          </button>
        </div>
      </form>
    </div>
  );
};

// ...styles remain the same
const styles = {
  container: {
    marginBottom: '20px',
    backgroundColor: '#3F4E4F',
    padding: '24px',
    borderRadius: '8px',
    border: '2px solid rgba(162, 123, 92, 0.3)',
  },
  heading: {
    color: '#DCD7C9',
    marginBottom: '15px',
    fontSize: '1.75rem',
    fontWeight: 600,
  },
  message: {
    color: '#A27B5C',
    marginBottom: '15px',
    padding: '10px 14px',
    backgroundColor: 'rgba(162, 123, 92, 0.1)',
    borderRadius: '8px',
    borderLeft: '4px solid #A27B5C',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid rgba(162, 123, 92, 0.3)',
    backgroundColor: '#2C3639',
    color: '#DCD7C9',
    fontSize: '16px',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    transition: 'all 0.2s ease',
  },
  textarea: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid rgba(162, 123, 92, 0.3)',
    backgroundColor: '#2C3639',
    color: '#DCD7C9',
    fontSize: '16px',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    resize: 'none',
    minHeight: '120px',
    transition: 'all 0.2s ease',
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '10px',
  },
  button: {
    backgroundColor: '#A27B5C',
    color: '#2C3639',
    border: '2px solid #A27B5C',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  cancelButton: {
    backgroundColor: '#3F4E4F',
    color: '#DCD7C9',
    border: '2px solid #A27B5C',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export default UpdateJob;
