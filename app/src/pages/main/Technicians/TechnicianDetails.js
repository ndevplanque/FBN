import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Stack } from "@mui/material";
import Typography from '@mui/material/Typography';
import { jsonToLocaleDate } from '../../../functions/dateFunc'


export default function TechnicianDetails() {

    const [technicien, setTechnicien] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const { matricule } = useParams();

    useEffect(() => {
        fetch("http://localhost:4000/v1/technicien/get/" + matricule)
            .then((response) => {
                console.log("Code de status:", response.status);
                if (response.status !== 200) { setError(response.status); }
                else { setError(null); }
                return response.json();
            })
            .then(json => {
                setTechnicien(json.technicien);
                setIsLoaded(true)
            });
    }, [matricule]);

    if (error) { return <div>Erreur {error}</div> }
    else if (!isLoaded) { return <p>Chargement...</p> }
    else {

        return (
            <>
                <h1>Technicien</h1>
                <h2>{`${technicien.prenom} ${technicien.nom} (${technicien.matricule})`}</h2>
                <Stack sx={{ marginTop:"50px" }} direction="column" justifyContent="center" alignItems="flex-start" spacing={2}>
                    <h3>Données professionnelles</h3>
                    <Typography>Date d'embauche : {jsonToLocaleDate(technicien.date_embauche)}</Typography>
                    <Typography>Qualification : {technicien.qualification}</Typography>
                    <Typography>Date de qualification : {jsonToLocaleDate(technicien.date_qualification)}</Typography>
                    <Typography>Email : {technicien.email}</Typography>
                    <Typography>Telephone : {technicien.telephone}</Typography>
                    <Typography>Agence : {technicien.code_agence}</Typography>
                    <h3>Données personnelles</h3>
                    <Typography>Sexe : {technicien.sexe}</Typography>
                    <Typography>Adresse : {technicien.adresse}</Typography>
                    <Typography>Code postal : {technicien.code_postal}</Typography>
                    <Typography>Ville : {technicien.ville}</Typography>
                    <Typography>Pays : {technicien.pays}</Typography>
                </Stack>
            </>
        )
    }
}