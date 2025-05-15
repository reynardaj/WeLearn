import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

interface Props {
  rating: number; // ✅ Accept value as props
}

export default function BasicRating({rating}: Props) {
  const [value] = React.useState<number | null>(rating);

  return (
    <Box sx={{ '& > legend': { mt: 2 } }}>
        <Rating 
            name="read-only" 
            value={value} 
            readOnly 
            size='small'
            sx={{color: 'black'}}
        />
    </Box>
  );
}