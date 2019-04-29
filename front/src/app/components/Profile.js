import React from "react";
import styles from "./profile.css"

const user = {
    id: "",
    email: "",
    profilePic: "",
    name: "",
    nickname: "",
    gallery: "",
    title: "",
    team: "",
    points: "",
    eventsWorked: "",
    eventsAttended: "",
    permits: "",
}

function Profile ({match}) {
    return (
        <h2>Profile {match.params.id} </h2>
    )
}

export default Profile

