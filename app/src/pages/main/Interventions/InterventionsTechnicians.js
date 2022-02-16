import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import AssistantDirectionRoundedIcon from '@mui/icons-material/AssistantDirectionRounded';
import { Stack, Button } from "@mui/material"

function createData(heure_rdv, nom_client, id_intervention, libelle_materiel,
    distance_km, duree_deplacement_minutes, adresse_client, tel_client, etat) {
    return {
        heure_rdv, nom_client, id_intervention, libelle_materiel,
        distance_km, duree_deplacement_minutes, adresse_client, tel_client, etat
    };
}

const rows = [
    createData('10h00', 'Nicolas VALADE', 'INT-000111', 'Souris Logitech', 4.5, 15, '35 RUE DENIS DU PEAGE 59800 LILLE', '0762730568', 'C'),
    createData('12h00', 'Benoit MOUTON', 'INT-000112', 'Clavier Lenovo', 10, 30, '47 AVENUE DES PIES QUI CHANTENT 59000 LILLE', '0123456789', 'C'),
    createData('14h00', 'Florian BERNARD', 'INT-000113', 'Ecran Samsung', 12, 35, '59 RUE DES CHATONS 59000 LILLE', '0612489475', 'A'),
];



const mapsURL = (string) => {
    string.replaceAll("\n", " ");
    string.replaceAll(",", "%2C");
    return string;
}

export default function InterventionsTechnicians() {
    const [expanded, setExpanded] = React.useState(false);

    
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    return (<>
        <h1>Vos interventions</h1>
        {rows.map((row) => (
            <Accordion key={row.id_intervention} expanded={expanded === row.id_intervention} onChange={handleChange(row.id_intervention)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                    <Stack sx={{ flexWrap: 'wrap' }} direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                        <Typography>{row.heure_rdv}</Typography>
                        <Typography>{row.nom_client}</Typography>
                        {row.etat === 'C'
                            ? <TaskAltRoundedIcon color="success" />
                            : <></>
                        }
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack direction="column" spacing={2}>
                        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
                            {/* <Typography>Client : {row.nom_client}</Typography> */}
                            <Typography>N° intervention : {row.id_intervention}</Typography>
                            <Typography>Matériel : {row.libelle_materiel}</Typography>
                            <Typography>Adresse : {row.adresse_client}</Typography>
                            <Typography>Distance (agence) : {row.distance_km} km</Typography>
                            <Typography>Durée trajet (agence) : {row.duree_deplacement_minutes} min</Typography>
                        </Stack>
                        {row.etat !== 'C'
                            ? <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2}>
                                <Button href={"https://www.google.com/maps/dir/?api=1&destination=" +
                                    mapsURL(row.adresse_client)} startIcon={<AssistantDirectionRoundedIcon />}
                                    variant="contained" color="primary">Aller</Button>
                                <Button startIcon={<PhoneRoundedIcon />} href="tel:0762730568"
                                    variant="contained" color="success">{row.tel_client}</Button>
                                <Button startIcon={<TaskAltRoundedIcon />} href="#"
                                    variant="outlined" color="success">Finaliser</Button>
                            </Stack>
                            : <></>}
                    </Stack>
                </AccordionDetails>
            </Accordion>
        ))}
    </>
    );
}