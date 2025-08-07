import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dispatch, SetStateAction } from 'react';

interface DateFieldProps {
  label: string;
  value: Date | null;
  setValue: Dispatch<SetStateAction<Date | null>>;
}

const DateField = ({ label, value, setValue }: DateFieldProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={value}
        onChange={(newDate) => {
          setValue(newDate);
        }}
        renderInput={(params) => <TextField
          {...params} fullWidth
          required
        />}
      />
    </LocalizationProvider>
  );
};

export default DateField;
