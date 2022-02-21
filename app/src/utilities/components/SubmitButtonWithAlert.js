import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars(props) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Button variant={props.btnVariant} onClick={()=>handleClick()} type="submit" color={props.btnColor}>
        {props.btnText}
      </Button>

      {props.severity !== ""
        ? <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={props.severity}>{props.message}</Alert>
        </Snackbar>
        : <></>}

      {props.severity !== "" ? <Alert severity={props.severity}>{props.message}</Alert> : <></>}
    </>
  );
}
