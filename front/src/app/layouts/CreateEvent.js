import styled from "@emotion/styled";
import Centered from "../components/Centered.js";
import EventForm from "../components/EventForm.js";

const StyledCreateEvent = styled(CreateEvent)({
});

function CreateEvent({className}) {

    return(
        <>
            <h1>Create New event</h1>
            <Centered className={className}>
                <EventForm/>
            </Centered>
        </>
    );
}
export default StyledCreateEvent