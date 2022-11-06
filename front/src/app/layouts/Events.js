import React from "react";
import css from 'styled-jsx/css'

import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";

const max_width_style = css`
    div {
        max-width: 80em;
    }
`

function Events() {
    return(
        <Centered>
            <div>
                <TextSummary>
                    <h1>Events</h1>
                    <p>Events page coming soon.</p>
                    <p>Check out our <a href="https://www.facebook.com/TMEIT/events" target="_blank">Facebook events</a> in the meantime!</p>
                </TextSummary>
            </div>
            <style jsx> {max_width_style} </style>
        </Centered>
    );
}
export default Events