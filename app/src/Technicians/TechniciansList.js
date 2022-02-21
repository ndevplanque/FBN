import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Stack, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';


export default function Technicians() {
    const [techniciens, setTechniciens] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);

    useEffect(() => {
        setIsLoaded(false);
        fetch("http://localhost:4000/v1/techniciens")
            .then((response) => {
                console.log("Code de status:", response.status)
                if (response.status !== 200) setError(response.status);
                else {
                    setError(null);
                    return response.json();
                }

            })
            .then(json => {
                setTechniciens(json.techniciens);
                setIsLoaded(true);
            })
    }, [])

    if (error) { return <div>Erreur {error}</div> }
    else {
        return (
            <>
                <h1>Techniciens</h1>
                <br />
                {// n'afficher le tableau que si les techniciens sont chargés
                    !isLoaded
                        ? <p>Chargement...</p>
                        : <>
                            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                                <Button href="technicien/nouveau" variant="contained" color="primary">Ajouter</Button>
                            </Stack>
                            <br />
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">Matricule</TableCell>
                                            <TableCell align="left">Nom</TableCell>
                                            <TableCell align="left">Prénom</TableCell>
                                            <TableCell align="left">Email</TableCell>
                                            <TableCell align="left">Téléphone</TableCell>
                                            <TableCell align="left">Agence</TableCell>
                                            <TableCell align="left"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {techniciens.map((technicien) => (
                                            <TableRow className="clickable-row" key={technicien.matricule}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                onClick={() => { document.location = "/technicien/details/" + technicien.matricule }}>
                                                <TableCell component="th" scope="row">{technicien.matricule}</TableCell>
                                                <TableCell align="left">{technicien.nom}</TableCell>
                                                <TableCell align="left">{technicien.prenom}</TableCell>
                                                <TableCell align="left">{technicien.email}</TableCell>
                                                <TableCell align="left">{technicien.telephone}</TableCell>
                                                <TableCell align="left">{technicien.code_agence}</TableCell>
                                                <TableCell align="left">
                                                    <IconButton aria-label="edit" href={"/technicien/" + technicien.matricule} >
                                                        <EditIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>}
            </>
        )
    }
}
