"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

interface Props {
  rating: number;
  color?: 'black' | 'yellow';
}

export default function BasicRating({ rating, color = 'black' }: Props) {
  const [value] = React.useState<number | null>(rating);

  return (
    <Box sx={{ '& > legend': { mt: 2 } }}>
      <Rating 
        name="read-only" 
        value={value} 
        readOnly 
        size="small"
        sx={{ 
          color: color === 'yellow' ? '#F4B660' : 'black'
        }}
      />
    </Box>
  );
}
