import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { me_and_in_teal, kisel_blue, kisel_blue_dark, kisel_blue_light, primary_lighter } from "../palette.js";
import tmeit_logo_nogojan_mono from "../logos/LogoTMEIT_withoutGojan_monochrome.svg";
import SignupForm from "../components/SignupForm.js";
import hasLoginCookie from "../hasLoginCookie.js";
import {Button} from "@mui/material";

const StyledEventView = styled(EventView)({
    ".eventView": {
        maxWidth: "40em",
        padding: "1em",
        background: me_and_in_teal,
        borderRadius: "1em",
        marginTop: "1em",
        marginBottom: "1em",
        border: "2px solid black"
    },

    "#banner": {
        width: "100%",
        height: "20%"
    }
})

function EventView({className, eventID})
{

    const [formHidden, setFormHidden] = useState(true);
    const [listHidden, setListHidden] = useState(true);

    return(
        <div className={className}>
            <div className="eventView">
                <Box sx={{margin: 3}}>
                    <Grid>
                        <img id="banner" src={tmeit_logo_nogojan_mono}/>
                    </Grid>
                    <Grid>
                        <h1> {eventID} </h1> 
                    </Grid>
                    <br></br>
                    <Grid>
                        <h3>Date and time: {"30:th Feb 2420, 17:00 - Late™" /*Get date-data from eventuuid*/}</h3>
                    </Grid>
                    <Grid>
                        <h3>Food and price: {"Tacos" + " " + "69kr" /*Get food and Food price-data from eventuuid*/}</h3>
                    </Grid>
                    <Grid>
                        <h3>Workteam hosting the event: {"η"}</h3>
                    </Grid>
                    <br></br>
                    <Grid>
                        <p>Come and enjoy our Friday pub that we are for the first time ever hosting on a 30:th of February!</p>
                    </Grid>
                    <br></br>
                    <Grid>
                        {hasLoginCookie()? (formHidden? <Button style={{color: kisel_blue_dark}} onClick={() => {setFormHidden(!formHidden)}}>Sign up to work this event</Button> 
                        : <><SignupForm eventID={eventID}/> <Button style={{color: kisel_blue_dark}} onClick={() => {setFormHidden(!formHidden)}}>Close</Button></>) : <></>}
                    </Grid>
                    <Grid>
                        {hasLoginCookie()? (listHidden? <Button style={{color: kisel_blue_dark}} onClick={() => {setListHidden(!listHidden)}}>View work signups</Button> : 
                        <><Button style={{color: kisel_blue_dark}} onClick={() => {setListHidden(!listHidden)}}>Close</Button></>) : <></>}
                    </Grid>
                </Box>
            </div>
        </div>
    );
}

export default StyledEventView;