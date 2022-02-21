import React from "react";
import { BrowserRouter, Routes, Route, Redirect } from "react-router-dom";

import Home from "./Home/Home";

import InterventionsList from "./Interventions/InterventionsList";
import InterventionDetails from "./Interventions/InterventionDetails";
import InterventionEdit from "./Interventions/InterventionEdit";

import TechniciansList from "./Technicians/TechniciansList";
import TechnicianDetails from "./Technicians/TechnicianDetails";
import TechnicianEdit from "./Technicians/TechnicianEdit";

import LoginPage from "./LoginPage";
import Navigation from './Navigation';
import './App.css';

export default function App() {

  const [loggedIn, setLoggedIn] = React.useState(true);

  return (
    <div className="App">
      <br />
      <BrowserRouter>
        <Routes>
          <Route path="/" element=
            {// si l'utilisateur n'est pas connecté, le rediriger vers la page de connexion
              loggedIn
                ? <Navigation />
                : <LoginPage/>
            }>

            <Route index element={<Home />} />

            <Route path="techniciens" element={<TechniciansList />} />
            <Route path="technicien/:matricule" element={<TechnicianEdit />} />
            <Route path="technicien/details/:matricule" element={<TechnicianDetails />} />

            <Route path="interventions" element={<InterventionsList />} />
            <Route path="intervention/:id" element={<InterventionEdit />} />
            <Route path="intervention/details/:id" element={<InterventionDetails />} />

            <Route path="*" element={<><h1>Erreur 404</h1><p>Page introuvable</p></>} />
          </Route>
        </Routes>
      </BrowserRouter>
      <br />
    </div>
  );
}