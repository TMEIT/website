import React, {Component, Fragment} from "react";
import styles from "./profile.css"
import roles from "./variables"

function Profile (props) {
    const member = props.route.member
    return (
       <Fragment>
            <h2>{member.first_name + " " + member.last_name}</h2>
            <h2>{member.nickname}</h2>
       </Fragment>
    )
}

export default Profile

