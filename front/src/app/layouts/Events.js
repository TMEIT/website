import {useState, useEffect } from 'react';
import styled from "@emotion/styled";
import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";
import EventView from "../components/EventView.js";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import { getApiFetcher } from "../api.js";
import hasLoginCookie from '../hasLoginCookie.js';
import Loading from '../components/Loading.js';

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

function Events({className}) {

    const loadEventData = async() => {setEventData(await getApiFetcher().get("/events/").json())}
        useEffect(() => {loadEventData() }, []);

    const [eventArr, setEventData] = useState(null);

    const loadMeData = async() => {setMeData(await getApiFetcher().get("/me").json())}
    useEffect(() => {loadMeData() }, []);

    const [meData, setMeData] = useState(null);

    let loggedIn = hasLoginCookie();

    let events;

    if (eventArr == null)
        return <Loading/>;

    if (loggedIn & (eventArr.length != 0) & (meData != null))
    {
        if (meData.current_role == ("prao" | "exprao"))
            events = render_eventInternalList(eventArr);
        else
            events = render_eventElectedList(eventArr);
    }
    else if (eventArr.length != 0 & meData == null)
        events = render_eventPublicList(eventArr);
    else
    {
        events = <></>;
        alert("There are currently no events");
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