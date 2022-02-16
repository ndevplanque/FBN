import SideNav from "../SideNav/SideNav";
import { Outlet } from "react-router-dom";

const Mask = (props) => {
  const role = props.role;
  return (
    <>
      <SideNav role={role} />
      <main><Outlet /></main>
    </>
  )
};

export default Mask;

