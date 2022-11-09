import React from "react";
import styled from "@emotion/styled";

import join_council from "../layout_photos/join_council.webp";
import tmeit_boat from "../layout_photos/tmeit_boat.webp";

import { kiesel_blue, secondary_purp, me_green, accent_maroon, accent_salmon } from "../palette.js";
import JoinWhatTmeit from "../components/JoinWhatTmeit.js";
import JoinWhyJoin from "../components/JoinWhyJoin.js";


const StyledJoinAboutTmeitWide = styled(JoinAboutTmeitWide)({
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gridTemplateRows: "auto auto",
    gridTemplateAreas: `
        "what what srs srs srs srs"
        "cool cool cool why why why"
    `,
    fontSize: "0.94vw", /* Prevent font from popping gaps between the pictures */

    ".green": {
        gridArea: "what-start / what-start / srs-end / srs-end",
        background: me_green,
    },
    ".salmon": {
        gridArea: "cool-start / cool-start / why-end / why-end",
        background: accent_salmon
    },
    ".salmon, .green": {
        display: "grid",
        gridTemplateColumns: "subgrid"
    },
    "& > *, .salmon > *, .green > *": {
        width: "100%",
        placeSelf: "center"
    },
    ".serious-banner": {
        gridArea: "srs"
    },
    [JoinWhatTmeit]: {
        gridArea: "what",
        padding: "2em"
    },
    ".cool-banner": {
        gridArea: "cool"
    },
    [JoinWhyJoin]: {
        gridArea: "why",
        padding: "2em"
    }
});


function JoinAboutTmeitWide({className}) {
  return (
    <div className={className}>
        <div className="green">
            <img className="serious-banner" src={join_council} alt="A TMEIT marskalk sits with a serious look and judges over a silly TMEIT meeting" />
            <JoinWhatTmeit />
        </div>
        <div className="salmon">
            <img className="cool-banner" src={tmeit_boat} alt="TMEIT sailing the high seas at Sqvalp 2022" />
            <JoinWhyJoin />
        </div>
    </div>
  )
}

export default StyledJoinAboutTmeitWide;
