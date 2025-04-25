import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
}

export default function BasicDateTimePicker({ value, onChange }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker label="Select Date & Time" value={value} onChange={onChange} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
