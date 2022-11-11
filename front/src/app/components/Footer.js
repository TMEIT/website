import styled from "@emotion/styled";

import { kiesel_blue, secondary_purp, primary_light, accent_yellow, primary_dark, accent_maroon } from "../palette.js";

const StyledFooter = styled(Footer)({
    height: "5rem",
    background: accent_maroon,
    marginTop: "auto",
    marginBottom: 0,
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    gridRowStart: 2,
    overflow: "scroll",
    color: "#bbbbbb",

    ul: {
            padding: 0,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            textAlign: "center",
            fontSize: "1rem",
        },
    
    li: {
        display: "inline"
    },

    "a:link": { color: "#ffffff", textDecoration: "none" },
    "a:visited": { color: "#ffffff", textDecoration: "none" },
    "a:hover": { color: "#ffffff", textDecoration: "none" },
    "a:active": { color: "#ffffff", textDecoration: "none" },
});

function Footer({className}) {
    return (
        <footer className={className}>
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
    )
}

export default StyledFooter