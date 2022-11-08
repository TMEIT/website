import React from "react";
import {Link} from "react-router-dom";


function Joined() {
  return (
    <div>
      <h1> Welcome to TMEIT! </h1>
      <p>
        You are now registered as a PRAO in TMEIT!
      </p>
      <p>
        You will receive an email once your account has been approved.
        Once your account is approved, you will be able to log in and see all of our internal events and discussion here on tmeit.se.
      </p>
      <p>
        If you're joining us during Mottagning, don't forget about PRAO möte! It's a fun party that we hold to welcome all new PRAO.
        You should receive an invite from the Masters.
      </p>
    </div>
  );
}

// TODO: After events system is added, it would be nice to add a database check to this page to find upcoming events with a "praomöte" tag
// This page could then show the praomöte events so Prao can sign up for the meeting!

export default Joined;
