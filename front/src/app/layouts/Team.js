import React, {Fragment, useState} from "react";
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import Profile from "../components/Profile";
import Loading from "../components/Loading";
import {useFetch} from "../FetchHooks.js";

function Team() {

    const {loading, members} = useFetch("/api/members");
    const [memberPassing, setMemberPassing] = useState(null)

    return (
        <Router>
            <Switch>
                <Route exact path="/team/">
                    <Fragment>
                        <h1>Team</h1>
                        {loading? <Loading /> : 
                            (!loading && members.objects.map(member =>
                                <h2 key={member.email} >
                                    <Link to={"/team/" + member.email} onClick={setMemberPassing(member)} >
                                        {member.first_name + " " + member.last_name}
                                    </Link>
                                </h2>
                            ))
                        }
                    </Fragment>
                </Route>
                
                <Route path="/team/:id" render={ (props) => <Profile {...props} member={memberPassing}/>}  />
            </Switch>
        </Router>
    )
}

export default Team