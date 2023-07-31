import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { primary_light } from "../palette";
import useIsScreenWide from "../useIsScreenWide";
import EventForm from "../components/EventForm.js";
import { getApiFetcher } from "../api";
import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";


function AdminEvents() {

  const loadEventData = async() => {setEventData(await getApiFetcher().get("/events/").json())}
        useEffect(() => {loadEventData() }, []);

  const [eventArr, setEventData] = useState(null);

  const [eventData, setEvent] = useState(null);
  const [view, setView] = useState(0);

  const [userMessage, setUserMessage] = useState("");

  let navigate = useNavigate();
  let screenWide = useIsScreenWide(949);

  const style ={
    events :{
      background: primary_light, 
      bordeStyle: "solid",
      maxWidth: "50vw",
      margin: "2em",
      borderRadius: "1em",
      padding: "1em",
    },

    eventsMobile :{
      background: primary_light, 
      bordeStyle: "solid",
      margin: "2em",
      maxWidth: "80vw",
      borderRadius: "1em",
      padding: "1em",
    }
  };

  function openEdit(eventData)
  {
    setEvent(eventData);
    setView(1);
  }

  function handleDelete(uuid) {

    const tokenText = cookie();
    const address = String("/api/v1/events/" + {uuid})

    const remove = new XMLHttpRequest();
    remove.open("DELETE", address);
    remove.setRequestHeader("Authorization", tokenText);
    remove.setRequestHeader("Content-Type", "application/json");
    remove.send();

    remove.onload = function () {
    if (remove.status === 200) {
      setUserMessage("Event has been deleted!");
    }
    else if (remove.status === 404) {
      setUserMessage("Could not find event. Reload the page to update events")
    }
    }
    uuid.preventDefault();
  }

  function cookie(){
    var name = "access_token";
    var cookieArr = document.cookie.split(";");

    //Loop through array until token is found
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");

      if (name === cookiePair[0].trim()) {
        if (decodeURIComponent(cookiePair[1]) === "") {
          // If value for access_token is empty
          navigate(0);
        } else {
          return "Bearer " + decodeURIComponent(cookiePair[1]);
        }
      }
    }
    navigate(0);
  }

  let eventsmap;

    if (eventArr == null)
    {
      eventsmap = <Centered>
                <TextSummary>
                  <h1>No events</h1>
                  <p>There are no published events</p>
                </TextSummary>
              </Centered>
    }
    else
    {
      eventsmap = eventArr.map(eventmap => {
        <div>
          <div style={screenWide? style.events : style.eventsMobile}>

            <p>{eventmap.uuid}</p>

            <p>{eventmap.title}</p>

            <p>{eventmap.event_start}</p>

            <p>{eventmap.event_end}</p>

            <p>{eventmap.location}</p>

            <p>{eventmap.description}</p>

            <p>{eventmap.visibility}</p>
            
            <Button variant="contained"onClick={() => openEdit(eventmap)}>Edit Event</Button>
            <Button variant="contained"onClick={() => handleDelete(eventmap.uuid)}>Delete</Button>

            <p>{userMessage}</p>
          </div>
        </div>
      })
    }
    

  return (
    <>
    {(() => {
      switch (view) {
        case 0:
          return(
            <>
              {eventsmap}{/* <button onClick={() => console.log(currentData)}>Cum</button> who tf put this here? xD*/}
            </>);

        case 1:
          return (<>
          <EventForm className={className} edit={true} eventData={eventData}></EventForm>
          <Button variant="contained" onClick={() => setView(0)}>Close</Button>
          </>);
      }
    })()}
    </>
  )
}

export default AdminEvents;