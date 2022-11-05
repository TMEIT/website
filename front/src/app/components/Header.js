import React from "react";
import { NavLink } from "react-router-dom";

import css from 'styled-jsx/css'

import Login from "./Login.js";

import tmeit_logo_nogojan_mono from "../logos/LogoTMEIT_withoutGojan_monochrome.svg";
import { kiesel_blue, kiesel_light_blue, secondary_purp, secondary_purp_dark, primary_light, accent_yellow } from "../palette.js";


export const header_height = "6rem"

const header_style = css`
    header {
        grid-row-start: 1;
    }
    nav {
        height: ${header_height};
        display: grid;
        grid-template-columns: auto 1fr;
    }
    #logo {
        height: 5rem;
        margin-left: 2vw;
        margin-top: 0.6rem;
        margin-right: 2vw;
    }
    .header-rows {
        height: 100%;
        display: grid;
        grid-template-columns: 20vw 1fr;
        grid-template-rows: 3rem 3rem;
    }
    #gradient {
        grid-column: 1 / 2;
        grid-row: 2 / 3;
        height: 100%;
        background: linear-gradient(270deg, ${secondary_purp_dark} 0%, ${secondary_purp_dark}00 100%);
    }
    ul {
        grid-column: 2 / 3;
        grid-row: 2 / 3;
        height: 100%;
        margin: 0;
        padding: 0;
        background: ${secondary_purp_dark};
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        list-style: none;
        font-size: 2rem;
    }
`


const navlink_style = css.global`
    a.headerlink {
        height: 100%;
        font-family: 'Merriweather', serif;
        font-weight: 400;
    }
    a.joinheaderlink {
        height: 100%;
        font-family: 'Merriweather', serif;
        font-weight: 900;
        text-shadow:
            0 0.1rem 0.2rem ${kiesel_light_blue},
            0.1rem 0 0.2rem ${kiesel_light_blue},
            0 -0.1rem 0.2rem ${kiesel_light_blue},
            -0.1rem 0 0.2rem ${kiesel_light_blue};
    }
    a:link.headerlink, a:link.joinheaderlink { color: #ffffff; text-decoration: none; }
    a:visited.headerlink, a:visited.joinheaderlink { color: #ffffff; text-decoration: none; }
    a:hover.headerlink, a:hover.joinheaderlink { color: #ffffff; text-decoration: none; }
    a:active.headerlink, a:active.joinheaderlink { color: #ffffff; text-decoration: none; }
`

function Header() {
  return (
    <header>
      <nav>
        <NavLink to="/">
            <img id="logo" src={tmeit_logo_nogojan_mono} alt="TMEIT Logo" />
        </NavLink>
        <div className="header-rows">
            <div id="gradient"></div>
            <ul>
              <li>
                <NavLink to="/events" className="headerlink" activeclassname="selected">
                  Events
                </NavLink>
              </li>
              <li>
                <NavLink to="/team" className="headerlink" activeclassname="selected">
                  Team
                </NavLink>
              </li>
              <li id="join-navlink">
                <NavLink to="/join_tmeit" className="joinheaderlink" activeclassname="selected">
                  Join
                </NavLink>
              </li>
              <Login></Login>
            </ul>
        </div>
      </nav>
      <style jsx> {header_style} </style>
      <style jsx global> {navlink_style} </style>
    </header>
  );
}

export default Header;
