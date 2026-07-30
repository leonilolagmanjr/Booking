import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import AddressAutocomplete from './AddressAutocomplete';

const LocationSelector = ({ location, onLocationChange }) => {
  const [selectedLocation, setSelectedLocation] = useState(location.address ? {
    address: location.address,
    coordinates: location.coordinates,
  } : null);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    const newLocation = {
      ...location,
      type,
      address: type === 'remote' ? '' : location.address,
      coordinates: type === 'remote' ? { lat: 0, lng: 0 } : location.coordinates,
    };
    onLocationChange(newLocation);
    if (type === 'remote') {
      setSelectedLocation(null);
    }
  };

  const handlePlaceSelect = useCallback((locationData) => {
    setSelectedLocation(locationData);
    onLocationChange({
      ...location,
      address: locationData.address,
      coordinates: locationData.coordinates,
    });
  }, [location, onLocationChange]);

  return (
    <div style={styles.container}>
      <label style={styles.label}>Location Type:</label>
      <div style={styles.radioGroup}>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            value="remote"
            checked={location.type === 'remote'}
            onChange={handleTypeChange}
            style={styles.radioInput}
          />
          Remote
        </label>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            value="physical"
            checked={location.type === 'physical'}
            onChange={handleTypeChange}
            style={styles.radioInput}
          />
          Physical
        </label>
      </div>
      {location.type === 'physical' && (
        <div style={styles.physicalContainer}>
          <Wrapper
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={['places']}
            render={render}
          >
            <MapComponent
              center={{ lat: 40.7128, lng: -74.0060 }}
              zoom={10}
              onLocationSelect={handlePlaceSelect}
              selectedLocation={selectedLocation}
            />
          </Wrapper>
        </div>
      )}
    </div>
  );
};

const render = (status) => {
  if (status === Status.LOADING) return <div style={styles.loadingText}>Loading map...</div>;
  if (status === Status.FAILURE) return <div style={styles.errorText}>Error loading map</div>;
  return null;
};

const MapComponent = ({ center, zoom, onLocationSelect, selectedLocation }) => {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  // Initialize map
  useEffect(() => {
    if (!map && mapRef.current && window.google) {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
      });
      setMap(mapInstance);

      // Create initial marker
      const markerInstance = new window.google.maps.Marker({
        position: center,
        map: mapInstance,
        draggable: true,
      });
      setMarker(markerInstance);

      // Add click listener to map
      mapInstance.addListener('click', (event) => {
        const position = event.latLng;
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: position }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address;
            const location = {
              address,
              coordinates: { lat: position.lat(), lng: position.lng() },
            };
            onLocationSelect(location);
            markerInstance.setPosition(position);
          }
        });
      });

      // Add dragend listener to marker
      markerInstance.addListener('dragend', (event) => {
        const position = event.latLng;
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: position }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address;
            const location = {
              address,
              coordinates: { lat: position.lat(), lng: position.lng() },
            };
            onLocationSelect(location);
          }
        });
      });
    }
  }, [map, center, zoom, onLocationSelect]);

  // Initialize autocomplete after map is ready
  useEffect(() => {
    if (map && inputRef.current && window.google && window.google.maps.places) {
      // Create autocomplete
      const autocompleteInstance = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['geocode'],
          fields: ['formatted_address', 'geometry', 'name']
        }
      );

      // Add place changed listener
      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();

        if (place.geometry && place.geometry.location) {
          const location = {
            address: place.formatted_address,
            coordinates: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          };

          onLocationSelect(location);

          // Update marker position
          if (marker) {
            marker.setPosition(place.geometry.location);
          }

          // Center map on selected location
          map.setCenter(place.geometry.location);
          map.setZoom(15);
        }
      });

      setAutocomplete(autocompleteInstance);

      // Cleanup
      return () => {
        if (autocompleteInstance) {
          window.google.maps.event.clearInstanceListeners(autocompleteInstance);
        }
      };
    }
  }, [map, marker, onLocationSelect]);

  // Update marker when selectedLocation changes
  useEffect(() => {
    if (marker && selectedLocation && selectedLocation.coordinates) {
      marker.setPosition(selectedLocation.coordinates);
      if (map) {
        map.setCenter(selectedLocation.coordinates);
        map.setZoom(15);
      }
    }
  }, [marker, selectedLocation, map]);

  return (
    <div style={styles.mapContainer}>
      <AddressAutocomplete
        ref={inputRef}
        value={selectedLocation?.address || ''}
        onPlaceSelect={onLocationSelect}
        placeholder="Search for a location..."
      />
      <div ref={mapRef} style={styles.map} />
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
  label: { 
    display: 'block', 
    color: '#DCD7C9', 
    marginBottom: '10px',
    fontSize: '16px',
    fontWeight: 600
  },
  radioGroup: { 
    display: 'flex', 
    gap: '20px', 
    marginBottom: '10px' 
  },
  radioLabel: { 
    color: '#DCD7C9', 
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px'
  },
  radioInput: {
    accentColor: '#A27B5C',
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  physicalContainer: { 
    marginTop: '10px' 
  },
  mapContainer: {
    height: '200px',
    marginBottom: '20px',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  map: {
    flex: 1,
    width: '100%',
    borderRadius: '8px',
    border: '2px solid rgba(162, 123, 92, 0.5)',
  },
  loadingText: {
    color: '#A27B5C',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: 'rgba(162, 123, 92, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(162, 123, 92, 0.3)'
  },
  errorText: {
    color: '#dc3545',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(220, 53, 69, 0.3)'
  },
};

export default LocationSelector;