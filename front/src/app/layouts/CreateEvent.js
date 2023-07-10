import styled from "@emotion/styled";
import Centered from "../components/Centered.js";
import EventForm from "../components/EventForm.js";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";

const StyledCreateEvent = styled(CreateEvent)({
});

function CreateEvent({className}) {

    return(
        <>
            <h1>Create New event</h1>
            <Button variant="contained" style={{marginTop: "2em"}}><Link to="/events">Cancel</Link></Button>
            <Centered className={className}>
                <EventForm/>
            </Centered>
        </>
    );
}
export default StyledCreateEvent