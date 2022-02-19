import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack } from "@mui/material";
import Typography from '@mui/material/Typography';


export default function Details() {

    const [intervention, setIntervention] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const { id } = useParams();

    useEffect(() => {
        fetch("http://localhost:4000/v1/intervention/get/" + id)
            .then((response) => {
                console.log("Code de status:", response.status);
                if (response.status !== 200) { setError(response.status); }
                else { setError(null); }
                return response.json();
            })
            .then(json => {
                setIntervention(json.intervention);
                setIsLoaded(true)
            });
    }, [id])

    if (error) { return <div>Erreur {error}</div> }
    else if (!isLoaded) { return <p>Chargement...</p> }
    else {
        return (
            <>
                <h1>Fiche d'intervention</h1>
                <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2}>
                    <Typography>Numéro d'intervention : {intervention.intervention}</Typography>
                    <Link to="#">
                        <Typography>Client : {intervention.client}</Typography>
                    </Link>
                    <Link to={`/technicien/details/${intervention.matricule}`} >
                        <Typography>Technicien : {intervention.matricule}</Typography>
                    </Link>
                    <Typography>Date : {intervention.date_heure}</Typography>
                    <Typography>Etat : {intervention.etat}</Typography>
                </Stack>
                <h2>Matériels concernés</h2>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Numéro de série</TableCell>
                                <TableCell align="left">Commentaire</TableCell>
                                <TableCell align="left">Temps passé</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {intervention.materiel.map((materiel) => (
                                <TableRow key={materiel.n_serie}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{materiel.n_serie}</TableCell>
                                    <TableCell align="left">{materiel.commentaire}</TableCell>
                                    <TableCell align="left">{materiel.temps_passe}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        )
    }
}