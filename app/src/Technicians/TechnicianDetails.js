import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Stack } from "@mui/material";
import { jsonToLocaleDate } from '../utilities/functions/datetime';


export default function TechnicianDetails() {

    const [technicien, setTechnicien] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const { matricule } = useParams();

    useEffect(() => {
        fetch("http://localhost:4000/v1/technicien/get/" + matricule)
            .then((response) => {
                console.log("Code de status:", response.status);
                if (response.status !== 200) setError(response.status);
                else {
                    setError(null);
                    return response.json();
                }

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
                <br />
                {// n'afficher les éléments que si le technicien est chargé
                    !isLoaded
                        ? <p>Chargement...</p>
                        : <>
                            <h2>{`${technicien.prenom} ${technicien.nom} (${technicien.matricule})`}</h2>
                            <br />
                            <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2}>
                                <h3>Données professionnelles</h3>
                                <p>Agence : {technicien.code_agence}</p>
                                <p>Email : {technicien.email}</p>
                                <p>Téléphone : {technicien.telephone}</p>
                                <p>Date d'embauche : {jsonToLocaleDate(technicien.date_embauche)}</p>
                                <p>Qualification : {`${technicien.qualification} (${jsonToLocaleDate(technicien.date_qualification)})`}</p>
                                <h3>Données personnelles</h3>
                                <p>Sexe : {technicien.sexe}</p>
                                <p>Adresse : {technicien.adresse}</p>
                                <p>Code postal : {technicien.code_postal}</p>
                                <p>Ville : {technicien.ville}</p>
                                <p>Pays : {technicien.pays}</p>
                            </Stack>
                        </>}
            </>
        )
    }
}