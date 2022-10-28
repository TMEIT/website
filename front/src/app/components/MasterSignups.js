import React, { Fragment, useState } from "react";
import Loading from "../components/Loading";
import { useFetch } from "../FetchHooks";
import { useNavigate } from "react-router-dom";

function MasterSignups() {
  const { loading, data } = useFetch("/api/v1/sign_up");

  let signups;
  let navigate = useNavigate();

  function handleAdd(e) {
    console.log(e);
    var uuid = e.uuid;
    var name = "access_token";
    var cookieArr = document.cookie.split(";");
    var tokenText;

    //Loop through array until token is found
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");

      if (name === cookiePair[0].trim()) {
        if (decodeURIComponent(cookiePair[1]) === "") {
          // If value for access_token is empty
          navigate(0);
        } else {
          tokenText = "Bearer " + decodeURIComponent(cookiePair[1]);
        }
      }
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "api/v1/sign_up/approve/" + uuid);
    xhr.setRequestHeader("Authorization", tokenText);
    xhr.responseType = "json";

    console.log("reached xhr");

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log("It works");
      } else {
        console.log("USER NOT ADDED, MESSAGE FROM SERVER: " + xhr.statusText);
      }
    };

    console.log("after onload");
  }

  function handleDelete(e) {
    console.log(e);
    var uuid = e.uuid;
    var name = "access_token";
    var cookieArr = document.cookie.split(";");
    var tokenText;

    //Loop through array until token is found
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");

      if (name === cookiePair[0].trim()) {
        if (decodeURIComponent(cookiePair[1]) === "") {
          // If value for access_token is empty
          navigate(0);
        } else {
          tokenText = "Bearer " + decodeURIComponent(cookiePair[1]);
        }
      }
    }

    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", "api/v1/sign_up/" + uuid);
    xhr.setRequestHeader("Authorization", tokenText);
    xhr.responseType = "json";

    xhr.onload = function () {
      if (xhr.status === 200) {
        if (this.status >= 200 && this.status < 300) {
          alert("user was deleted");
        }
      } else {
        alert("USER NOT DELETED, MESSAGE FROM SERVER: " + this.statusText);
      }
    };
  }

  // Loading
  if (loading) signups = <Loading />;
  // API error
  else if (data === "error") signups = "Could not load API";
  else {
    console.log(data);
    signups = data.map((e) => (
      <>
        <p>{e.login_email}</p>
        <p>
          {e.first_name} {e.last_name}
        </p>
        <p>Phone: {e.phone}</p>
        <p>
          Signup submitted at {e.time_created} from ip address {e.ip_address}
        </p>
        <button onClick={() => handleAdd(e)}>Add to members</button>
        <button onClick={() => handleDelete(e)}>Delete</button>
      </>
    ));
  }

  return <Fragment>{signups}</Fragment>;
}

export default MasterSignups;
