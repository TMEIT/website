import styled from "@emotion/styled";

import { kisel_blue, secondary_purp, primary_light, primary_lighter } from "../palette.js";


const StyledTextSummary = styled(TextSummary)({
    padding: "1em",
    background: primary_lighter,
    borderRadius: "1em",
});

function TextSummary({className, children}) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}

export default StyledTextSummary