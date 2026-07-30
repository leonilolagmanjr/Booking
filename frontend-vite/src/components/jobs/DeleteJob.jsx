import React, { useState } from 'react';
import { deleteJob } from '../../services/api';

const DeleteJob = ({ job, onJobDeleted, onClose }) => {
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await deleteJob(job._id, token);
      setMessage('Job deleted successfully!');
      onJobDeleted();
      onClose();
    } catch (err) {
      setMessage('Failed to delete job. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Delete Job</h3>
      {message && <p style={styles.message}>{message}</p>}
      <p style={styles.confirmationText}>
        Are you sure you want to delete <strong>"{job.title}"</strong>?
      </p>
      <div style={styles.buttonContainer}>
        <button onClick={onClose} style={styles.cancelButton}>
          Cancel
        </button>
        <button onClick={handleDelete} style={styles.deleteButton}>
          Delete Job
        </button>
      </div>
    </div>
  );
};

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
  confirmationText: {
    color: '#DCD7C9',
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '20px',
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
  deleteButton: {
    backgroundColor: '#dc3545', // Error/Delete color
    color: '#DCD7C9',
    border: '2px solid #dc3545',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Hover state styles for buttons (to be implemented with event handlers or CSS classes)
const buttonHoverStyles = {
  cancelButtonHover: {
    backgroundColor: '#A27B5C',
    color: '#2C3639',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(162, 123, 92, 0.4)',
    borderColor: '#8a6a50',
  },
  deleteButtonHover: {
    backgroundColor: '#c82333',
    color: '#DCD7C9',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(220, 53, 69, 0.4)',
    borderColor: '#bd2130',
  },
};

// Focus state styles
const buttonFocusStyles = {
  cancelButtonFocus: {
    outline: 'none',
    borderColor: '#A27B5C',
    boxShadow: '0 0 0 4px rgba(162, 123, 92, 0.1)',
  },
  deleteButtonFocus: {
    outline: 'none',
    borderColor: '#dc3545',
    boxShadow: '0 0 0 4px rgba(220, 53, 69, 0.1)',
  },
};

export default DeleteJob;