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
                <p>* <a>Regulations - for now you can find the regulations under "Meeting protocols"</a></p>
                <p>* <a target="_blank" href="https://drive.google.com/drive/folders/16nr4Zem5E2HfjWQ135W_fiy7F58fCFDk?usp=share_link">Meeting protocols</a></p>
            </TextSummary>
        </Centered>
    );
}
export default StyledDocuments