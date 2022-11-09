import React from "react";
import { NavLink } from "react-router-dom";
import styled from "@emotion/styled";

import Login from "./Login.js";

import tmeit_logo_nogojan_mono from "../logos/LogoTMEIT_withoutGojan_monochrome.svg";
import { kiesel_blue, kiesel_light_blue, secondary_purp, secondary_purp_dark, primary_light, accent_yellow } from "../palette.js";


export const header_height = "6rem"


const StyledHeader = styled(Header)({
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

function Header({className}) {
  return (
    <header className={className}>
      <nav>
        <NavLink to="/">
            <img id="logo" src={tmeit_logo_nogojan_mono} alt="TMEIT Logo" />
        </NavLink>
        <div className="header-rows">
            <div id="header-gradient"></div>
            <ul>
              <li>
                <NavLink to="/events" activeclassname="selected">
                  Events
                </NavLink>
              </li>
              <li>
                <NavLink to="/team" activeclassname="selected">
                  Team
                </NavLink>
              </li>
              <li id="join-navlink">
                <NavLink to="/join_tmeit" activeclassname="selected">
                  Join
                </NavLink>
              </li>
              <Login></Login>
            </ul>
        </div>
      </nav>
    </header>
  );
}

export default StyledHeader;
