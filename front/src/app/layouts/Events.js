import React from "react";
import styled from "@emotion/styled";

import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";

const StyledEvents = styled(Events)({
    [TextSummary]: {
        maxWidth: "80em",
        margin: "2em"
    }
});

function Events({className}) {
    return(
        <Centered className={className}>
            <TextSummary>
                <h1>Events - Coming soon!</h1>
                <p>The events page is under construction.</p>
                <p>TMEIT.SE GEN 3 is very new and we're still re-implementing event pages feature.</p>
                <p>Check out our <a href="https://www.facebook.com/TMEIT/events" target="_blank">Facebook events</a> in the meantime!</p>
            </TextSummary>
        </Centered>
    );
}
export default StyledEvents