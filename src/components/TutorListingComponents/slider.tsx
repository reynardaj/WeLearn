"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import MuiSlider from '@mui/material/Slider';
import { Heading1, Heading2, Heading3, Heading4 } from '@/components/Heading';
import { TextSm } from '@/components/Text';

function valuetext(value: number) {
  return `Rp ${value.toLocaleString("en-US")}`;
}

interface RangeSliderProps {
  value: [number, number] | null;
  onChange: (val: [number, number]) => void;
}

export default function RangeSlider({ value, onChange }: RangeSliderProps) {
  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      onChange([newValue[0], newValue[1]]);
    }
  };

  const currentValue = value || [0, 300000];

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat('en-US').format(num);

  return (
    <div>
      <TextSm>Selected range: Rp. {formatRupiah(currentValue[0])} – Rp. {formatRupiah(currentValue[1])}</TextSm>

      <Box sx={{ width: 225, marginLeft: '1.5vh', marginTop: '0.5vh' }}>
        <MuiSlider
          getAriaLabel={() => 'Price range'}
          min={0}
          max={300000}
          step={1000}
          value={currentValue}
          onChange={handleChange}
          valueLabelDisplay="off"
          getAriaValueText={valuetext}
          sx={{
            '& .MuiSlider-thumb': {
              backgroundColor: "#1F65A6",
              border: "2px solid #1F252D",
              '&:hover, &.Mui-focusVisible, &.Mui-active': {
                boxShadow: "none",
              },
            },
            '& .MuiSlider-track': {
              backgroundColor: "#1F65A6",
            },
            '& .MuiSlider-rail': {
              backgroundColor: "#1F252D",
            },
          }}
        />
      </Box>

      <div className='flex gap-[13vw]'>
        <TextSm>0</TextSm>
        <TextSm>300,000</TextSm>
      </div>
    </div>
  );
}
