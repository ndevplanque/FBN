import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Stack } from "@mui/material";
import Typography from '@mui/material/Typography';
import { jsonToLocaleDateTime } from '../utilities/functions/datetime'


export default function InterventionDetails() {

    const [intervention, setIntervention] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const { id } = useParams();

    useEffect(() => {
        fetch("http://localhost:4000/v1/intervention/get/" + id)
            .then((response) => {
                console.log("Code de status:", response.status);
                if (response.status !== 200) setError(response.status);
                else {
                    setError(null);
                    return response.json();
                }
            })
            .then(json => {
                json.intervention.date_heure = jsonToLocaleDateTime(json.intervention.date_heure);
                setIntervention(json.intervention);
                setIsLoaded(true)
            });
    }, [id]);

    if (error) { return <div>Erreur {error}</div> }
    else if (!isLoaded) { return <p>Chargement...</p> }
    else {
        return (
            <>
                <h1>Fiche d'intervention</h1>
                <br />
                <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2}>
                    <Typography>Numéro d'intervention : {intervention.id}</Typography>
                    <Link to="#">
                        <Typography>Client : {intervention.id_client}</Typography>
                    </Link>
                    <Link to={`/technicien/details/${intervention.matricule}`} >
                        <Typography>Technicien : {intervention.matricule}</Typography>
                    </Link>
                    <Typography>Date : {intervention.date_heure}</Typography>
                    <Typography>Etat : {intervention.etat}</Typography>
                </Stack>
                <br />
                { // si interventions.materiels !== null
                    intervention.materiels
                        ? <>
                            <h2>Matériels concernés</h2>
                            <br />
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">Numéro de contrat</TableCell>
                                            <TableCell align="left">Numéro de série</TableCell>
                                            <TableCell align="left">Emplacement</TableCell>
                                            <TableCell align="left">Commentaire</TableCell>
                                            <TableCell align="right">Temps passé</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {intervention.materiels.map((materiel) => (
                                            <TableRow key={materiel.n_serie}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">{materiel.id_contrat}</TableCell>
                                                <TableCell align="left">{materiel.n_serie}</TableCell>
                                                <TableCell align="left">{materiel.emplacement}</TableCell>
                                                <TableCell align="left">{materiel.commentaire}</TableCell>
                                                <TableCell align="right">{materiel.temps_passe} minutes</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                        : <>
                            <Button
                                href={"/intervention/" + intervention.id}
                                variant="contained"
                                color="primary"
                            >
                                Ajouter des matériels
                            </Button>
                        </>
                }
            </>
        )
    }
}