import styled from "@emotion/styled"; 

import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";

const StyledDocuments = styled(Documents)({
    [TextSummary]:  {
        maxWidth: "80em",
        margin: "2em"
    }
});

function Documents({className}){
    return(
        <Centered className={className}>
            <TextSummary>
                <h1>Documents</h1>
                <p>* <a target="_blank" href="https://drive.google.com/drive/folders/1qqRiRirwdMP_8BwqLtcFxwbw_b69_m97">Regulations and prao checklist</a></p>
                <p>* <a target="_blank" href="https://drive.google.com/drive/folders/1PrcQOZu5nli3cFo6BYYsGDjLyRXbBBl_?usp=sharing">Meeting protocols</a></p>
            </TextSummary>
        </Centered>
    );
}
export default StyledDocuments