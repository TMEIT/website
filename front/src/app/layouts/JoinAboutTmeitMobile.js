import React from "react";
import css from 'styled-jsx/css'

import join_council from "../layout_photos/join_council.webp";
import tmeit_boat from "../layout_photos/tmeit_boat.webp";

import { kiesel_blue, secondary_purp, me_green, accent_maroon, accent_salmon } from "../palette.js";
import JoinWhatTmeit from "../components/JoinWhatTmeit.js";
import JoinWhyJoin from "../components/JoinWhyJoin.js";

const style = css`
    .about-tmeit {
        background: ${accent_salmon};
    }
    div, img {
        width: 100%;
    }
    .salmon { background: ${accent_salmon}; }
    .green { background: ${me_green}; }
    .what-tmeit, .why-join {
        padding: 1em;
    }
`

function JoinAboutTmeitMobile() {
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

export default JoinAboutTmeitMobile;
