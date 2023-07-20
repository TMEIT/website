import { Fragment, useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useFetch } from "../FetchHooks";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextSummary from "../components/TextSummary.js";
import { primary_light } from "../palette";
import useIsScreenWide from "../useIsScreenWide";


function AdminEvents() {

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

  const event = {uuid : "dcyad23d", title: "Friday Pub", workteam: "eta", date: "2023-02-30", start: "17:00", end: "03:00", 
  signupLatest: "2023-02-29", food: "tacos", food_price: "30kr", location: "Kistan 2.0", decription: "Welcome to our pub on a 30:th of February!"};

  let events;

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
  if (loading) signups = <Loading />;
  // API error
  else if (data === "error") signups = "Could not load API";

  else {
    events = data.map((event) => (
      <div>
        <div style={screenWide? style.events : style.eventsMobile}>

          <p>{event.uuid}</p>

          <p>{event.title}</p>

          <p>{event.workteam} </p>

          <p>{event.date}</p>
          
          <Button variant="contained"><a href="/editEvent">Edit Event</a></Button>
          <Button variant="contained"onClick={() => handleDelete(event.uuid)}>Delete</Button>
        </div>
      </div>
    ))
  }

  return (
    <>
      <Fragment>{signups}</Fragment>
      {/* <button onClick={() => console.log(currentData)}>Cum</button> */}
    </>
  )
}

export default AdminEvents;