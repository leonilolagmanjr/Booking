import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Box, 
  TextField, 
  Paper, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const AddressAutocomplete = ({ value, onPlaceSelect, placeholder = "Search for a location...", disabled = false }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [predictions, setPredictions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);

  // Initialize services
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      if (!autocompleteServiceRef.current) {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      }
      if (!placesServiceRef.current) {
        // Create a dummy map for PlacesService (required)
        const dummyMap = new window.google.maps.Map(document.createElement('div'));
        placesServiceRef.current = new window.google.maps.places.PlacesService(dummyMap);
      }
    }
  }, []);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Fetch predictions
  const fetchPredictions = useCallback((query) => {
    if (!autocompleteServiceRef.current || !query.trim()) {
      setPredictions([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    autocompleteServiceRef.current.getPlacePredictions(
      {
        input: query,
        types: ['geocode'],
        componentRestrictions: { country: [] }, // Allow all countries
      },
      (predictions, status) => {
        setLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions);
          setShowDropdown(true);
          setSelectedIndex(-1);
        } else {
          setPredictions([]);
          setShowDropdown(false);
        }
      }
    );
  }, []);

  // Debounced input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    fetchPredictions(newValue);
  };

  // Clear input
  const handleClearInput = () => {
    setInputValue('');
    setPredictions([]);
    setShowDropdown(false);
    onPlaceSelect(null);
  };

  // Handle prediction selection
  const handlePredictionSelect = (prediction) => {
    setInputValue(prediction.description);
    setShowDropdown(false);
    setPredictions([]);
    setLoading(true);

    // Get place details
    if (placesServiceRef.current) {
      placesServiceRef.current.getDetails(
        {
          placeId: prediction.place_id,
          fields: ['formatted_address', 'geometry', 'name']
        },
        (place, status) => {
          setLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            const location = {
              address: place.formatted_address,
              name: place.name,
              coordinates: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              },
            };
            onPlaceSelect(location);
          }
        }
      );
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || predictions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, predictions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handlePredictionSelect(predictions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        inputRef={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        fullWidth
        autoComplete="off"
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#3F4E4F',
            color: '#DCD7C9',
            borderRadius: 2,
            border: '2px solid rgba(162, 123, 92, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'rgba(162, 123, 92, 0.5)',
            },
            '&.Mui-focused': {
              borderColor: '#A27B5C',
              boxShadow: '0 0 0 4px rgba(162, 123, 92, 0.1)',
            }
          },
          '& .MuiInputLabel-root': {
            color: '#A27B5C',
            '&.Mui-focused': {
              color: '#A27B5C',
            }
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon sx={{ color: '#A27B5C' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress size={20} sx={{ color: '#A27B5C' }} />
              ) : inputValue ? (
                <IconButton
                  size="small"
                  onClick={handleClearInput}
                  sx={{ color: '#A27B5C' }}
                >
                  <CloseIcon />
                </IconButton>
              ) : (
                <SearchIcon sx={{ color: 'rgba(162, 123, 92, 0.5)' }} />
              )}
            </InputAdornment>
          ),
        }}
      />

      {showDropdown && predictions.length > 0 && (
        <Paper
          ref={dropdownRef}
          sx={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            bgcolor: '#3F4E4F',
            border: '2px solid #A27B5C',
            borderRadius: 2,
            maxHeight: 300,
            overflow: 'auto',
            zIndex: 1300,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#2C3639',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#A27B5C',
              borderRadius: '4px',
              '&:hover': {
                background: '#8a6a50',
              }
            }
          }}
        >
          <List disablePadding>
            {predictions.map((prediction, index) => (
              <ListItem
                key={prediction.place_id}
                disablePadding
                sx={{
                  borderBottom: '1px solid rgba(162, 123, 92, 0.2)',
                  '&:last-child': {
                    borderBottom: 'none',
                  }
                }}
              >
                <ListItemButton
                  selected={index === selectedIndex}
                  onClick={() => handlePredictionSelect(prediction)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    '&.Mui-selected': {
                      bgcolor: '#A27B5C',
                      color: '#2C3639',
                      '&:hover': {
                        bgcolor: '#8a6a50',
                      },
                      '& .MuiListItemText-primary': {
                        fontWeight: 'bold',
                      }
                    },
                    '&:hover': {
                      bgcolor: 'rgba(162, 123, 92, 0.1)',
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: index === selectedIndex ? 'bold' : 'normal',
                          fontSize: '0.95rem'
                        }}
                      >
                        {prediction.description}
                      </Typography>
                    }
                    secondary={
                      prediction.types && prediction.types.includes('establishment') && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: index === selectedIndex ? 'rgba(44, 54, 57, 0.8)' : 'rgba(220, 215, 201, 0.6)',
                            fontSize: '0.75rem'
                          }}
                        >
                          Establishment
                        </Typography>
                      )
                    }
                  />
                  {index === selectedIndex && (
                    <KeyboardArrowUpIcon sx={{ ml: 1, color: '#2C3639' }} />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          {predictions.length > 0 && (
            <Box
              sx={{
                p: 1.5,
                bgcolor: '#2C3639',
                borderTop: '1px solid rgba(162, 123, 92, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="caption" sx={{ color: 'rgba(220, 215, 201, 0.6)', fontSize: '0.75rem' }}>
                Use ↑↓ arrows to navigate, Enter to select, Esc to close
              </Typography>
              <Typography variant="caption" sx={{ color: '#A27B5C', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {predictions.length} results
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {showDropdown && predictions.length === 0 && !loading && inputValue && (
        <Paper
          sx={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            bgcolor: '#3F4E4F',
            border: '2px solid rgba(162, 123, 92, 0.3)',
            borderRadius: 2,
            p: 3,
            zIndex: 1300,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            textAlign: 'center'
          }}
        >
          <LocationOnIcon sx={{ fontSize: '2.5rem', color: '#A27B5C', mb: 2, opacity: 0.7 }} />
          <Typography variant="body1" sx={{ color: '#DCD7C9', mb: 1, fontWeight: 'bold' }}>
            No locations found
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
            Try a different search term or check your spelling
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AddressAutocomplete;