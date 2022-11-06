import React from "react";
import css from 'styled-jsx/css'

import JoinForm from "../components/JoinForm";
import TextSummary from "../components/TextSummary.js";
import Centered from "../components/Centered.js";

export const join_style = css`
    .container {
        width: 100%;
        display: grid;
        grid: repeat(3, auto) / 100%
    }
    h1 {
        grid-area: 1 / 1;
        place-self: center;
        color: #ffffff;
        /* set gradient to vignette image underneath */
    }
    img {
        grid-area: 1 / 1;

        /* set explicit height, width overflowing gets cut off*/
    }
    .about-tmeit {
        place-self: center;
        grid-area: 2 / 1;
    }
    .joining {
        place-self: center;
        grid-area: 3 / 1;
    }
    .joining>div {
        padding: 1em;
    }
`

function Join() {
  return (
    <div className="container">
        <h1> So you want to join TMEIT? </h1>
        <img className="long-logo" src="" alt="A TMEIT marskalk sits with a serious look and judges over a silly TMEIT meeting" />
        <div className="about-tmeit"> TMEIT hype </div>
        <div className="joining">
            <TextSummary>
                <p>
                    The period to become a PRAO (An aspiring tmeit member, roughly translates to "intern") is open all year long.
                    Just sign up using the form, and you'll be invited to all of TMEIT's events!
                    We'll also create an account for you here on tmeit.se, so you can see everything that's happening in the klubbmästeri.
                </p>
                <p>
                    At the end of Mottagning, TMEIT also holds a special meeting with all new PRAO that you don't want to miss!
                </p>
            </TextSummary>
            <JoinForm />;
        </div>
        <style jsx> {join_style} </style>
    </div>
  )
}

export default Join;
