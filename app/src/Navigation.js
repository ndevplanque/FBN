import { Outlet, Link } from "react-router-dom";


export default function Navigation() {
  return (
    <>
      <nav id="side-nav">
        <section>
          <div><br/><br/><br/><br/><br/>Logo<br/><br/><br/><br/><br/></div>
          <hr />
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/techniciens">Techniciens</Link></li>
            <li><Link to="/interventions">Interventions</Link></li>
          </ul>
        </section>
      </nav>
      <main><Outlet /></main>
    </>
  )
};
