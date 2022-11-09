import { Fragment, useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useFetch } from "../FetchHooks";
import { useNavigate } from "react-router-dom";

function MasterSignups() {
  const { loading, data } = useFetch("/api/v1/sign_up");
  //const currentData  = useRef(second)

  let signups;
  let navigate = useNavigate();

  function handleAdd(uuid, context) {
    var tokenText = cookie();

    const address = "/api/v1/sign_up/approve/" + uuid;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", address, true);
    xhr.setRequestHeader("Authorization", tokenText);
    xhr.send("") 
    xhr.responseType = "json";

    xhr.onload = function () {
      if(xhr.status >= 200 && xhr.status < 300){
        //let currentData = context.filter(x => {return x.uuid != uuid;});
        alert("User has been added");
      }
      else{
        alert(`error: ${xhr.status}: ${xhr.statusText}`);
      }
    };
    xhr.onerror = function (){
      console.log("Request failed");
    }
  }

  function handleDelete(uuid, context) {

    var tokenText = cookie();
    const address = "/api/v1/sign_up/" + uuid;

    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", address, true);
    xhr.setRequestHeader("Authorization", tokenText);
    xhr.responseType = "";
    xhr.send();

    xhr.onload = function () {
      if(xhr.status >= 200 && xhr.status < 300){
        //let currentData = context.filter(x => {return x.uuid != uuid;});
        alert("User has been deleted");
      }
      else{
        alert(`error: ${xhr.status}: ${xhr.statusText}`);
      }
    };
    xhr.onerror = function (){
      alert("Request failed");
    }
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

  // useEffect(() => {
  //   console.log("useEffect triggered");
  //   console.log(currentData);
  //     signups = currentData.map((e) => (
  //     <>
  //       <p>{e.login_email}</p>
  //       <p>
  //         {e.first_name} {e.last_name}
  //       </p>
  //       <p>Phone: {e.phone}</p>
  //       <p>
  //         Signup submitted at {e.time_created} from ip address {e.ip_address}
  //       </p>
  //       <button onClick={() => handleAdd(e.uuid, currentData)}>Add to members</button>
  //       <button onClick={() => handleDelete(e.uuid, currentData)}>Delete</button>
  //     </>
  //   ))}, [currentData])

  // Loading
  if (loading) signups = <Loading />;
  // API error
  else if (data === "error") signups = "Could not load API";
  else {
    // let currentData = data.map((e) => (
    //   {
    //     login_email: e.login_email,
    //     first_name: e.first_name, 
    //     last_name: e.last_name,
    //     phone: e.phone,
    //     time_created: e.time_created,
    //     ip_address: e.ip_address,
    //     uuid: e.uuid
    //   }
    // ));
    
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
        <button onClick={() => handleAdd(e.uuid, currentData)}>Add to members</button>
        <button onClick={() => handleDelete(e.uuid, currentData)}>Delete</button>
      </>
    ))
  }

  return (
    <>
      <Fragment>{signups}</Fragment>
      {/* <button onClick={() => console.log(currentData)}>Cum</button> */}
    </>
  )
}

export default MasterSignups;
