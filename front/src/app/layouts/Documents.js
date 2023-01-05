import styled from "@emotion/styled";
//import {Link} from "react-router-dom";  //Included for the future, when there will be something to link to

import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";

const StyledDocuments = styled(Documents)({
    [TextSummary]:  {
        maxWidth: "80em",
        margin: "2em"
    }
});

function Documents({className})
{
    return(
        <Centered className={className}>
            <TextSummary>
                <h1>Documents</h1>
                <p>* Reglemente</p>
                <p>* Meeting protocol</p>
            </TextSummary>
        </Centered>
    );
}

export default StyledDocuments