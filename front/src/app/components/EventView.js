//import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { me_and_in_teal, kisel_blue, kisel_blue_dark, kisel_blue_light, primary_lighter } from "../palette.js";
import tmeit_logo_nogojan_mono from "../logos/LogoTMEIT_withoutGojan_monochrome.svg";
/*import SignupForm from "../components/SignupForm.js";
import hasLoginCookie from "../hasLoginCookie.js";
import {Button} from "@mui/material";
import ViewSignups from "../components/ViewSignups.js";*/

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
    },

    "@media (max-width: 950px)" : {
        ".eventView": {
            maxWidth: "30em",
        }
    },

    "@media (max-width: 600px)" : {
        ".eventView": {
            maxWidth: "25em",
        }
    },

})

function EventView({className, event})
{
    /*const [meData, setMeData] = useState(null);

    const loadMeData = async() => {setMeData(await getApiFetcher().get("/me").json())}
    useEffect(() => {loadMeData() }, []);

    const [formHidden, setFormHidden] = useState(true);
    const [listHidden, setListHidden] = useState(true);*/

    const start = event.event_start.split(/[T+]+/);
    const end = event.event_end.split(/[T+]+/);

    return(
        <div className={className}>
            <div className="eventView">
                <Box mx={1}>
                    <Grid>
                        <img id="banner" src={tmeit_logo_nogojan_mono}/>
                    </Grid>
                    <Grid>
                        <h1> {event.title} </h1> 
                    </Grid>
                    <br></br>
                    <Grid>
                        <h3>Event starts: {start[0] + " " + start[1]}</h3>
                    </Grid>
                    <br></br>
                    <Grid>
                        <h3>Event ends: {end[0] + " " + end[1]}</h3>
                    </Grid>
                    <br></br>
                    <Grid>
                        <h3>Location: {event.location}</h3>
                    </Grid>
                    <br></br>
                    <Grid>
                        <p>{event.description}</p>
                    </Grid>
                    <br></br>
                    {/*<Grid>
                        {hasLoginCookie()? (formHidden? <Button style={{color: kisel_blue_dark}} onClick={() => {setFormHidden(!formHidden)}}>Sign up to work this event</Button> 
                        : <><SignupForm event={event}/> <Button style={{color: kisel_blue_dark}} onClick={() => {setFormHidden(!formHidden)}}>Close</Button></>) : <></>}
                    </Grid>
                    <Grid>
                        {hasLoginCookie()? (listHidden? <Button style={{color: kisel_blue_dark}} onClick={() => {setListHidden(!listHidden)}}>View work signups</Button> : 
                        <><ViewSignups event={event}/><Button style={{color: kisel_blue_dark}} onClick={() => {setListHidden(!listHidden)}}>Close</Button></>) : <></>}
                    </Grid>*/}
                </Box>
            </div>
        </div>
    );
}

export default StyledEventView;