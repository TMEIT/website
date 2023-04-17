import styled from "@emotion/styled";

import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";

const StyledEvents = styled(PasswordReset)({
    [TextSummary]: {
        maxWidth: "80em",
        margin: "2em"
    }
});

function PasswordReset({className}) {
    return(
        <Centered className={className}>
            <TextSummary>
                <h1>Password Reset</h1>
                <p>Ohh yahahahaharghh, yer password lost matey? Yahaharghh, no worries matey, let's make ye a new one!</p>
            </TextSummary>
        </Centered>
    );
}
export default StyledPasswordReset