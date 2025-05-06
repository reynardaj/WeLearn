"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearDeterminate() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', width: '90%', alignItems: 'center', gap: '0.5vw' }}>
        <LinearProgress
            variant="determinate"
            value={50}
            sx={{
                flex: 1,
                height: '8px',
                border: '1px solid black',
                borderRadius: '20px',
                backgroundColor: 'transparent',
                '& .MuiLinearProgress-bar': {
                    backgroundColor: 'black',
                    borderRadius: '20px',
                }
            }}
        />
        <p className='text-[14px]'>(24)</p>
    </Box>
  );
}
