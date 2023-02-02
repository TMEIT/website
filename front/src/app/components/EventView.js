import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { kisel_blue_dark, kisel_blue_light, primary_lighter } from "../palette";
import tmeit_logo_nogojan_mono from "../logos/LogoTMEIT_withoutGojan_monochrome.svg";
import SignupForm from "../components/SignupForm.js";
import hasLoginCookie from "../../hasLoginCookie.js";

const StyledEventView = styled(EventView)({
    ".eventView": {
        padding: "1em",
        background: kisel_blue_light,
        borderRadius: "1em",
        marginTop: "1em",
        marginBottom: "1em",
    },

    "#banner": {
        width: "100%",
        height: "20%"
    }
})

function EventView({className, eventID})
{

    const [hidden, setHidden] = useState(true);

    const handleChange = (e) => {
        const {id, value} = e.target.value;
        if (id === "signup") {
            setHidden(!hidden);
        }
    }

    return(
        <div className={className}>
            <div className="eventView">
                <Box sx={{mt: 3, mb: 3}}>
                    <Grid>
                        <img id="banner" src={tmeit_logo_nogojan_mono}/>
                    </Grid>
                    <Grid>
                        <h1> {eventID} </h1>
                    </Grid>
                    <Grid>
                        {hasLoginCookie()? (<></>): <></>}
                    </Grid>
                </Box>
            </div>
        </div>
    );
}

export default StyledEventView;