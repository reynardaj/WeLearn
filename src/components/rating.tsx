import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

export default function BasicRating() {
  const [value] = React.useState<number | null>(5);

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