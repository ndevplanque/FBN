import React, { useEffect } from 'react'
import { useParams } from "react-router-dom";
import {
    TextField, Stack, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, MenuItem, IconButton,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import SubmitButtonWithAlert from '../utilities/components/SubmitButtonWithAlert';
import { jsonToInputDate, jsonToLocaleDate, makeTimeOptions } from '../utilities/functions/datetime';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const timeOptions = makeTimeOptions(8, 17, 4);

export default function EditIntervention(props) {

    const [intervention, setIntervention] = React.useState([]);
    const [isLoaded, setIsLoaded] = React.useState(false);

    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState([]);

    const [clientOption, setClientOption] = React.useState([
        { "value": 1, "label": "client plusieurs matériels" },
        { "value": 2, "label": "client un seul matériel" },
        { "value": 3, "label": "client sans matériel" },
        { "value": 99, "label": "id_client inexistant" },
        { "value": "test", "label": "id_client de type string" }
    ]);
    const [materiels, setMateriels] = React.useState([]);
    const [materielLoaded, setMaterielLoaded] = React.useState(false);
    const [clientAlert, setClientAlert] = React.useState({ severity: "" });

    const [alert, setAlert] = React.useState({ severity: "" });
    const { id } = useParams();


    useEffect(() => {
        if (id !== "nouveau") {
            // fetch("http://localhost:4000/v1/intervention/get/" + id)
            //     .then((response) => {
            //         if (response.status !== 200) { setError(response.status) };
            //         if (response.status === 400) { setError(response.status + ", matricule introuvable") };
            //         return response.json();
            //     })
            //     .then(json => {
            //         json.technicien.date_embauche = jsonToInputDate(json.technicien.date_embauche);
            //         json.technicien.date_qualification = jsonToInputDate(json.technicien.date_qualification);
            //         setTechnicien(json.technicien);
            //         setIsLoaded(true)
            //     });
        } else {
            setIntervention({ etat: 1, heure: "", date: "", id_client: "" });
            setError(null);
            setIsLoaded(true);
        }

    }, [id])

    function getMateriels(value) {
        setMaterielLoaded(false);
        setMateriels([]);
        fetch("http://localhost:4000/v1/materiels/" + value)
            .then((response) => {
                if (response.status !== 200) setClientAlert({
                    severity: "error",
                    message: "Client introuvable"
                });
                else return response.json();
            })
            .then(json => {
                if (json.materiels) {
                    json.materiels.map((_, index) => {
                        json.materiels[index].date_vente = jsonToLocaleDate(json.materiels[index].date_vente);
                        json.materiels[index].date_installation = jsonToLocaleDate(json.materiels[index].date_installation);
                    });
                    setMateriels(json.materiels);
                    setClientAlert({
                        severity: ""
                    })
                    setMaterielLoaded(true);
                } else {
                    setClientAlert({
                        severity: "error",
                        message: "Aucun matériel pour ce client"
                    })
                }
            })

    }

    const handleSubmit = (evt) => {
        evt.preventDefault();

        let errors = [];
        // if (technicien.matricule === "") { errors.push("matricule"); }
        setErrors(errors);
        if (errors.length > 0) { return false; }

        // const data = new FormData(evt.target);
        // const payload = Object.fromEntries(data.entries());
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(intervention),
        }
        fetch("http://localhost:4000/v1/intervention/edit/" + id, requestOptions)
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
        setIntervention({ ...intervention, [name]: value, });
    }

    const clientHandle = () => (evt) => {
        setIntervention({ ...intervention, ["id_client"]: evt.target.value, });
        getMateriels(evt.target.value);
    }


    function toggleCheckbox(checkboxId) {
        let input = document.getElementById(checkboxId);
        input.checked = !input.checked;
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
        return (<>

            {// Afficher le titre qui convient
                id === "nouveau"
                    ? <h1>Nouvelle intervention</h1>
                    : <h1>Modifier l'intervention</h1>}
            <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2} component="form" onSubmit={handleSubmit} >

                <br /><br /><br />


                {/* Date et heure */}
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                    <TextField
                        type="date"
                        name="date" id="date" label="Date"
                        value={intervention.date}
                        InputLabelProps={{ shrink: true, }}
                        onChange={handleChange()} />

                    <TextField
                        select
                        name="heure" id="heure" label="Heure"
                        sx={{ width: '15ch', textAlign: 'left' }}
                        value={intervention.heure}
                        onChange={handleChange()}>
                        {timeOptions.map((option) => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}
                    </TextField>
                </Stack>

                { // Nouvelle intervention : champ client
                    // Sinon : champ etat et champ technicien
                    id === "nouveau"
                        ? <>
                            <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                                <TextField
                                    select
                                    name="id_client" id="client" label="Client"
                                    sx={{ width: '35ch', textAlign: 'left' }}
                                    value={intervention.id_client}
                                    onChange={clientHandle()}>
                                    {clientOption.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Stack>
                            {clientAlert.severity !== ""
                                ? <Alert severity={clientAlert.severity}>{clientAlert.message}</Alert>
                                : <></>}
                        </>
                        : <>
                            <TextField
                                type="text"
                                name="etat" id="etat" label="Etat"
                                value={intervention.etat}
                                onChange={handleChange()} />
                            <TextField
                                type="text"
                                name="technicien" id="technicien" label="Technicien"
                                value={intervention.matricule}
                                onChange={handleChange()} />
                        </>
                }

                { // n'afficher le tableau qu'une fois tous les matériels chargées
                    materielLoaded
                        ? <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left"></TableCell>
                                        <TableCell align="left">Numéro de série</TableCell>
                                        <TableCell align="left">Emplacement</TableCell>
                                        <TableCell align="left">Prix de vente</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {materiels.map((materiel) => (
                                        <TableRow className="clickable-row" key={materiel.n_serie}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            onClick={() => { toggleCheckbox("cb" + materiel.n_serie) }} >
                                            <TableCell scope="row">
                                                <input type="checkbox"
                                                    name={materiel.n_serie} id={"cb" + materiel.n_serie}
                                                    onChange={handleChange()}
                                                    onClick={() => { toggleCheckbox("cb" + materiel.n_serie) }} />
                                            </TableCell>
                                            <TableCell component="th" scope="row">{materiel.n_serie}</TableCell>
                                            <TableCell align="left">{materiel.emplacement}</TableCell>
                                            <TableCell align="left">{materiel.prix_vente}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        : <></>}


                <br /><br />

                <SubmitButtonWithAlert
                    btnVariant="contained"
                    btnColor="primary"
                    btnText="Enregistrer"
                    severity={alert.severity}
                    message={alert.message}
                />

            </Stack>
        </>)
    }
}