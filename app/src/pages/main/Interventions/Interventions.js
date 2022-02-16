import InterventionsTechnicians from "./InterventionsTechnicians"
//import InterventionsManagers from "./InterventionsManagers"

const Interventions = (props) => {
    const role = props.role;
    switch (role) {
        case "technicien":
            return <InterventionsTechnicians />;
        case "gerant":
            // return <InterventionsManagers />;
            return <InterventionsTechnicians />;
        default:
            return <></>;
    }
};

export default Interventions;

