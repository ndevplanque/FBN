import React, { useEffect } from 'react'
import { useParams } from "react-router-dom";
import { Stack, TextField } from '@mui/material';
import SubmitButtonWithAlert from '../utilities/components/SubmitButtonWithAlert';
import { jsonToInputDate } from '../utilities/functions/datetime';

export default function EditTechnicien(props) {
    const [technicien, setTechnicien] = React.useState({
        prenom: "",
        nom: ""
    });
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState([]);
    const [alert, setAlert] = React.useState({ severity: "" });
    const { matricule } = useParams();

    useEffect(() => {
        if (matricule !== "nouveau") {
            fetch("http://localhost:4000/v1/technicien/get/" + matricule)
                .then((response) => {
                    if (response.status === 400) setError(response.status + ", matricule introuvable");
                    else if (response.status !== 200) setError(response.status);
                    else return response.json();
                })
                .then(json => {
                    json.technicien.date_embauche = jsonToInputDate(json.technicien.date_embauche);
                    json.technicien.date_qualification = jsonToInputDate(json.technicien.date_qualification);
                    setTechnicien(json.technicien);
                    setIsLoaded(true)
                });
        } else { setIsLoaded(true); }
    }, [matricule])

    const handleSubmit = (evt) => {
        evt.preventDefault();

        let errors = [];
        if (technicien.matricule === "") { errors.push("matricule"); }
        setErrors(errors);
        if (errors.length > 0) { return false; }

        // const data = new FormData(evt.target);
        // const payload = Object.fromEntries(data.entries());
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(technicien),
        }
        fetch("http://localhost:4000/v1/technicien/edit/" + matricule, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setAlert({
                        severity: "error",
                        message: "Erreur dans le formulaire"
                    })
                } else {
                    setAlert({
                        severity: "success",
                        message: "Envoyé avec succès"
                    })
                }
            })
    };

    const handleChange = () => (evt) => {
        let value = evt.target.value;
        let name = evt.target.name;
        setTechnicien({ ...technicien, [name]: value, });
    }

    function hasError(key) {
        return errors.indexOf(key) !== -1;
    }

    if (error) {
        return <div>Erreur {error}</div>;
    } else {
        return (
            <>
                {// adapter le titre
                    matricule === "nouveau"
                        ? <h2>Nouveau technicien</h2>
                        : <>
                            <h2>Modifier le technicien</h2>
                            <h3>{`(${matricule})`}</h3>
                            <h3>{`${technicien.prenom} ${technicien.nom}`}</h3>
                        </>
                }
                <br />
                {// n'afficher le formulaire que si le technicien est chargé
                    !isLoaded
                        ? <p>Chargement...</p>
                        :
                        <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2} component="form" onSubmit={handleSubmit} >
                            <hr />
                            {// afficher les champs matricule nom prenom sexe seulement s'il s'agit d'une création
                                matricule === "nouveau"
                                    ? <>
                                        <p>Identité</p>
                                        <TextField
                                            type="text" required
                                            name="matricule" id="matricule" label="Matricule"
                                            value={technicien.matricule}
                                            onChange={handleChange()}
                                            error={hasError("matricule")}
                                            helperText={hasError("matricule") ? "Matricule incorrect." : ""} />
                                        <TextField
                                            type="text"
                                            name="sexe" id="sexe" label="Sexe"
                                            value={technicien.sexe}
                                            onChange={handleChange()} />
                                        <TextField
                                            type="text"
                                            name="nom" id="nom" label="Nom"
                                            value={technicien.nom}
                                            onChange={handleChange()} />
                                        <TextField
                                            type="text"
                                            name="prenom" id="prenom" label="Prenom"
                                            value={technicien.prenom}
                                            onChange={handleChange()} />
                                    </>
                                    : <></>
                            }

                            <p>Adresse</p>
                            <TextField
                                type="text"
                                name="adresse" id="adresse" label="Adresse"
                                value={technicien.adresse}
                                onChange={handleChange()}
                            />
                            <TextField
                                type="text"
                                name="code_postal" id="code-postal" label="Code Postal"
                                value={technicien.code_postal}
                                onChange={handleChange()}
                            />
                            <TextField
                                type="text"
                                name="ville" id="ville" label="Ville"
                                value={technicien.ville}
                                onChange={handleChange()}
                            />
                            <TextField
                                type="text"
                                name="pays" id="pays" label="Pays"
                                value={technicien.pays}
                                onChange={handleChange()}
                            />


                            <p>Parcours</p>
                            {// afficher le champ date_embauche seulement s'il s'agit d'une création
                                matricule === "nouveau"
                                    ? <TextField
                                        type="date"
                                        name="date_embauche" id="date-embauche" label="Date Embauche"
                                        value={technicien.date_embauche}
                                        InputLabelProps={{ shrink: true, }}
                                        onChange={handleChange()} />
                                    : <></>
                            }
                            <TextField
                                type="text"
                                name="qualification" id="qualification" label="Qualification"
                                value={technicien.qualification}
                                onChange={handleChange()}
                            />
                            <TextField
                                type="date"
                                name="date_qualification" id="date-qualification" label="Date Qualification"
                                value={technicien.date_qualification}
                                InputLabelProps={{ shrink: true, }}
                                onChange={handleChange()}
                            />


                            <p>Contacts</p>
                            <TextField
                                type="email"
                                name="email" id="email" label="Email"
                                value={technicien.email}
                                onChange={handleChange()} />
                            <TextField
                                type="text"
                                name="telephone" id="telephone" label="Telephone"
                                value={technicien.telephone}
                                onChange={handleChange()} />
                            <TextField
                                type="text"
                                name="code_agence" id="code-agence" label="Agence"
                                value={technicien.code_agence}
                                onChange={handleChange()} />


                            <hr />
                            <SubmitButtonWithAlert
                                btnVariant="contained"
                                btnColor="primary"
                                btnText="Enregistrer"
                                severity={alert.severity}
                                message={alert.message}
                            />

                        </Stack>}
            </>
        )
    }

}