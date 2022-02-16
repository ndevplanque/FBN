import React from "react";
import { TextField, Button, Stack } from "@mui/material";

const LoginPage = () => {
    return (
        <form>
            <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                <h1>MAIS CONNECTE-TOI BORDEL</h1>
                <TextField id="identifier" label="Username" type="text" name="identifier" />
                <TextField id="password" label="Password" type="text" name="password" />
                <Button variant="contained" color="primary" type="submit">Se connecter</Button>
            </Stack>
        </form>
    )
};


export default LoginPage;