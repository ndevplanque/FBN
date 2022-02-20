
import React, { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack, Button } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';


export default function Interventions(props) {
    const [interventions, setInterventions] = React.useState([]);
    const [error, setError] = React.useState(null);

    useEffect(() => {
        fetch("http://localhost:4000/v1/interventions")
            .then((response) => {
                console.log("Code de status:", response.status)
                if (response.status !== 200) { setError(response.status); }
                else { setError(null); }
                return response.json();
            })
            .then(json => setInterventions(json.interventions))
    }, [])
    if (error) { return <div>Erreur {error.message}</div> }
    else {
        return (
            <>
                <h1>Interventions</h1>
                <br />
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                    <Button href="intervention/nouveau" variant="contained" color="primary">Ajouter</Button>
                </Stack>
                <br />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Numéro</TableCell>
                                <TableCell align="left">Client</TableCell>
                                <TableCell align="left">Technicien</TableCell>
                                <TableCell align="left">Date</TableCell>
                                <TableCell align="left">Etat</TableCell>
                                <TableCell align="left"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {interventions.map((intervention) => (
                                <TableRow key={intervention.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor:"pointer" }}
                                    onClick={() => { document.location = "/intervention/details/" + intervention.id }}
                                >
                                    <TableCell component="th" scope="row">{intervention.id}</TableCell>
                                    <TableCell align="left">{intervention.id_client}</TableCell>
                                    <TableCell align="left">{intervention.matricule}</TableCell>
                                    <TableCell align="left">{intervention.date_heure}</TableCell>
                                    <TableCell align="left">{intervention.etat}</TableCell>
                                    <TableCell align="left">
                                        <IconButton aria-label="edit" href={"/intervention/" + intervention.id} >
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        )
    }
}

