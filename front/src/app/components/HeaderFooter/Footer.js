import styled from "@emotion/styled";

import FooterNav from "./navs/FooterNav";
import { kisel_blue, secondary_purp, primary_light, accent_yellow, primary_dark, accent_maroon } from "../../palette.js";

const StyledFooter = styled(Footer)({
    height: "5rem",
    background: accent_maroon,
    marginTop: "auto",
    marginBottom: 0,
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    gridRowStart: 2,
    overflow: "hidden",
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
            <FooterNav />
        </footer>
    )
}

export default StyledFooter;
