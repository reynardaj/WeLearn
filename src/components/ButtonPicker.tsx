'use client';
import { Button } from '@mui/material';
import { TextMd } from './Text';

interface PickerProps {
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
}

export default function Picker({ options, selected, onSelect }: PickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Button
          key={option}
          variant="outlined"
          size="small"
          onClick={() => onSelect(option)}
          sx={{
            padding: "3px",
            paddingRight: '10px',
            paddingLeft: '10px',
            fontSize: "12px",
            color: 'black',
            borderColor: selected === option ? '#1F65A6' : '#E4E4E7',
            borderWidth: selected === option ? '2px' : '1px',
            textTransform: 'capitalize'
          }}
        >
          <TextMd>
            {option}
          </TextMd>
        </Button>
      ))}
    </div>
  );
}
