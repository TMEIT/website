import {Link, useLoaderData } from "react-router-dom";
import styled from "@emotion/styled";

import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";

const StyledWebsiteMigrate = styled(WebsiteMigrate)({
    [TextSummary]: {
        maxWidth: "80em",
        margin: "2em"
    }
});

function WebsiteMigrate({className}) {
    const data = useLoaderData();
    return(
        <Centered className={className}>
            <TextSummary>
                {Object.values(data).map((value) => <p key={value}>{value}</p>)}
            </TextSummary>
        </Centered>
    );
}
export default StyledWebsiteMigrate