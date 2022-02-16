import { Link } from 'react-router-dom';
// link est le composant d'un lien cliquable 
const TopLinks = (props) => {
    const role = props.role;
    switch (role) {
        case "technicien":
            return <TechnicienLinks />;
        case "gerant":
            return <GerantLinks />;
        default:
            return <></>;
    }
}

const BottomLinks = (props) => {
    const role = props.role;
    switch (role) {
        case "technicien":
        case "gerant":
            return <HelpLinks />;
        default:
            return <></>
    }
}

export { TopLinks, BottomLinks };



const TechnicienLinks = () => {
    return (
        <>
            <ul>
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/interventions">Interventions</Link></li>
            </ul>
        </>
    )
}

const GerantLinks = () => {
    return (
        <>
            <ul>
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/clients">Client</Link></li>
                <li><Link to="/contrats">Contrats</Link></li>
                <li><Link to="/techniciens">Techniciens</Link></li>
                <li><Link to="/interventions">Interventions</Link></li>
                <li><Link to="/materiel">Matériel</Link></li>
            </ul>
        </>
    )
}

const HelpLinks = () => {
    return (
        <>
            <ul>
                <li><Link to="/agence">Mon agence</Link></li>
                <li><Link to="/profil">Mon profil</Link></li>
                <li><Link to="/support">Assistance</Link></li>
                <li><Link to="/deconnexion">Déconnexion</Link></li>
            </ul>
        </>
    )
}