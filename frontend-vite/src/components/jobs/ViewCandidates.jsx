import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Collapse,
  Paper
} from '@mui/material';
import { Delete as DeleteIcon, Message as MessageIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { fetchCandidates, removeCandidate, updateCandidateStatus, openApplicationChat, updateInterviewData } from '../../services/api';
import UserLink from '../UserLink';
import { useFriend } from '../../context/FriendContext';

const STATUS_OPTIONS = ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'];

const ViewCandidates = ({ open, onClose, jobId, jobTitle }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [savingInterview, setSavingInterview] = useState(false);

  const { openChatWithUser } = useFriend();

  const loadCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const data = await fetchCandidates(jobId, token);
      setCandidates(data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && jobId) {
      loadCandidates();
    }
  }, [open, jobId]);

  const handleRemoveCandidate = async (candidateId) => {
    try {
      const token = localStorage.getItem('token');
      await removeCandidate(jobId, candidateId, token);
      await loadCandidates();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to remove candidate');
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await updateCandidateStatus(jobId, applicationId, newStatus, token);
      await loadCandidates();
      if (newStatus === 'hired') {
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update candidate status');
    }
  };

  const handleMessageCandidate = async (applicationId, candidateUserId) => {
    try {
      const token = localStorage.getItem('token');
      const chat = await openApplicationChat(applicationId, token);
      // Open the chat widget with this candidate
      openChatWithUser(candidateUserId);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to open chat. Make sure you are connected with this candidate.');
    }
  };

  const handleSaveInterview = async (applicationId) => {
    setSavingInterview(true);
    try {
      const token = localStorage.getItem('token');
      await updateInterviewData(applicationId, { interviewDate: interviewDate, meetingLink }, token);
      setExpandedCandidate(null);
      await loadCandidates();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to save interview data');
    } finally {
      setSavingInterview(false);
    }
  };

  const toggleExpand = (applicationId, candidate) => {
    if (expandedCandidate === applicationId) {
      setExpandedCandidate(null);
    } else {
      setExpandedCandidate(applicationId);
      setInterviewDate(candidate.interviewDate ? new Date(candidate.interviewDate).toISOString().slice(0, 16) : '');
      setMeetingLink(candidate.meetingLink || '');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'hired': return '#4caf50';
      case 'offered': return '#8bc34a';
      case 'interview': return '#ff9800';
      case 'shortlisted': return '#03a9f4';
      case 'reviewing': return '#9c27b0';
      case 'rejected': return '#f44336';
      default: return '#A27B5C';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: '#3F4E4F',
          color: '#DCD7C9',
          borderRadius: '8px',
          border: '2px solid rgba(162, 123, 92, 0.3)',
        },
      }}
    >
      <DialogTitle sx={{
        bgcolor: '#2C3639',
        color: '#DCD7C9',
        borderBottom: '2px solid #A27B5C',
        fontSize: '1.25rem',
        fontWeight: 600,
      }}>
        Candidates for "{jobTitle}"
      </DialogTitle>
      <DialogContent sx={{
        bgcolor: '#3F4E4F',
        color: '#DCD7C9',
        padding: '16px 24px',
      }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress sx={{ color: '#A27B5C' }} />
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{
              bgcolor: 'rgba(220, 53, 69, 0.1)',
              color: '#dc3545',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              '& .MuiAlert-icon': {
                color: '#dc3545',
              }
            }}
          >
            {error}
          </Alert>
        ) : candidates.length === 0 ? (
          <Typography
            sx={{
              color: '#A27B5C',
              textAlign: 'center',
              padding: '20px',
              fontStyle: 'italic'
            }}
          >
            No candidates have applied for this job yet.
          </Typography>
        ) : (
          <List sx={{ padding: 0 }}>
            {candidates.map((candidate) => (
              <Box key={candidate._id}>
                <ListItem
                  sx={{
                    borderBottom: '1px solid rgba(162, 123, 92, 0.2)',
                    padding: '12px 0',
                    '&:last-child': {
                      borderBottom: 'none',
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <UserLink
                          userId={candidate.applicant._id}
                          name={candidate.applicant.name}
                          style={{ color: '#DCD7C9', fontWeight: 600 }}
                        />
                        <Typography
                          component="span"
                          sx={{
                            fontSize: '0.75rem',
                            color: getStatusColor(candidate.status),
                            fontWeight: 600,
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            bgcolor: `${getStatusColor(candidate.status)}20`,
                            textTransform: 'uppercase'
                          }}
                        >
                          {candidate.status}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography sx={{
                        color: 'rgba(220, 215, 201, 0.8)',
                        fontSize: '0.875rem'
                      }}>
                        {candidate.applicant.email}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton
                        onClick={() => handleMessageCandidate(candidate._id, candidate.applicant._id)}
                        sx={{
                          color: '#03a9f4',
                          '&:hover': {
                            backgroundColor: 'rgba(3, 169, 244, 0.1)',
                          }
                        }}
                        title="Message Candidate"
                      >
                        <MessageIcon />
                      </IconButton>
                      {candidate.status === 'interview' && (
                        <IconButton
                          onClick={() => toggleExpand(candidate._id, candidate)}
                          sx={{
                            color: '#ff9800',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 152, 0, 0.1)',
                            }
                          }}
                          title="Interview Details"
                        >
                          {expandedCandidate === candidate._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      )}
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={candidate.status}
                          onChange={(e) => handleStatusChange(candidate._id, e.target.value)}
                          sx={{
                            color: '#DCD7C9',
                            '.MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(162, 123, 92, 0.5)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#A27B5C',
                            },
                            '.MuiSvgIcon-root': {
                              color: '#A27B5C',
                            },
                          }}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <IconButton
                        onClick={() => handleRemoveCandidate(candidate.applicant._id)}
                        sx={{
                          color: '#A27B5C',
                          ml: 1,
                          '&:hover': {
                            backgroundColor: 'rgba(162, 123, 92, 0.1)',
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                <Collapse in={expandedCandidate === candidate._id}>
                  <Paper sx={{ bgcolor: '#2C3639', p: 2, mb: 1, borderRadius: 1 }}>
                    <Typography sx={{ color: '#A27B5C', mb: 2, fontWeight: 600 }}>
                      Interview Details
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        type="datetime-local"
                        label="Interview Date & Time"
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: { color: '#DCD7C9' } }}
                        sx={{
                          '& .MuiInputLabel-root': { color: '#A27B5C' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(162, 123, 92, 0.5)' },
                            '&:hover fieldset': { borderColor: '#A27B5C' },
                          },
                        }}
                      />
                      <TextField
                        type="url"
                        label="Meeting Link"
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        placeholder="https://meet.google.com/..."
                        InputProps={{ sx: { color: '#DCD7C9' } }}
                        sx={{
                          '& .MuiInputLabel-root': { color: '#A27B5C' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(162, 123, 92, 0.5)' },
                            '&:hover fieldset': { borderColor: '#A27B5C' },
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => handleSaveInterview(candidate._id)}
                        disabled={savingInterview}
                        sx={{
                          bgcolor: '#A27B5C',
                          color: '#2C3639',
                          fontWeight: 600,
                          '&:hover': { bgcolor: '#8a6a50' },
                        }}
                      >
                        {savingInterview ? 'Saving...' : 'Save Interview'}
                      </Button>
                    </Box>
                  </Paper>
                </Collapse>
              </Box>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{
        bgcolor: '#3F4E4F',
        borderTop: '2px solid rgba(162, 123, 92, 0.3)',
        padding: '16px 24px',
      }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#DCD7C9',
            border: '2px solid #A27B5C',
            borderRadius: '8px',
            padding: '8px 20px',
            fontWeight: 600,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: '#A27B5C',
              color: '#2C3639',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(162, 123, 92, 0.4)',
              borderColor: '#8a6a50',
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewCandidates;