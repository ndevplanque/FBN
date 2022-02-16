import React, { Fragment, Component } from 'react'
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default class Edit extends Component {
    state = {
        technicien: {},
        isLoaded: false,
        error: null,
        errors: [],
        matricule: "",
    }

    constructor(props) {
        const index = window.location.href.split("/").length - 1;
        const matricule = window.location.href.split("/")[index].split("?")[0];
        super(props);
        this.state = {
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
            matricule: matricule,
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

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(this.state.technicien),
        }
        fetch("http://localhost:4000/v1/admin/edittechnicien", requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
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
        if (this.state.matricule !== "nouveau") {
            fetch("http://localhost:4000/v1/technicien/" + this.state.matricule)
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
                            matricule: this.state.matricule,
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
            // if(this.state.matricule=="nouveau"){
            //     technicien.dateEmbauche="2020-01-01";
            //     technicien.dateQualification="2020-01-01";
            // }
            return (
                <>
                    <h2>Ajouter/modifier un technicien</h2>
                    <br />
                    <Stack noValidate direction="column" justifyContent="center" alignItems="flex-start" spacing={2} component="form" onSubmit={this.handleSubmit} autoComplete="off">
                        <hr />


                        <Typography>Identité</Typography>
                        <TextField
                            required
                            id="matricule"
                            label="Matricule"
                            value={technicien.matricule}
                            onChange={this.handleChange}
                            error={this.hasError("matricule")}
                            helperText={this.hasError("matricule") ? "Matricule incorrect." : ""}
                        />
                        <TextField
                            type="text"
                            id="sexe"
                            label="Sexe"
                            value={technicien.sexe}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="text"
                            id="nom"
                            label="Nom"
                            value={technicien.nom}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="text"
                            id="prenom"
                            label="Prenom"
                            value={technicien.prenom}
                            onChange={this.handleChange}
                        />


                        <Typography>Adresse</Typography>
                        <TextField
                            type="text"
                            id="adresse"
                            label="Adresse"
                            value={technicien.adresse}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="text"
                            id="codePostal"
                            label="Code Postal"
                            value={technicien.codePostal}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="text"
                            id="ville"
                            label="Ville"
                            value={technicien.ville}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="text"
                            id="pays"
                            label="Pays"
                            value={technicien.pays}
                            onChange={this.handleChange}
                        />


                        <Typography>Parcours</Typography>
                        <TextField
                            type="date"
                            id="dateEmbauche"
                            label="Date Embauche"
                            value={technicien.dateEmbauche}
                            InputLabelProps={{ shrink: true, }}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="text"
                            id="qualification"
                            label="Qualification"
                            value={technicien.qualification}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="date"
                            id="dateQualification"
                            label="Date Qualification"
                            value={technicien.dateQualification}
                            InputLabelProps={{ shrink: true, }}
                            onChange={this.handleChange}
                        />


                        <Typography>Contacts</Typography>
                        <TextField
                            type="email"
                            id="email"
                            label="Email"
                            value={technicien.email}
                            onChange={this.handleChange}
                        />
                        <TextField
                            type="text"
                            id="telephone"
                            label="Telephone"
                            value={technicien.telephone}
                            onChange={this.handleChange}
                        />


                        <hr />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Enregistrer
                        </Button>
                    </Stack>
                    {/* <pre>{JSON.stringify(this.state, null, 3)}</pre> */}
                </>
            )
        }
    }
}

