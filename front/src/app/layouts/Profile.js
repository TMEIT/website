import { Fragment, useState, memo } from "react";
import { Link, useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import styles from "./profile.css";
import { useFetch } from "../FetchHooks.js";
import Loading from "../components/Loading";
import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";
import { currentRolesEN, capitalizeFirstLetter } from "../tmeitStringFn.js";
import { WorkteamItem } from "../components/Listables";

function Profile({className}) {
  let { shortUuid, _ } = useParams();

  const { loading, data } = useFetch("/api/v1/members/" + shortUuid);

  if (data === "error")
    return (
      <>
        <h1>404: This profile was not found</h1>
        Click <Link to={"/team"}>here</Link> to see all of our members.
      </>
    );

  if (loading) {
    return <Loading />;
  }
  const nickname = data.nickname;
  const fullName = data.first_name + " " + data.last_name;
  // const currentWorkteam = data.workteams[0].name; // TODO: Change this to choose all the workteams that are active
  const role = ((current_role) => {
    const string = currentRolesEN.get(current_role).toString();
    return capitalizeFirstLetter(string);
  })(data.current_role);

  return (
    <Centered className={className}>
        <TextSummary>
            <img
                src={"https://thispersondoesnotexist.com/image"}
                style={{ height: "100px", width: "100px" }}
            />
            <h1>{nickname}</h1>
            <h2>{fullName}</h2>
            <h3>{role}</h3>
            {/*<DetailsBox data={data} />*/}
        </TextSummary>
    </Centered>
  );
}

function DetailsBox(props) {
  return (
    <Tabs>
      <TabList>
        <Tab>Info</Tab>
        <Tab>Quotes and Pictures</Tab>
        <Tab>Events</Tab>
        <Tab>Workteams</Tab>
      </TabList>

      <TabPanel>
        <div id={"info"}>
          <InfoList data={props.data} />
          <HistoryList histories={props.data.role_histories} />
        </div>
      </TabPanel>
      <TabPanel>"Det var bättre förr"</TabPanel>
      <TabPanel>All of them</TabPanel>
    </Tabs>
  );
}

const InfoList = memo(function InfoList(props) {
  var email;
  if (props.data.login_email != null)
    email = <li>Email: {props.data.login_email}</li>;
  var phone;
  if (props.data.phone != null)
    phone = <li>Phone number: {props.data.phone}</li>;

  //fest and stad may be null, so we handle that here. Removed if Email and Phone number is not present
  const fest = (
    <li>
      {(props.data.fest ? "Completed" : "Has not completed") +
        " FEST training."}
    </li>
  );
  const stad = (
    <li>
      {(props.data.stad ? "Completed" : "Has not completed") +
        " STAD training."}
    </li>
  );
  const liquor = (
    <li>
      {(props.data.liquor_permit ? "Is" : "Is not") +
        " on Kistan 2.0's liquor license."}
    </li>
  );

  return (
    <div>
      <h4>More Information</h4>
      <ul>
        {email}
        {phone}
        <li>Permits:</li>
        <ul>
          {fest}
          {stad}
          {liquor}
        </ul>
      </ul>
    </div>
  );
});

const HistoryList = memo(function HistoryList(props) {
  if (props.histories == null) return;
  return (
    <div>
      <h4>Titles</h4>
      [Properly loads your titles now]
      <ul>
        {props["histories"].map((element, i) => {
          return <li>{element}</li>;
        })}
      </ul>
    </div>
  );
});

export default Profile;
