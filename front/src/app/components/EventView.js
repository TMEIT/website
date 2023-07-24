import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { me_and_in_teal, kisel_blue, kisel_blue_dark, kisel_blue_light, primary_lighter } from "../palette.js";
import tmeit_logo_nogojan_mono from "../logos/LogoTMEIT_withoutGojan_monochrome.svg";
import SignupForm from "../components/SignupForm.js";
import hasLoginCookie from "../hasLoginCookie.js";
import {Button} from "@mui/material";
import ViewSignups from "../components/ViewSignups.js";
import {getApiFetcher} from "../api";

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

function EventView({className, eventuuid})
{
    /*const [eventData, setEventData] = useState(null);

    const loadEventData = async() => {setEventData(await getApiFetcher().get("/event/" + {eventuuid}).json())}
    useEffect(() => {loadEventData() }, []);*/

    const [meData, setMeData] = useState(null);

    const loadMeData = async() => {setMeData(await getApiFetcher().get("/me").json())}
    useEffect(() => {loadMeData() }, []);

    const eventData = {
        owner: "5xdbwe_1",
        title: "Friday pub",
        //workteam: "Eta",
        date: "2023-02-30",
        start: "17:00",
        end: "03:00",
        signupLatest: "2023-02-29",
        food: "Tacos",
        food_price: "20kr",
        location: "Kistan 2.0",
        description: "Welcome to our pub that we are for the first time ever hosting on a 30:th of February!"
    }

    const [formHidden, setFormHidden] = useState(true);
    const [listHidden, setListHidden] = useState(true);

    return(
        <div className={className}>
            <div className="eventView">
                <Box mx={1}>
                    <Grid>
                        <img id="banner" src={tmeit_logo_nogojan_mono}/>
                    </Grid>
                    <Grid>
                        <h1> {eventData.title} </h1> 
                    </Grid>
                    <Grid>
                        <h3>Workteam hosting the event: {"η"}</h3>
                    </Grid>
                    <br></br>
                    <Grid>
                        <h3>Date and time: {eventData.date + " " + eventData.start + " - " + eventData.end /*Get date-data from eventuuid*/}</h3>
                    </Grid>
                    <Grid>
                        <h3>Food and price: {eventData.food + " " + eventData.food_price/*Get food and Food price-data from eventuuid*/}</h3>
                    </Grid>
                    <br></br>
                    <Grid>
                        <h3>Location: {eventData.location}</h3>
                    </Grid>
                    <br></br>
                    <Grid>
                        <p>{eventData.description}</p>
                    </Grid>
                    <br></br>
                    <Grid>
                        {hasLoginCookie()? (formHidden? <Button style={{color: kisel_blue_dark}} onClick={() => {setFormHidden(!formHidden)}}>Sign up to work this event</Button> 
                        : <><SignupForm eventID={eventID}/> <Button style={{color: kisel_blue_dark}} onClick={() => {setFormHidden(!formHidden)}}>Close</Button></>) : <></>}
                    </Grid>
                    <Grid>
                        {hasLoginCookie()? (listHidden? <Button style={{color: kisel_blue_dark}} onClick={() => {setListHidden(!listHidden)}}>View work signups</Button> : 
                        <><ViewSignups eventID={eventID}/><Button style={{color: kisel_blue_dark}} onClick={() => {setListHidden(!listHidden)}}>Close</Button></>) : <></>}
                    </Grid>
                </Box>
            </div>
        </div>
    );
}

export default StyledEventView;