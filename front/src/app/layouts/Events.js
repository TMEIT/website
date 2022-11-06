import React from "react";
import css from 'styled-jsx/css'

import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";

const max_width_style = css`
    div {
        max-width: 80em;
        margin: 2em;
    }
`

function Events() {
    return(
        <Centered>
            <div>
                <TextSummary>
                    <h1>Events - Coming soon!</h1>
                    <p>The events page is under construction.</p>
                    <p>TMEIT.SE GEN 3 is very new and does not yet have the event pages that the old site had.</p>
                    <p>Check out our <a href="https://www.facebook.com/TMEIT/events" target="_blank">Facebook events</a> in the meantime!</p>
                </TextSummary>
            </div>
            <style jsx> {max_width_style} </style>
        </Centered>
    );
}
export default Events