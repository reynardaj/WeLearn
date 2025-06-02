import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiCheckbox from '@mui/material/Checkbox';
import { TextSm } from '../Text';

interface CheckboxProps {
  labels: string[];
  selected: string[];
  setSelected: (value: string) => void;
}

export default function Checkbox({ labels, selected, setSelected }: CheckboxProps) {
  const label = labels[0];

  return (
    <div>
      <FormGroup className='ml-5 mt-1'>
        <FormControlLabel
          control={
            <MuiCheckbox
              checked={selected.includes(label)}
              onChange={() => setSelected(label)}
              sx={{
                p: 0.2,
                '&.Mui-checked': { color: 'black' },
                '& .MuiSvgIcon-root': { fontSize: 20 },
              }}
            />
          }
          label={<TextSm>{label}</TextSm>}
        />
      </FormGroup>
    </div>
  );
}
