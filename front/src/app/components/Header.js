import React from "react";
import {NavLink} from "react-router-dom";

import styles from "./header.css"


function Header() {
    return (
        <header>
            <nav>
                <ul>
                    <li><NavLink to="/" activeclassname="selected">TMEIT</NavLink></li>
                    <li><NavLink to="/events" activeclassname="selected">Events</NavLink></li>
                    <li><NavLink to="/team" activeclassname="selected">Team</NavLink></li>
                    <li><NavLink to="/join_tmeit" activeclassname="selected">JOIN</NavLink></li>
                    <li><a href={"#"}>Login</a></li>
                </ul>
            </nav>

        </header>
    )
}

export default Header