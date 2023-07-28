import { Fragment, useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { primary_light } from "../palette";
import useIsScreenWide from "../useIsScreenWide";
import EventForm from "../EventForm.js";
import { getApiFetcher } from "../api";


function AdminEvents() {

  const loadEventData = async() => {setEventData(await getApiFetcher().get("/events/").json())}
        useEffect(() => {loadEventData() }, []);

  const [eventArr, setEventData] = useState(null);
  const [event, setEvent] = useState(null);

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

  function openEdit(event)
  {
    setEvent(event);
    setView(1);
  }

  function handleDelete(event) {

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

  // Loading
  if (loading) events = <Loading />;
  // API error
  else if (data === "error") signups = "Could not load API";

  else {
    events = eventArr.map(event => {
      <div>
        <div style={screenWide? style.events : style.eventsMobile}>

          <p>{event.uuid}</p>

          <p>{event.title}</p>

          <p>{event.event_start}</p>

          <p>{event.event_end}</p>

          <p>{event.location}</p>

          <p>{event.description}</p>

          <p>{event.visibility}</p>
          
          <Button variant="contained"onClick={() => openEdit(event)}>Edit Event</Button>
          <Button variant="contained"onClick={() => handleDelete(event)}>Delete</Button>
        </div>
      </div>
    }
    )
  }

  return (
    <>
    {(() => {
      switch (view) {
        case 0:
          return(
            <>
              <Fragment>{events}</Fragment>{/* <button onClick={() => console.log(currentData)}>Cum</button> who tf put this here? xD*/}
            </>);

        case 1:
          return (<>
          <EventForm className={className} edit={true} event={event}></EventForm>
          <Button variant="contained" onClick={() => setView(0)}>Close</Button>
          </>);
      }
    })()}
    </>
  )
}

export default AdminEvents;