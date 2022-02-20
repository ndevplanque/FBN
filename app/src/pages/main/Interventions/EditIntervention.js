import React, { useEffect } from 'react'
import { useParams } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextFieldWithCheckButton from '../../../components/TextFieldWithCheckButton';
import SubmitButtonWithAlert from '../../../components/SubmitButtonWithAlert';
import { jsonToLocaleDate, timeOptions } from '../../../functions/dateFunc';


const options = timeOptions(8, 17, 4);

export default function EditIntervention(props) {

    const [intervention, setIntervention] = React.useState([]);
    const [isLoaded, setIsLoaded] = React.useState(false);

    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState([]);

    const [materiels, setMateriels] = React.useState([]);
    const [materielLoaded, setMaterielLoaded] = React.useState(true);
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
            setIsLoaded(true);
            setIntervention({ date: "", heure: "08:00:00", id_client: "", etat: 1 });
        }

    }, [id, options])

    function getMateriels(value) {
        setMaterielLoaded(false);
        fetch("http://localhost:4000/v1/materiels/" + value)
            .then((response) => {
                if (response.status !== 200) {
                    setClientAlert({
                        severity: "error",
                        message: "Client introuvable"
                    });
                    setMaterielLoaded(true);
                };
                return response.json();
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
                } else {
                    setMateriels([]);
                    setClientAlert({
                        severity: "error",
                        message: "Aucun matériel pour ce client"
                    })
                }
                setMaterielLoaded(true);
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
                <hr />
                {// Afficher champ client si c'est une nouvelle intervention
                    id === "nouveau"
                        ? <>
                            <TextFieldWithCheckButton
                                type="text"
                                name="id_client" id="id-client" label="Client"
                                value={intervention.id_client}
                                onChange={() => handleChange()}
                                searchFunction={() => getMateriels(intervention.id_client)}
                                severity={clientAlert.severity}
                                message={clientAlert.message}
                            />
                        </>
                        : <></>}

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
                        value={intervention.heure}
                        onChange={handleChange()}>
                        {options.map((option) => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}
                    </TextField>
                </Stack>


                {// Ne pas afficher les champs etat et technicien si c'est une nouvelle intervention
                    id === "nouveau"
                        ? <></>
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



                <TableContainer component={Paper}>
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
                                <TableRow key={materiel.n_serie}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: "pointer" }}
                                    onClick={() => { toggleCheckbox("cb" + materiel.n_serie) }} >
                                    <TableCell scope="row">
                                        <input type="checkbox"
                                            name={materiel.n_serie} id={"cb" + materiel.n_serie}
                                            onChange={handleChange()} />
                                    </TableCell>
                                    <TableCell component="th" scope="row">{materiel.n_serie}</TableCell>
                                    <TableCell align="left">{materiel.emplacement}</TableCell>
                                    <TableCell align="left">{materiel.prix_vente}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>



                <hr />
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