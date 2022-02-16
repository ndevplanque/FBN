import { BrowserRouter, Routes, Route } from "react-router-dom";

import Clients from "./pages/main/Clients";
import Contracts from "./pages/main/Contracts";
import Home from "./pages/main/Home/Home";
import Interventions from "./pages/main/Interventions/Interventions";
import InterventionsNew from "./pages/main/Interventions/InterventionsNew";
import InterventionsForm from "./pages/main/Interventions/InterventionsForm";
import Materials from "./pages/main/Materials";
import Technicians from "./pages/main/Technicians/Technicians";
import EditTechnician from "./pages/main/Technicians/EditTechnician";

import Agency from "./pages/secondaries/Agency";
import LoginPage from "./pages/secondaries/LoginPage";
import Logout from "./pages/secondaries/Logout";
import Profile from "./pages/secondaries/Profile";
import Support from "./pages/secondaries/Support";

import Err404 from "./pages/errors/Err404";

import Mask from './components/Mask/Mask';
import './App.css';

const App = () => {
  // type utilisateur (technicien, gerant, autres/pas co )
  var role = "gerant";

  switch (role) {
    case "technicien":
    case "gerant":
      return (
        <div className="App">
          <br/>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Mask role={role} />}>
                <Route index element={<Home role={role} />} />
                {/*<Route path="authentification" element={<LoginPage />} /> */}
                
                {/* pages/main */}
                <Route path="clients" element={<Clients />} />
                <Route path="contrats" element={<Contracts />} />
                <Route path="techniciens" element={<Technicians />} />
                <Route path={"technicien/:matricule"} element={<EditTechnician />} />
                <Route path="interventions" element={<Interventions role={role} />} />
                <Route path="interventions/affecter" element={<InterventionsNew />} />
                <Route path="interventions/completer" element={<InterventionsForm />} />
                <Route path="materiel" element={<Materials />} />

                {/* pages/secondaries */}
                <Route path="agence" element={<Agency />} />
                <Route path="profil" element={<Profile />} />
                <Route path="support" element={<Support />} />
                <Route path="deconnexion" element={<Logout />} />

                {/* pages/errors */}
                <Route path="*" element={<Err404 />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <br/>
        </div>
      );
    default:
      return <LoginPage />;
  }
}

export default App;