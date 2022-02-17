import React, { Component, Fragment } from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';


export default class Technicians extends Component {

    state = {
        techniciens: [],
        isLoaded: false,
    };


    componentDidMount() {
        fetch("http://localhost:4000/v1/techniciens")
            .then((response) => {
                console.log("Code de status:", response.status)
                if (response.status !== 200) {
                    let err = Error;
                    Error.message = response.status;
                    this.setState({ error: err });
                }
                return response.json();
            })
            .then((json) => {
                this.setState({
                    techniciens: json.techniciens,
                    isLoaded: true,
                    error: null,
                },
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error
                        })
                    }
                )
            })
    }

    render() {

        const { techniciens, isLoaded, error } = this.state;

        if (error) {
            return <div>Erreur {error.message}</div>
        }
        else if (!isLoaded) { return <p>Chargement...</p> }
        else {
            return (
                <Fragment>
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
                                    {/* <TableCell align="left">Sexe</TableCell> */}
                                    <TableCell align="left">Nom</TableCell>
                                    <TableCell align="left">Prenom</TableCell>
                                    {/* <TableCell align="left">Adresse</TableCell> */}
                                    {/* <TableCell align="left">Code Postal</TableCell> */}
                                    {/* <TableCell align="left">Ville</TableCell> */}
                                    {/* <TableCell align="left">Pays</TableCell> */}
                                    {/* <TableCell align="left">Date Embauche</TableCell> */}
                                    {/* <TableCell align="left">Qualification</TableCell> */}
                                    {/* <TableCell align="left">Date Qualification</TableCell> */}
                                    <TableCell align="left">Email</TableCell>
                                    <TableCell align="left">Telephone</TableCell>
                                    <TableCell align="left">Agence</TableCell>
                                    <TableCell align="left"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {techniciens.map((technicien) => (
                                    // technicien.dateEmbauche = technicien.dateEmbauche.split("T")[0],
                                    // technicien.dateQualification = technicien.dateQualification.split("T")[0],
                                    <TableRow key={technicien.matricule}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">{technicien.matricule}</TableCell>
                                        {/* <TableCell align="left">{technicien.sexe}</TableCell> */}
                                        <TableCell align="left">{technicien.nom}</TableCell>
                                        <TableCell align="left">{technicien.prenom}</TableCell>
                                        {/* <TableCell align="left">{technicien.adresse}</TableCell> */}
                                        {/* <TableCell align="left">{technicien.codePostal}</TableCell> */}
                                        {/* <TableCell align="left">{technicien.ville}</TableCell> */}
                                        {/* <TableCell align="left">{technicien.pays}</TableCell> */}
                                        {/* <TableCell align="left">{technicien.dateEmbauche}</TableCell> */}
                                        {/* <TableCell align="left">{technicien.qualification}</TableCell> */}
                                        {/* <TableCell align="left">{technicien.dateQualification}</TableCell> */}
                                        <TableCell align="left">{technicien.email}</TableCell>
                                        <TableCell align="left">{technicien.telephone}</TableCell>
                                        <TableCell align="left">{technicien.agence}</TableCell>
                                        <TableCell align="left">
                                            <IconButton aria-label="edit" href={"/technicien/" + technicien.matricule} >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Fragment >
            )
        }
    }
}
