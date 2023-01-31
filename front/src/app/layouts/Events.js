import styled from "@emotion/styled";

import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";
import hasLoginCookie from "../hasLoginCookie.js";
import SignupForm from "../components/SignupForm.js";

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
                <p>TMEIT.SE GEN 3 is very new and we're still re-implementing the event pages.</p>
                <p>Check out our <a href="https://www.facebook.com/TMEIT/events" target="_blank">Facebook events</a> in the meantime!</p>
            </TextSummary>
            <>{hasLoginCookie()? 
                <SignupForm/>
             : <></>}
             </>
        </Centered>
    );
    /*
    return(
        <Centered className={className}>
            <TextSummary>
                <h1>Events - Coming soon!</h1>
                <p>The events page is under construction.</p>
                <p>TMEIT.SE GEN 3 is very new and we're still re-implementing the event pages.</p>
                <p>Check out our <a href="https://www.facebook.com/TMEIT/events" target="_blank">Facebook events</a> in the meantime!</p>
            </TextSummary>
            <>{hasLoginCookie()? 
                <TextSummary>
                <h1>Work signup</h1><p>Meanwhile the development of the events page is underway,</p>
                <p>you can sign up to work on an event here: </p>
                <a href="https://docs.google.com/spreadsheets/d/1XxQQKn0U0aYRtVvEvowolVkEkQn55XNmB1my1TOB3cc/edit?usp=sharing" target="_blank">Work sign-up</a>
                </TextSummary>
             : <></>}
             </>
        </Centered>
    );
    */
}
export default StyledEvents