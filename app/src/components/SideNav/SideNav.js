import AppLogo from "../AppLogo/AppLogo";
import { TopLinks, BottomLinks } from './Links';
import Header from "../Header/Header";
import './SideNav.css';

const SideNav = (props) => {
    const role = props.role;
    return (
        <>
            <nav id="side-nav">
                <section>
                    <AppLogo />
                    <Header />
                    <hr />
                    <TopLinks role={role} />
                </section>
                <section>
                    <hr />
                    <BottomLinks role={role} />
                </section>
            </nav>
        </>
    )
}

export default SideNav;