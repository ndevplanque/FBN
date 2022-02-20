import React, { useEffect } from 'react'
import { useParams } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SubmitButtonWithAlert from '../../../components/SubmitButtonWithAlert';
import { jsonToInputDate } from '../../../functions/dateFunc'

export default function EditTechnicien(props) {
    const [technicien, setTechnicien] = React.useState({});
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState([]);
    const [alert, setAlert] = React.useState({ severity: "" });
    const { matricule } = useParams();

    useEffect(() => {
        if (matricule !== "nouveau") {
            fetch("http://localhost:4000/v1/technicien/get/" + matricule)
                .then((response) => {
                    if (response.status !== 200) { setError(response.status) };
                    if (response.status === 400) { setError(response.status + ", matricule introuvable") };
                    return response.json();
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
    } else if (!isLoaded) {
        return <p>Chargement...</p>
    }
    else {
        return (
            <>
                {// afficher le champ matricule seulement s'il s'agit d'une création
                    matricule === "nouveau"
                        ? <h2>Nouveau technicien</h2>
                        : <h2>{`Modifier ${technicien.prenom} ${technicien.nom} (${technicien.matricule})`}</h2>
                }
                <br />
                <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2} component="form" onSubmit={handleSubmit} >
                    <hr />
                    {// afficher les champs matricule nom prenom sexe seulement s'il s'agit d'une création
                        matricule === "nouveau"
                            ? <>
                                <Typography>Identité</Typography>
                                <TextField
                                    required
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

                    <Typography>Adresse</Typography>
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


                    <Typography>Parcours</Typography>
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


                    <Typography>Contacts</Typography>
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

                </Stack>
                {/* <pre>{JSON.stringify(this.state, null, 3)}</pre> */}
            </>
        )
    }

}