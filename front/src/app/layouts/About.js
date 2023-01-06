import styled from "@emotion/styled";
import {Link} from "react-router-dom"; 

import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";

const StyledAbout = styled(About)({
    [TextSummary]:  {
        maxWidth: "240em",
        margin: "10em"
    }
});

function About({className}){
    return(
        <Centered className={className}>
            <TextSummary>
                <h1>About TMEIT</h1>
                <p>* <Link to="/documents">Documents</Link></p>
                <p>* TMEIT's history</p>
            </TextSummary>
        </Centered>
    );
}
export default StyledAbout