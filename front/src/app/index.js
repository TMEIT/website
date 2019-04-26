import ReactDOM from "react-dom";
import React, {Fragment} from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import styles from "./index.css";

function App () {
    return (
        <Router>
            <Fragment>
                <header>
                    <nav>
                        <ul>
                            <li><Link to="/">TMEIT</Link></li>
                            <li><Link to="/events">Events</Link></li>
                            <li><Link to="/team">Team</Link></li>
                            <li><Link to="/join_tmeit">JOIN</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </ul>
                    </nav>
                    
                </header>

                <Route path="/" exact component={Home} />
                <Route path="/events" component={Events} />
                <Route path="/team" component={Team} />
                <Route path="/join_tmeit" component={Join} />
                <Route path="/login" component={Login} />


                <footer>
                    <nav>
                        <ul>
                            <li><a target="_blank" href="https://www.google.com/maps/place/Kistan+2.0/@59.4049488,17.948582,17z/data=!3m1!4b1!4m5!3m4!1s0x465f9fd2cab08029:0x1f774924439502cc!8m2!3d59.4049488!4d17.9507707">Kistagången 14, 164 40 Kista</a></li>
                            <li><a target="_blank" href="mailto:tm@tmeit.se">Email us</a></li>
                            <li><a target="_blank" href="https://www.insektionen.se">INsektionen</a></li>
                            <li><a target="_blank" href="https://www.qmisk.se">QMISK</a></li>
                        </ul>
                    </nav>
                </footer>
            </Fragment>
        </Router>
    )
}

function Home() {
    return <h1>TMEIT</h1>;
}
function Events() {
    return <h1>Events</h1>;
}
function Team() {
    return <h1>The Team</h1>;
}
function Join() {
    return <h1>Join TMEIT</h1>;
}
function Login() {
    return <h1>Login</h1>;
}


ReactDOM.render(<App />, document.getElementById('root'));