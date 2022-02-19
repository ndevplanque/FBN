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
import DeleteIconWithConfirm from '../../../components/DeleteIconWithConfirm';


export default function Technicians() {
    const [techniciens, setTechniciens] = React.useState([]);
    const [error, setError] = React.useState(null);

    useEffect(() => {
        fetch("http://localhost:4000/v1/techniciens")
            .then((response) => {
                console.log("Code de status:", response.status)
                if (response.status !== 200) { setError(response.status); }
                else { setError(null); }
                return response.json();
            })
            .then(json => setTechniciens(json.techniciens))
    }, [])

    if (error) { return <div>Erreur {error}</div> }
    else {
        return (
            <>
                <h1>Techniciens</h1>
                <br />
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
                                <TableCell align="left">Prenom</TableCell>
                                <TableCell align="left">Email</TableCell>
                                <TableCell align="left">Telephone</TableCell>
                                <TableCell align="left">Agence</TableCell>
                                <TableCell align="left"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {techniciens.map((technicien) => (
                                <TableRow key={technicien.matricule}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{technicien.matricule}</TableCell>
                                    <TableCell align="left">{technicien.nom}</TableCell>
                                    <TableCell align="left">{technicien.prenom}</TableCell>
                                    <TableCell align="left">{technicien.email}</TableCell>
                                    <TableCell align="left">{technicien.telephone}</TableCell>
                                    <TableCell align="left">{technicien.agence}</TableCell>
                                    <TableCell align="left">
                                        <IconButton aria-label="edit" href={"/technicien/" + technicien.matricule} >
                                            <EditIcon />
                                        </IconButton>
                                        <DeleteIconWithConfirm
                                            titre={`Supprimer ${technicien.prenom} ${technicien.nom} (${technicien.matricule}) ?`}
                                            message="Êtes-vous sûr ?"
                                            deleteUrl={`http://localhost:4000/v1/technicien/delete/${technicien.matricule}`}
                                            onDelete={() => {
                                                setTechniciens(techniciens.filter(item => item.matricule !== technicien.matricule))
                                            }}
                                        />
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
