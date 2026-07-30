import React, { useState, useEffect } from "react";
import { Slider, Box, Typography, Button } from "@mui/material";

export default function SliderCaptcha({ onPass }) {
  const [value, setValue] = useState(0);
  const [target, setTarget] = useState({ min: 0, max: 0 });
  const [verified, setVerified] = useState(false);
  const [msg, setMsg] = useState("");

  const randomize = () => {
    const width = 10; // fixed size
    const start = Math.floor(Math.random() * (100 - width));
    setTarget({ min: start, max: start + width });
    setValue(0);
    setVerified(false);
    setMsg("");
  };

  useEffect(() => { randomize(); }, []);

  const handleVerify = () => {
    if (value >= target.min && value <= target.max) {
      setVerified(true);
      onPass && onPass();
    } else {
      randomize();
    }
  };

  return (
    <Box sx={{ 
      width: 300, 
      textAlign: "center", 
      p: 3,
      bgcolor: '#3F4E4F',
      borderRadius: '8px',
      border: '2px solid rgba(162, 123, 92, 0.3)'
    }}>
      <Typography variant="subtitle1" sx={{ 
        mb: 2,
        color: '#DCD7C9',
        fontWeight: 500
      }}>
        Drag the slider into the highlighted zone to verify
      </Typography>
      <Box sx={{ position: "relative", mb: 3 }}>
        <Box
          sx={{
            position: "absolute",
            left: `${target.min}%`,
            width: `${target.max - target.min}%`,
            height: 8,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: verified ? '#4caf50' : '#A27B5C',
            borderRadius: 1,
            opacity: verified ? 0.9 : 0.7,
          }}
        />
        <Slider
          value={value}
          onChange={(e, val) => !verified && setValue(val)}
          min={0}
          max={100}
          disabled={verified}
          sx={{ 
            color: verified ? '#4caf50' : '#A27B5C', 
            height: 8,
            '& .MuiSlider-track': {
              backgroundColor: verified ? '#4caf50' : '#A27B5C',
            },
            '& .MuiSlider-thumb': {
              backgroundColor: verified ? '#4caf50' : '#DCD7C9',
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 8px rgba(162, 123, 92, 0.16)',
              }
            }
          }}
        />
      </Box>
      <Button
        variant="contained"
        sx={{
          bgcolor: verified ? '#4caf50' : '#A27B5C',
          color: verified ? '#2C3639' : '#2C3639',
          fontWeight: 600,
          '&:hover': {
            bgcolor: verified ? '#388e3c' : '#8a6a50',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(162, 123, 92, 0.4)'
          },
          '&:disabled': {
            bgcolor: 'rgba(63, 78, 79, 0.7)',
            color: 'rgba(220, 215, 201, 0.5)'
          }
        }}
        onClick={handleVerify}
        disabled={verified}
      >
        {verified ? "Verified ✓" : "Verify"}
      </Button>
      {verified && (
        <Typography sx={{ 
          mt: 2, 
          color: '#4caf50',
          fontWeight: 500,
          fontSize: '0.9rem'
        }}>
          Verification successful!
        </Typography>
      )}
    </Box>
  );
}