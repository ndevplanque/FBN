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


export default function EditIntervention() {

    const [intervention, setIntervention] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const { id } = useParams();

    useEffect(() => {
        if (id !== "nouveau") {
            fetch("http://localhost:4000/v1/intervention/get/" + id)
                .then((response) => {
                    console.log("Code de status:", response.status);
                    if (response.status !== 200) { setError(response.status); }
                    else { setError(null); }
                    return response.json();
                })
                .then(json => {
                    setIntervention(json.intervention);
                    setIsLoaded(true);
                });
        } else {
            setIsLoaded(true);
        }
    }, [id]);

    handleChange(() => { })
    handleSubmit(() => { })

    if (error) { return <div>Erreur {error}</div> }
    else if (!isLoaded) { return <p>Chargement...</p> }
    else {
        return (
            <>
                {id === "nouveau" ? <h1>Nouvelle intervention</h1> : <h1>Modifier l'intervention</h1>}
                <Stack noValidate direction="column" justifyContent="center" alignItems="flex-start" spacing={2} component="form" onSubmit={this.handleSubmit} autoComplete="off">
                    <hr />
                    <TextField
                        type="date"
                        name="date_heure"
                        id="date_heure"
                        label="DateHeure"
                        value={intervention.date_heure}
                        onChange={handleChange()}
                    />

                    {/* voir comment on fait un select */}
                    <TextField
                        type="text"
                        name="technicien"
                        id="technicien"
                        label="Technicien"
                        value={technicien.technicien}
                        onChange={handleChange()}
                    />

                    {/* Materiels  []struct {
			NSerie      string `json:"n_serie"`
			Commentaire string `json:"commentaire"`
			TempsPasse  int    `json:"temps_passe"`
		} `json:"materiels"` */}


                    <TextField
                        type="text"
                        name="nom"
                        id="nom"
                        label="Nom"
                        value={technicien.nom}
                        onChange={handleChange()}
                    />
                    <TextField
                        type="text"
                        name="prenom"
                        id="prenom"
                        label="Prenom"
                        value={technicien.prenom}
                        onChange={handleChange()}
                    />


                    <Typography>Adresse</Typography>
                    <TextField
                        type="text"
                        name="adresse"
                        id="adresse"
                        label="Adresse"
                        value={technicien.adresse}
                        onChange={handleChange()}
                    />
                    <TextField
                        type="text"
                        name="codePostal"
                        id="codePostal"
                        label="Code Postal"
                        value={technicien.codePostal}
                        onChange={handleChange()}
                    />
                    <TextField
                        type="text"
                        name="ville"
                        id="ville"
                        label="Ville"
                        value={technicien.ville}
                        onChange={handleChange()}
                    />
                    <TextField
                        type="text"
                        name="pays"
                        id="pays"
                        label="Pays"
                        value={technicien.pays}
                        onChange={handleChange()}
                    />


                    <Typography>Parcours</Typography>
                    <TextField
                        type="date"
                        name="dateEmbauche"
                        id="dateEmbauche"
                        label="Date Embauche"
                        value={technicien.dateEmbauche}
                        InputLabelProps={{ shrink: true, }}
                        onChange={handleChange()}
                    />
                    <TextField
                        type="text"
                        name="qualification"
                        id="qualification"
                        label="Qualification"
                        value={technicien.qualification}
                        onChange={handleChange()}
                    />
                    <TextField
                        type="date"
                        name="dateQualification"
                        id="dateQualification"
                        label="Date Qualification"
                        value={technicien.dateQualification}
                        InputLabelProps={{ shrink: true, }}
                        onChange={handleChange()}
                    />


                    <Typography>Contacts</Typography>
                    <TextField
                        type="email"
                        name="email"
                        id="email"
                        label="Email"
                        value={technicien.email}
                        onChange={handleChange()}
                    />
                    <TextField
                        type="text"
                        name="telephone"
                        id="telephone"
                        label="Telephone"
                        value={technicien.telephone}
                        onChange={handleChange()}
                    />
                    <TextField
                        type="agence"
                        name="agence"
                        id="agence"
                        label="Agence"
                        value={technicien.agence}
                        onChange={handleChange()}
                    />


                    <hr />
                    <SubmitButtonWithAlert
                        btnVariant="contained"
                        btnColor="primary"
                        btnText="Enregistrer"
                        severity={this.state.alert.severity}
                        message={this.state.alert.message}
                    />

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