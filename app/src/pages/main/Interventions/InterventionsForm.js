import React from "react";
import { TextField, Button, Stack } from "@mui/material";

/* 
INTERVENTION (n_intervention, date_heure, n_matricule, n_client) 
    foreign key (n_matricule) references technicien (n_matricule) 
    foreign key (n_client) references client (n_client) 
*/


const InterventionsForm = () => {
    return (
        <>
            <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                <h1>Intervention</h1>
                <form>
                    <TextField id="identifier" label="Username" type="text" name="identifier" />
                    <TextField id="password" label="Password" type="text" name="password" />
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                        <Button variant="contained" color="primary" type="submit">Enregistrer</Button>
                        <Button variant="outlined" color="primary" type="button">Annuler</Button>
                    </Stack>
                </form>
            </Stack>

        </>
    )
};


export default InterventionsForm;