import {NavLink} from "react-router-dom";
import {Button} from "@mui/material";
import styled from "@emotion/styled";

import tmeit_logo_nogojan_mono from "../../logos/LogoTMEIT_withoutGojan_monochrome.svg";
import { kisel_blue, secondary_purp, secondary_purp_dark, primary_light, accent_yellow } from "../../palette.js";
import DesktopHeaderMenu from "./DesktopHeaderMenu.js";
import getHeaderNavItems from "./navs/HeaderNav";

export const header_height = "6rem"

const StyledDesktopHeader = styled(DesktopHeader)({
    gridRowStart: 1,
    nav: {
        height: header_height,
        display: "grid",
        gridTemplateColumns: "auto 1fr",
    },
    "#logo": {
        height: "5rem",
        marginLeft: "2vw",
        marginTop: "0.6rem",
        marginRight: "2vw",
    },
    ".header-rows": {
        height: "100%",
        display: "grid",
        gridTemplateColumns: "20vw 1fr",
        gridTemplateRows: "3rem 3rem",
    },
    "#header-gradient": {
        gridColumn: "1 / 2",
        gridRow: "2 / 3",
        height: "100%",
        background: `linear-gradient(270deg, ${secondary_purp_dark} 0%, ${secondary_purp_dark}00 100%)`,
    },
    ul: {
        gridColumn: "2 / 3",
        gridRow: "2 / 3",
        height: "100%",
        margin: 0,
        padding: 0,
        background: secondary_purp_dark,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        listStyle: "none",
        fontSize: "2rem",
    },

    a: {
        fontFamily: "'Merriweather', serif",
        fontWeight: 400
    },
    "a:link": { color: "#ffffff", textDecoration: "none" },
    "a:visited": { color: "#ffffff", textDecoration: "none" },
    "a:hover": { color: "#ffffff", textDecoration: "none" },
    "a:active": { color: "#ffffff", textDecoration: "none" },

});

function DesktopHeader({className, loggedIn, setLoginModalOpen}) {
  return (
    <header className={className}>
      <nav>
        <NavLink to="/">
            <img id="logo" src={tmeit_logo_nogojan_mono} alt="TMEIT Logo" />
        </NavLink>
        <div className="header-rows">
            <div id="header-gradient"></div>
            <ul>
                {getHeaderNavItems(false).map((item) => (<li>{item}</li>))}
                <li>
                    {loggedIn?
                        <DesktopHeaderMenu />
                        : <Button variant="contained" onClick={() => {setLoginModalOpen(true)}}>Log in</Button>
                    }
                </li>
            </ul>
        </div>
      </nav>
    </header>
  );
}

export default StyledDesktopHeader;
