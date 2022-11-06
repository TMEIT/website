import React from "react";

import { kiesel_blue, secondary_purp, primary_light, accent_yellow, primary_dark, accent_maroon } from "../palette.js";

function Footer() {
    return (
        <>
            <footer>
                <nav>
                    <ul>
                        <li><a target="_blank" href="https://www.google.com/maps/place/Kistan+2.0/@59.4049488,17.948582,17z/data=!3m1!4b1!4m5!3m4!1s0x465f9fd2cab08029:0x1f774924439502cc!8m2!3d59.4049488!4d17.9507707">Kistagången 14<br />164 40 Kista</a></li>
                        <li>This website is open-source! <br/> <a target="_blank" href="https://github.com/TMEIT/website">Check it out on GitHub!</a></li>
                        <li><a target="_blank" href="https://www.insektionen.se">IN-Sektionen</a></li>
                        <li><a target="_blank" href="https://www.facebook.com/ITerativaKlubben">ITK</a></li>
                        <li><a target="_blank" href="https://www.qmisk.se">QMISK</a></li>
                    </ul>
                </nav>
            </footer>
            <style jsx>{`
                footer {
                    height: 5rem;
                    background: ${accent_maroon};
                    margin-top: auto;
                    margin-bottom: 0;
                    padding-top: 0.5rem;
                    padding-bottom: 0.5rem;
                    grid-row-start: 2;
                    overflow: scroll;
                    color: #bbbbbb
                }
                ul {
                    padding: 0;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    text-align: center;
                    font-size: 1rem;
                }
                li {
                    display: inline;
                }

                a:link { color: #ffffff; text-decoration: none; }
                a:visited { color: #ffffff; text-decoration: none; }
                a:hover { color: #ffffff; text-decoration: none; }
                a:active { color: #ffffff; text-decoration: none; }
            `}</style>
        </>
    )
}

export default Footer