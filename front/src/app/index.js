import ReactDOM from "react-dom";
import React, {Fragment} from "react";
import {BrowserRouter as Router, Route, Link, NavLink, Switch} from "react-router-dom"
import styles from "./index.css";

import Home from "./layouts/Home";
import Events from "./layouts/Events";
import Join from "./layouts/Join";
import Team from "./layouts/Team";
import Footer from "./components/Footer";



function App () {
    return (
        <Router>
            <Fragment>
                <header>
                    <nav>
                        <ul>
                            <li><NavLink to="/">TMEIT</NavLink></li>
                            <li><NavLink to="/events">Events</NavLink></li>
                            <li><NavLink to="/team">Team</NavLink></li>
                            <li><NavLink to="/join_tmeit">JOIN</NavLink></li>
                            <li><NavLink to="/login">Login</NavLink></li>
                        </ul>
                    </nav>
                    
                </header>

                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/events" component={Events} />
                    <Route path="/team" component={Team} />
                    <Route path="/join_tmeit" component={Join} />
                    <Route path="/login" component={Login} />
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