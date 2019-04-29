import React, {Component, Fragment} from "react";
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import Profile from "../components/Profile";

function Team() {return (
    <Router>
        <Fragment>
            <Switch>
                <Route exact path="/team/">
                    <Fragment>
                        <h1>Team</h1>
                        <h2><Link to="/team/5">User</Link></h2>
                        <h2><Link to="/team/6">User</Link></h2>
                        <h2><Link to="/team/8">User</Link></h2>
                    </Fragment>
                </Route>
                <Route path="/team/:id" component={Profile}/>
            </Switch>
        </Fragment>
    </Router>
)}

export default Team