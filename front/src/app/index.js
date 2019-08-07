import ReactDOM from "react-dom";
import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom"

import App from "./layouts/App";


ReactDOM.render((
    <Router>
        <Route path="/" component={App}/>
    </Router>
), document.getElementById('root'));