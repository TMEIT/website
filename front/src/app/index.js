import ReactDOM from "react-dom";
import {createRoot} from 'react-dom/client';
import React, {Fragment} from "react";
import {BrowserRouter as Router, Route, Link, NavLink, Routes} from "react-router-dom"
import styles from "./index.css";
import css_reset from "../reboot.css";

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
            <>

                <Header />

                <main>
                    <Routes>
                        <Route path="/" exact element={<Home />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/join_tmeit" element={<Join />} />
                        <Route path="/profile/:shortGuid/:name" element={<Profile />} />
                    </Routes>
                </main>

                <Footer />

            </>
        </Router>
    )
}

function Login() {
    return <h1>Login</h1>;
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
