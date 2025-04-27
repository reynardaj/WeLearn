'use client';
import { useState } from 'react';
import Button from '@mui/material/Button';

interface PickerProps {
  options: string[]; // The list of button labels
}

export default function Picker({ options }: PickerProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Button
          key={option}
          variant="outlined"
          size="small"
          onClick={() => setSelected(option)}
          sx={{
            padding: "3px",
            paddingRight: '10px',
            paddingLeft: '10px',
            fontSize: "12px",
            color: 'black',
            borderColor: selected === option ? '#1F65A6' : '#E4E4E7',
            borderWidth: selected === option ? '2px' : '1px',
          }}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
