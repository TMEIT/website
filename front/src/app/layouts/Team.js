import React, {Fragment, useState} from "react";
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import Profile from "../components/Profile";
import {useFetch} from "../FetchHooks.js";

function findMemberByEmail(members, email) {
    if(members == null) return null;

    for ( const member of members) {
        if(member.email === email) {
            return member;
        }
    }

    return null;
}

function Team() {

    const {loading, data} = useFetch("/api/members");

    const members = loading ? null : data.objects;

    return (
        <Router>
            <Switch>
                <Route exact path="/team/">
                    <Fragment>
                        <h1>Team</h1>
                        {loading && "Loading..."}

                        {
                            !loading && members.map(member =>
                                <h2 key={member.email} >
                                    <Link to={"/team/" + member.email} >
                                        {member.first_name + " " + member.last_name}
                                    </Link>
                                </h2>
                            )
                        }

                    </Fragment>
                </Route>
                {/*Loading a profiles doesnt work, as we dont have data when the route loads,
                and state updates wont rerender it...*/}
                <Route path="/team/:id" render={ (props) => <Profile {...props} member={findMemberByEmail(members, props.match.path.id)}/>}  />
            </Switch>
        </Router>
    )
}

export default Team