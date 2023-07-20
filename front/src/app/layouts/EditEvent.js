import styled from "@emotion/styled";
import Centered from "../components/Centered.js";
import EventForm from "../components/EventForm.js";

const StyledEditEvent = styled(EditEvent)({
});

function EditEvent({className, event_uuid}) {

    return(
        <>
            <h1>Edit event</h1>
            <Centered className={className}>
                <EventForm event_uuid={event_uuid}/>
            </Centered>
        </>
    );
}
export default StyledEditEvent