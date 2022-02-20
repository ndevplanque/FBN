import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import MuiAlert from '@mui/material/Alert';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function TextFieldWithCheckButton(props) {
    return (
        <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}      >
            <TextField
                type={props.type}
                name={props.name} id={props.id} label={props.label}
                value={props.value}
                onChange={props.onChange()} />
            <IconButton onClick={() => props.searchFunction()} aria-label="search">
                <SearchIcon />
            </IconButton>
            {props.severity !== "" ? <Alert severity={props.severity}>{props.message}</Alert> : <></>}
        </Stack>
    );
}
