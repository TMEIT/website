import React, {Component, Fragment} from "react";
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import Profile from "../components/Profile";

const members = {
    "num_results": 1,
    "objects": [
        {
            "current_role": 1,
            "drivers_license": true,
            "email": "testtmeit@gmail.com",
            "fest": null,
            "first_name": "Test",
            "last_name": "TMEIT",
            "liquor_permit": false,
            "nickname": "TT",
            "phone": "(555) 555-5555",
            "role_histories": [],
            "stad": null,
            "workteams": [
                {
                    "active": true,
                    "active_period": 0,
                    "active_year": 2019,
                    "id": 1,
                    "name": "Web Crew",
                    "symbol": "W"
                }
            ],
            "workteams_leading": [
                {
                    "active": true,
                    "active_period": 0,
                    "active_year": 2019,
                    "id": 1,
                    "name": "Web Crew",
                    "symbol": "W"
                }
            ]
        }
    ],
    "page": 1,
    "total_pages": 1
}

const memberToBePassed = {
    "current_role": 1,
    "drivers_license": true,
    "email": "testtmeit@gmail.com",
    "fest": null,
    "first_name": "Test",
    "last_name": "TMEIT",
    "liquor_permit": false,
    "nickname": "TT",
    "phone": "(555) 555-5555",
    "role_histories": [],
    "stad": null,
    "workteams": [
        {
            "active": true,
            "active_period": 0,
            "active_year": 2019,
            "id": 1,
            "name": "Web Crew",
            "symbol": "W"
        }
    ],
    "workteams_leading": [
        {
            "active": true,
            "active_period": 0,
            "active_year": 2019,
            "id": 1,
            "name": "Web Crew",
            "symbol": "W"
        }
    ]
}

function getMemberToBePassed(email, members) {
    return 
}

function Team() {return (
    <Router>
        <Fragment>
            <Switch>
                <Route exact path="/team/">
                    <Fragment>
                        <h1>Team</h1>
                        {members.objects.map(member => 
                            <h2 key={member.email} >
                                <Link to={"/team/" + member.email} >
                                    {member.first_name + " " + member.last_name}
                                </Link>
                            </h2>
                        )}

                    </Fragment>
                </Route>
                <Route path="/team/:id" render={(props) => <Profile {...props} member={memberToBePassed}/>}  />
            </Switch>
        </Fragment>
    </Router>
)}

export default Team