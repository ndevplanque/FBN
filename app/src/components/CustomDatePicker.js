import * as React from 'react';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import frLocale from 'date-fns/locale/fr';


export default function CustomDatePicker(props) {
  const mask = '__/__/____';
  const [value, setValue] = React.useState(new Date(props.year + "-" + props.month + "-" + props.day));
  const label = props.label;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
      <DatePicker
        mask={mask}
        label={label}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}