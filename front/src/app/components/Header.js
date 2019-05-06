import React from "react";
import {NavLink} from "react-router-dom";

import styles from "./header.css"


function Header() {
    return (
        <header>
            <nav>
                <ul>
                    <li><NavLink to="/" activeClassName="selected">TMEIT</NavLink></li>
                    <li><NavLink to="/events" activeClassName="selected">Events</NavLink></li>
                    <li><NavLink to="/team" activeClassName="selected">Team</NavLink></li>
                    <li><NavLink to="/join_tmeit" activeClassName="selected">JOIN</NavLink></li>
                    <li><a href={"#"}>Login</a></li>
                </ul>
            </nav>

        </header>
    )
}

export default Header