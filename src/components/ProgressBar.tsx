"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { TextSm } from './Text';

interface Props {
  count: number;
  total: number;
  label: string;
}

export default function ProgressBar({ count, total, label }: Props) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', width: '90%', alignItems: 'center', gap: '0.5vw' }}>
      <TextSm>{label}</TextSm>
      <LinearProgress
        variant="determinate"
        value={percentage}
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
      <TextSm>{`(${count})`}</TextSm>
    </Box>
  );
}
