import {useState, useEffect } from 'react';
import styled from "@emotion/styled";
import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";
import EventView from "../components/EventView.js";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import { getApiFetcher } from "../api.js";
import Loading from '../components/Loading.js';

const StyledEvents = styled(Events)({
    [TextSummary]: {
        maxWidth: "80em",
        margin: "2em"
    }
});

const render_events = (eventArr) => 
    Object.values(eventArr).map(eventData => <EventView event={eventData}/>);

function Events({className}) {

    const loadEventData = async() => {setEventData(await getApiFetcher().get("/events/").json())}
        useEffect(() => {loadEventData() }, []);

    const [eventArr, setEventData] = useState(null);

    let events;

    if (eventArr == null)
        return <Loading/>;

    if (eventArr.length != 0)
        events = render_events(eventArr);
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