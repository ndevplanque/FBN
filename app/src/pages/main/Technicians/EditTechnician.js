import React, { Fragment, Component } from 'react'
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SubmitButtonWithAlert from '../../../components/SubmitButtonWithAlert';

export default class Edit extends Component {
    state = {
        oldMatricule: "",
        technicien: {},
        isLoaded: false,
        error: null,
        errors: [],
        alert: {}
    }

    constructor(props) {
        const index = window.location.href.split("/").length - 1;
        const oldMatricule = window.location.href.split("/")[index].split("?")[0];
        super(props);
        this.state = {
            oldMatricule: oldMatricule,
            technicien: {
                matricule: "",
                sexe: "",
                nom: "",
                prenom: "",
                adresse: "",
                codePostal: "",
                ville: "",
                pays: "",
                dateEmbauche: "",
                qualification: "",
                dateQualification: "",
                email: "",
                telephone: "",
                agence: "",
            },
            isLoaded: false,
            error: null,
            errors: [],
            alert: {
                severity: "",
                message: ""
            },

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (evt) => {
        evt.preventDefault();

        let errors = [];
        if (this.state.technicien.matricule === "") {
            errors.push("matricule");
        }
        this.setState({ errors: errors });
        if (errors.length > 0) {
            return false;
        }

        const data = new FormData(evt.target);
        const payload = Object.fromEntries(data.entries());

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(payload),
        }
        fetch("http://localhost:4000/v1/technicien/edit/" + this.state.oldMatricule, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    this.setState({
                        alert: {
                            severity: "error",
                            message: "Erreur dans le formulaire"
                        }
                    })
                } else {
                    this.setState({
                        alert: {
                            severity: "success",
                            message: "Envoyé avec succès"
                        }
                    })
                }
            })
    };

    handleChange = (evt) => {
        let value = evt.target.value;
        let id = evt.target.id;
        this.setState((prevState) => ({
            technicien: {
                ...prevState.technicien,
                [id]: value,
            }
        }))
    }

    hasError(key) {
        return this.state.errors.indexOf(key) !== -1;
    }

    componentDidMount() {
        if (this.state.oldMatricule !== "nouveau") {
            fetch("http://localhost:4000/v1/technicien/get/" + this.state.oldMatricule)
                .then((response) => {
                    if (response.status !== "200") {
                        let err = Error;
                        err.Message = "Erreur " + response.status;
                        if (response.status === "400") err.Message += ", matricule introuvable";
                        this.setState({ error: err });
                    }
                    return response.json();
                })
                .then((json) => {
                    const dateEmbauche = new Date(json.technicien.dateEmbauche).toISOString().split("T")[0];
                    const dateQualification = new Date(json.technicien.dateQualification).toISOString().split("T")[0];
                    this.setState({
                        technicien: {
                            matricule: json.technicien.matricule,
                            sexe: json.technicien.sexe,
                            nom: json.technicien.nom,
                            prenom: json.technicien.prenom,
                            adresse: json.technicien.adresse,
                            codePostal: json.technicien.codePostal,
                            ville: json.technicien.ville,
                            pays: json.technicien.pays,
                            dateEmbauche: dateEmbauche,
                            qualification: json.technicien.qualification,
                            dateQualification: dateQualification,
                            email: json.technicien.email,
                            telephone: json.technicien.telephone,
                            agence: json.technicien.agence,
                        },
                        isLoaded: true,
                    },
                        (error) => {
                            this.setState({
                                isLoaded: true,
                                error,
                            })
                        }
                    )
                })
        } else {
            this.setState({ isLoaded: true });
        }
    }

    render() {
        let { technicien, isLoaded, error } = this.state;
        if (error) {
            return <div>{error.Message}</div>;
        } else if (!isLoaded) {
            return <p>Chargement...</p>
        } else {
            return (
                <>
                    <h2>Ajouter/modifier un technicien</h2>
                    <br />
                    <Stack noValidate direction="column" justifyContent="center" alignItems="flex-start" spacing={2} component="form" onSubmit={this.handleSubmit} autoComplete="off">
                        <hr />
                        <Typography>Identité</Typography>
                        <TextField
                            required
                            name="matricule"
                            id="matricule"
                            label="Matricule"
                            value={technicien.matricule}
                            onChange={this.handleChange}
                            error={this.hasError("matricule")}
                            helperText={this.hasError("matricule") ? "Matricule incorrect." : ""}
                        />

                        <TextField
                            type="text"
                            name="sexe"
                            id="sexe"
                            label="Sexe"
                            value={technicien.sexe}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="text"
                            name="nom"
                            id="nom"
                            label="Nom"
                            value={technicien.nom}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="text"
                            name="prenom"
                            id="prenom"
                            label="Prenom"
                            value={technicien.prenom}
                            onChange={this.handleChange}
                        />


                        <Typography>Adresse</Typography>
                        <TextField
                            type="text"
                            name="adresse"
                            id="adresse"
                            label="Adresse"
                            value={technicien.adresse}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="text"
                            name="codePostal"
                            id="codePostal"
                            label="Code Postal"
                            value={technicien.codePostal}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="text"
                            name="ville"
                            id="ville"
                            label="Ville"
                            value={technicien.ville}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="text"
                            name="pays"
                            id="pays"
                            label="Pays"
                            value={technicien.pays}
                            onChange={this.handleChange}
                        />


                        <Typography>Parcours</Typography>
                        <TextField
                            type="date"
                            name="dateEmbauche"
                            id="dateEmbauche"
                            label="Date Embauche"
                            value={technicien.dateEmbauche}
                            InputLabelProps={{ shrink: true, }}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="text"
                            name="qualification"
                            id="qualification"
                            label="Qualification"
                            value={technicien.qualification}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="date"
                            name="dateQualification"
                            id="dateQualification"
                            label="Date Qualification"
                            value={technicien.dateQualification}
                            InputLabelProps={{ shrink: true, }}
                            onChange={this.handleChange}
                        />


                        <Typography>Contacts</Typography>
                        <TextField
                            type="email"
                            name="email"
                            id="email"
                            label="Email"
                            value={technicien.email}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="text"
                            name="telephone"
                            id="telephone"
                            label="Telephone"
                            value={technicien.telephone}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="agence"
                            name="agence"
                            id="agence"
                            label="Agence"
                            value={technicien.agence}
                            onChange={this.handleChange}
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
                    {/* <pre>{JSON.stringify(this.state, null, 3)}</pre> */}
                </>
            )
        }
    }
}

