import styled from "@emotion/styled";
import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";
import EventView from "../components/EventView.js";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import { getApiFetcher } from "../api.js";

const StyledEvents = styled(Events)({
    [TextSummary]: {
        maxWidth: "80em",
        margin: "2em"
    }
});

const render_eventlist = (eventArr) =>
    Object.values(eventArr).map(eventData => <EventView event={eventData}/>);

function Events({className}) {

    /*const [eventArr, setEventData] = useState(null);

    const loadEventData = async() => {setEventData(await getApiFetcher().get("/events).json())}
    useEffect(() => {loadEventData() }, []);*/

   const eventArr = {
        "Teyx_sge" : {
            owner: "5xdbwe_1",
            title: "Friday pub",
            date: "2023-02-30 12:00",
            start: "17:00",
            end: "03:00",
            //signupLatest: "2023-02-29",
            location: "Kistan 2.0",
            description: "Welcome to our pub that we are for the first time ever hosting on a 30:th of February! Food: Tacos, Price: 20kr"
        },
        "orsh43as" : {
            owner: "1263gfrt",
            title: "Tuesday pub",
            date: "2023-03-31",
            start: "17:00",
            end: "03:00",
            //signupLatest: "2023-03-30 13:00",
            location: "Kistan 1.0",
            description: "Ladies and gentlemen, we have been able to open the doors in old Kistan, Kistan 1.0!! Food: Billys, Price: 10kr"
        },
    }

    let events = render_eventlist(eventArr);

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