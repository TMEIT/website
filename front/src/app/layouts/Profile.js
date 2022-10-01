import React, { Fragment, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import styles from "./profile.css";
import { useFetch } from "../FetchHooks.js";
import Loading from "../components/Loading";
import { currentRolesEN, capitalizeFirstLetter } from "../tmeitStringFn.js";
import { WorkteamItem } from "../components/Listables";
import GetMyInfo from "../components/GetMyInfo";

function Profile() {
  const myInfo = GetMyInfo();

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

  console.log(data);

  return (
    <>
      <img
        src={"https://thispersondoesnotexist.com/image"}
        style={{ height: "100px", width: "100px" }}
      />
      <h1>{nickname}</h1>
      <h2>{fullName}</h2>
      <h3>{role}</h3>
      <DetailsBox data={data} myInfo={myInfo} />
    </>
  );
}

function DetailsBox(props) {
  if (props.myInfo == "{}") return null;

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
      {/*
	  <TabPanel>
		{props.data.workteams.map((team) => (
		  <WorkteamItem key={team} team={team} />
		))}
	  </TabPanel>
		*/}
    </Tabs>
  );
}

const InfoList = React.memo(function InfoList(props) {
  const email = "Email: " + props.login_email; // Current API lacks email
  const phone = "Phone number: " + props.phone; // Current API lacks phone number

  //fest and stad may be null, so we handle that here
  const fest =
    props.fest == null ? null : (
      <li>
        {(props.fest ? "Completed" : "Has not completed") + " FEST training."}
      </li>
    );
  const stad =
    props.stad == null ? null : (
      <li>
        {(props.data.stad ? "Completed" : "Has not completed") +
          " STAD training."}
      </li>
    );
  const liquor = (
    <li>
      {(props.liquor_permit ? "Is" : "Is not") +
        " on Kistan 2.0's liquor license."}
    </li>
  );

  return (
    <div>
      <h4>More Information</h4>
      <ul>
        <li>{email}</li>
        <li>{phone}</li>
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

const HistoryList = React.memo(function HistoryList(props) {
  return (
    <div>
      <h4>Titles</h4>
      [PLACEHOLDER]
      <ul>
        <li>Became Prao on 2010-01-01.</li>
        <li>Became Marshal on 2012-01-01.</li>
        <li>Was WebbMarshal from 2013-01-01 to 2014-01-01.</li>
        <li>Given the METAL title on 2013-04-20. \m/</li>
        <li>Became Vraq on 2015-01-01.</li>
      </ul>
    </div>
  );
});

const MasterAccess = () => {
  return;
};

export default Profile;
