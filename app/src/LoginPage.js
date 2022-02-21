import React from "react";
import { TextField, Button, Stack } from "@mui/material";

export default function LoginPage(props) {
    return (
        <>
            <Stack direction="column" component="form" justifyContent="center" alignItems="center" spacing={2}>
                <h1>MAIS CONNECTE-TOI BORDEL</h1>
                <br/>
                <TextField id="identifier" label="Username" type="text" name="identifier" />
                <TextField id="password" label="Password" type="text" name="password" />
                <Button variant="contained" color="primary" type="submit">Se connecter</Button>
            </Stack>
        </>
    )
};