import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AlertDialogSlide(props) {
    const [severity, setSeverity] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const handleDialogClickOpen = () => { setDialogOpen(true); };
    const handleDialogClose = () => { setDialogOpen(false); };
    const handleDialogConfirmed = () => {
        setDialogOpen(false);
        fetch(props.deleteUrl, { method: "GET" })
            .then(response => {
                if (response.ok) {
                    props.onDelete();
                } else {
                    setSeverity("error");
                    setMessage("Echec");
                    setSnackbarOpen(true);
                }
            })
    };


    {/* <DeleteButtonWithConfirm
            titre={`Supprimer ${technicien.prenom} ${technicien.nom} (${technicien.matricule}) ?`}
            message="Êtes-vous sûr ?"
            deleteUrl={`http://localhost:4000/v1/technicien/delete/${technicien.matricule}`}
            onClick={(evt)=>evt.preventDefault()}
            onDelete={() => {
                setTechniciens(techniciens.filter(item => item.matricule !== technicien.matricule))
            }}
        /> */}
                                                    
    return (
        <>
            <IconButton onClick={handleDialogClickOpen} aria-label="delete">
                <DeleteIcon />
            </IconButton>
            <Dialog
                open={dialogOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleDialogClose}
            >
                <DialogTitle>{props.titre}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {props.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogConfirmed}>Supprimer</Button>
                    <Button onClick={handleDialogClose}>Annuler</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={severity} >
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
}
