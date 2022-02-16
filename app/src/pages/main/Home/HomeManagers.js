import * as React from 'react';
import { Stack, TextField } from "@mui/material";
import intervention from "./intervention.svg";
import kilometres from "./kilometres.svg";
import tempsPasse from "./tempsPasse.svg";
import "./HomeManagers.css";
import CustomDatePicker from '../../../components/CustomDatePicker';




const HomeManagers = () => {
    return (
        <>
            <h1>Dashboard</h1>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={3} >
                <TextField className="large-flex-item" label="Technicien" variant="outlined" />
                <CustomDatePicker className="small-flex-item" year="2020" month="10" day="15" label="Début période" id="dt_pickers1" />
                <CustomDatePicker className="small-flex-item" year="2050" month="07" day="04" label="Fin période" id="dt_pickers2" />
            </Stack>
            <div className="space"></div>
            <Stack direction="row" justifyContent="space-evenly" alignItems="center" spacing={3} >

                <section id="frameInterv" className="carres">
                    <h2>INTERVENTION</h2>
                    <span id="nbrInterv">16</span>
                    <img src={intervention} alt="icon" id="icoInterv"/>
                </section>

                <section id="frameKilo" className="carres">
                    <h2>KILOMETRES</h2>
                    <span id="kilometre">16</span>
                    <img src={kilometres} alt="icon" id="icoKilo" />
                </section>

                <section id="frameTmp" className="carres">
                    <h2>TEMPS PASSE</h2>
                    <span id="tmpPasse">16</span>
                    <img src={tempsPasse} alt="icon" id="icoTmpPasse" />
                </section>
            </Stack>
        </>
    )
};

export default HomeManagers;