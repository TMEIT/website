import styled from "styled-components";

import Header from "../components/Header";
import React from "react";
import Footer from "../components/Footer";
import {Route, Switch} from "react-router-dom";
import Home from "./Home";
import Events from "./Events";
import Team from "./Team";
import Join from "./Join";
import Profile from "./Profile";


const AppLayout = styled.div`
    display: grid;
    grid-template: 3rem minmax(10rem, 1fr) 3rem / auto ;
`;

const App = (props) => (
    <AppLayout>
        <Header/>
        <div>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/events" component={Events} />
                <Route exact path="/team" component={Team} />
                <Route exact path="/join_tmeit" component={Join} />
                <Route exact path="/profile/:id" component={Profile} />
            </Switch>
        </div>
        <div><Footer/></div>
    </AppLayout>
);

export default App