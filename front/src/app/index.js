import ReactDOM from "react-dom";
import React, {Fragment} from "react";
import {BrowserRouter as Router, Route, Link, NavLink, Switch} from "react-router-dom"
import styles from "./index.css";

import Home from "./layouts/Home";
import Events from "./layouts/Events";
import Join from "./layouts/Join";
import Team from "./layouts/Team";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Profile from "./layouts/Profile";

function App () {
    return (
        <Router>
            <Fragment>
                <Header />

                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/events" component={Events} />
                    <Route path="/team" component={Team} />
                    <Route path="/join_tmeit" component={Join} />
                    <Route path="/login" component={Login} />
                    <Route path="/profile/:id" component={Profile} />
                </Switch>

                <Footer />

            </Fragment>
        </Router>
    )
}

function Login() {
    return <h1>Login</h1>;
}


ReactDOM.render(<App />, document.getElementById('root'));