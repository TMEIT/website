import React, { useState } from "react";
import { useFetch } from "../FetchHooks";
import Loading from "./Loading";
import "./memberHandling.css";

function MemberHandling() {
  const { loading, data } = useFetch("/api/v1/members");
  const [value, setValue] = useState("");
  const [userData, setUserData] = useState(null);

  const handleChange = (e) => {
    console.log(e.target.value);
    setValue(e.target.value);
    let user = data.filter((element) => element.uuid === e.target.value);
    console.log(user[0]);
    setUserData(user[0]);
  };

  const patchUser = (e) => {
    e.preventDefault();
    let formData = e.target;
    formData = formData.filter((e) => e.value != "");
    console.log(formData);
  };

  function displayData(user) {
    if (user === null) return <></>;

    return (
      <form onSubmit={patchUser}>
        <div>
          <label htmlFor="First name">First name: {user.first_name}</label>
          <input type="text" id="First Name"></input>
        </div>
        <div>
          <label htmlFor="Last Name">Last name: {user.last_name}</label>
          <input type="text" id="Last Name"></input>
        </div>
        <div>
          <label htmlFor="Nickname">Nickname: {user.nickname}</label>
          <input type="text" id="Nickname"></input>
        </div>
        <div>
          <label htmlFor="Current role">
            Current role: {user.current_role}
          </label>
          <select id="Current role">
            <option key="" value="">
              -- change here --
            </option>
            <option key="inactive" value="inactive">
              inactive
            </option>
            <option key="exprao" value="exprao">
              ex prao
            </option>
            <option key="prao" value="prao">
              prao prao prao
            </option>
            <option key="marshal" value="marshal">
              marshal
            </option>
            <option key="master" value="master">
              MASTER
            </option>
            <option key="ex" value="ex">
              ex-member
            </option>
            <option key="vraq" value="vraq">
              vraq
            </option>
          </select>
        </div>
        <div>
          <label htmlFor="email">Email: {user.login_email}</label>
          <input type="email" id="email"></input>
        </div>
        <div>
          <label htmlFor="phone">Phone number: {user.phone}</label>
          <input type="number" id="phone"></input>
        </div>
        <div>
          <label htmlFor="drivers license">
            Drivers licence:{" "}
            {user.drivers_licence ? user.drivers_licence : "none"}
          </label>
          <input type="date" id="drivers licence"></input>
        </div>
        <div>
          <label htmlFor="stad">
            STAD licence: {user.stad ? user.stad : "none"}
          </label>
          <input type="date" id="stad"></input>
        </div>
        <div>
          <label htmlFor="fest">
            FEST permission: {user.fest ? user.fest : "none"}
          </label>
          <input type="date" id="fest"></input>
        </div>
        <div>
          <label htmlFor="liquor permit">
            {user.liqour_permit
              ? "on Kistans liqour permit since " + user.liqour_permit
              : "is not on Kistan 2.0s liqour permit"}
          </label>
          <input type="date" id="liqour permit"></input>
        </div>
        {/* <div>
          <label htmlFor="role histories">
            History of the user: {user.role_histories}
          </label>
          <input type="text" id="role histories"></input>
        </div>
        <div>
          <label htmlFor="workteams">On the work team: {user.workteams}</label>
          <input type="text" id="workteams"></input>
        </div> */}
        <div>
          <input type="submit" value="Submit"></input>
        </div>
      </form>
    );
  }

  if (loading) return <Loading />;
  else if (data === "error") return <p>Could not load API</p>;
  else {
    let membersList = data.map((e) => {
      return (
        <option key={e.uuid} value={e.uuid}>
          {e.first_name} {e.last_name}
        </option>
      );
    });
    return (
      <>
        <div className="select">
          <label htmlFor="members">Select a member </label>
          <select
            name="members"
            defaultValue="none"
            value={value}
            onChange={handleChange}
          >
            <option key="none" value="none">
              -- choose an option --
            </option>
            {membersList}
          </select>
        </div>
        {displayData(userData)}
        <div className="userData"></div>
      </>
    );
  }
}

export default MemberHandling;
