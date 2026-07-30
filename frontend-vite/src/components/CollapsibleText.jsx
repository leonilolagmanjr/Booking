import React, { useState } from 'react';
import { Typography, Button, Box } from '@mui/material';

const CollapsibleText = ({ text, limit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= limit) {
    return <Typography variant="body2" sx={{ 
      mt: 1, 
      color: '#DCD7C9',
      lineHeight: 1.6
    }}>{text}</Typography>;
  }

  return (
    <Box>
      <Typography variant="body2" sx={{ 
        mt: 1, 
        color: '#DCD7C9',
        lineHeight: 1.6
      }}>
        {isExpanded ? text : `${text.substring(0, limit)}...`}
      </Typography>
      <Button 
        onClick={() => setIsExpanded(!isExpanded)} 
        size="small"
        sx={{ 
          color: '#A27B5C',
          fontWeight: 500,
          fontSize: '0.8rem',
          p: 0.5,
          minWidth: 'auto',
          textTransform: 'none',
          '&:hover': {
            bgcolor: 'rgba(162, 123, 92, 0.1)',
            borderRadius: '4px'
          }
        }}
      >
        {isExpanded ? 'Read less' : 'Read more'}
      </Button>
    </Box>
  );
};

export default CollapsibleText;