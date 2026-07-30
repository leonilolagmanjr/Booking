import React, { useState } from 'react';
import { postJob } from '../../services/api';
import LocationSelector from './LocationSelector';

const CreateJob = ({ onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    category: '',
    location: { type: 'remote', address: '', coordinates: { lat: 0, lng: 0 } },
  });
  const [message, setMessage] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const categories = [
    'Web Development',
    'Graphic Design',
    'Content Writing',
    'Video Editing',
    'Music Production',
    'Game Development',
    'Marketing',
    'Data Entry',
    'Custom',
  ];

  const currencies = ['USD', 'PHP'];

  const formatPrice = (value, currency) => {
    const num = parseFloat(value.replace(/[^\d.]/g, ''));
    if (isNaN(num)) return '';
    const symbol = currency === 'USD' ? '$' : '₱';
    return `${symbol}${num.toFixed(2)}`;
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    const formattedPrice = formatPrice(formData.price, newCurrency);
    setFormData({ ...formData, currency: newCurrency, price: formattedPrice });
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    if (selected === 'Custom') {
      setIsCustomCategory(true);
      setFormData({ ...formData, category: '' });
    } else {
      setIsCustomCategory(false);
      setFormData({ ...formData, category: selected });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to create a job.');
        return;
      }
      const priceNum = parseFloat(formData.price.replace(/[^\d.]/g, ''));
      if (isNaN(priceNum) || priceNum <= 0) {
        setMessage('Please enter a valid price.');
        return;
      }
      if (!formData.title || !formData.description || !formData.category) {
        setMessage('Please fill in all required fields.');
        return;
      }
      const jobData = {
        title: formData.title,
        description: formData.description,
        price: priceNum,
        currency: formData.currency,
        category: formData.category,
        location: formData.location,
      };
      await postJob(jobData, token);
      setMessage('Job created successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        currency: 'USD',
        category: '',
        location: { type: 'remote', address: '', coordinates: { lat: 0, lng: 0 } },
      });
      setIsCustomCategory(false);
      onJobCreated();
      window.location.href = '/jobmanager';
    } catch (err) {
      console.error('Job creation error:', err);
      const errorMsg = err.response?.data?.msg || err.message || 'Failed to create job. Please try again.';
      setMessage(errorMsg);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Create Job</h3>
      {message && <p style={styles.message}>{message}</p>}
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          style={styles.input}
          maxLength={100}
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
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          onBlur={() => setFormData({ ...formData, price: formatPrice(formData.price, formData.currency) })}
          style={styles.input}
          required
        />

        {/* Currency Selection */}
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

        {/* Category Selection */}
        <select
          value={isCustomCategory ? 'Custom' : formData.category}
          onChange={handleCategoryChange}
          style={styles.input}
          required
        >
          <option value="" disabled>Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Custom Category Input */}
        {isCustomCategory && (
          <input
            type="text"
            placeholder="Enter custom category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            style={styles.input}
            required
          />
        )}

        <LocationSelector
          location={formData.location}
          onLocationChange={(location) => setFormData({ ...formData, location })}
        />

        <button type="submit" style={styles.button}>
          Create Job
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { 
    marginBottom: '20px',
    backgroundColor: '#3F4E4F',
    padding: '20px',
    borderRadius: '8px',
    border: '2px solid rgba(162, 123, 92, 0.3)'
  },
  heading: { 
    color: '#DCD7C9', 
    marginBottom: '10px',
    fontSize: '1.75rem',
    fontWeight: 600
  },
  message: { 
    color: '#A27B5C', 
    marginBottom: '10px',
    padding: '8px 12px',
    backgroundColor: 'rgba(162, 123, 92, 0.1)',
    borderRadius: '8px',
    borderLeft: '4px solid #A27B5C'
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '12px' 
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid rgba(162, 123, 92, 0.3)',
    backgroundColor: '#2C3639',
    color: '#DCD7C9',
    fontSize: '16px',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    transition: 'all 0.2s ease'
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
    transition: 'all 0.2s ease'
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
    marginTop: '10px'
  },
};

// Adding hover effects via inline styles (React doesn't support :hover in style objects)
const buttonHoverStyle = {
  backgroundColor: '#8a6a50',
  color: '#2C3639',
  transform: 'translateY(-2px)',
  boxShadow: '0 6px 16px rgba(162, 123, 92, 0.4)',
  borderColor: '#8a6a50'
};

const inputFocusStyle = {
  outline: 'none',
  borderColor: '#A27B5C',
  boxShadow: '0 0 0 4px rgba(162, 123, 92, 0.1)',
  backgroundColor: 'rgba(44, 54, 57, 0.9)'
};

export default CreateJob;