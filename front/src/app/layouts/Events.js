import {useState, useEffect } from 'react';
import styled from "@emotion/styled";
import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";
import EventView from "../components/EventView.js";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import { getApiFetcher } from "../api.js";
import hasLoginCookie from '../hasLoginCookie.js';

const StyledEvents = styled(Events)({
    [TextSummary]: {
        maxWidth: "80em",
        margin: "2em"
    }
});

const render_eventPublicList = (eventArr) => 
    Object.values(eventArr).filter(eventData => eventData.visibility == "public")
    .map(eventData => <EventView event={eventData}/>);

const render_eventInternalList = (eventArr) =>
    Object.values(eventArr).filter(eventData => eventData.visibility != "elected")
    .map(eventData => <EventView event={eventData}/>);

const render_eventElectedList = (eventArr) =>
    Object.values(eventArr).map(eventData => <EventView event={eventData}/>);

const get_events = () => {
    const loadEventData = async() => {setEventData(await getApiFetcher().get("/events/").json())}
        useEffect(() => {loadEventData() }, []);

    const [eventRes, setEventData] = useState(null);

    return eventRes;
}

function Events({className}) {

    let loggedIn = hasLoginCookie();

    let events;

    const eventArr = get_events();

    const loadMeData = async() => {setMeData(await getApiFetcher().get("/me").json())}
    useEffect(() => {loadMeData() }, []);

    const [meData, setMeData] = useState(null);
    const currentUser = meData;

    if (loggedIn & (eventArr != null) & (meData != null))
    {
       

        if (currentUser.current_role == ("prao" | "exprao"))
            events = render_eventInternalList(eventArr);
        else
            events = render_eventElectedList(eventArr);
        
    }
    else if (eventArr != null & meData == null)
    {
        events = render_eventPublicList(eventArr);
    }
    else
    {
        events = (<TextSummary>
                  <h1>No published events</h1>
                  <p>There are currently no planned events, please check back later!</p>
                  </TextSummary>);
    }

    return(
        <>
            <Button variant="contained" style={{marginTop: "2em"}}><Link to="/createEvent">+ Add new event</Link></Button>
            <Centered className={className}>
                {events}
            </Centered>
        </>
    );
}
export default StyledEvents