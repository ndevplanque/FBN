import HomeManagers from "./HomeManagers";
import HomeTechnicians from "./HomeTechnicians";

const Home = (props) => {
  var role = props.role;
  switch (role) {
    case "gerant":
      return <HomeManagers />;
    case "technicien":
      return <HomeTechnicians />;
    default:
      return <></>;
  }
};

export default Home;






