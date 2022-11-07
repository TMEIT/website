import React from "react";
import css from 'styled-jsx/css'

import join_council from "../layout_photos/join_council.webp";
import tmeit_boat from "../layout_photos/tmeit_boat.webp";

import { kiesel_blue, secondary_purp, me_green, accent_maroon, accent_salmon } from "../palette.js";
import JoinWhatTmeit from "../components/JoinWhatTmeit.js";
import JoinWhyJoin from "../components/JoinWhyJoin.js";

export const style = css`
    .about-tmeit {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: auto auto;
        grid-template-areas:
            "what what srs srs srs srs"
            "cool cool cool why why why";
         font-size: 0.94vw; /* Prevent font from popping gaps between the pictures */
    }
    .green {
        grid-area: what-start / what-start / srs-end / srs-end;
        background: ${me_green};

    }
    .salmon {
        grid-area: cool-start / cool-start / why-end / why-end;
        background: ${accent_salmon};
    }
    .salmon, .green {
        display: grid;
        grid-template-columns: subgrid;
    }
    .about-tmeit > *,
    .salmon > *,
    .green > * {
        width: 100%;
        place-self: center;
    }
    .serious-banner {
        grid-area: srs;
    }
    .what-tmeit {
        grid-area: what;
    }
    .cool-banner {
        grid-area: cool;
    }
    .why-join {
        grid-area: why;
    }
    .what-tmeit, .why-join {
        padding: 2em;
    }
`

function JoinAboutTmeitWide() {
  return (
    <div className="about-tmeit">
        <div className="green">
            <img className="serious-banner" src={join_council} alt="A TMEIT marskalk sits with a serious look and judges over a silly TMEIT meeting" />
            <div className="what-tmeit"> <JoinWhatTmeit /> </div>
        </div>
        <div className="salmon">
            <img className="cool-banner" src={tmeit_boat} alt="TMEIT sailing the high seas at Sqvalp 2022" />
            <div className="why-join"> <JoinWhyJoin /> </div>
        </div>
        <style jsx> {style} </style>
    </div>
  )
}

export default JoinAboutTmeitWide;
