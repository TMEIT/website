import React from "react";
import ReactDOM from "react-dom";
import {LoginButtons} from "./components/LoginButtons.jsx";

class App extends React.Component {
    render() {
        return(
            <div>
                <h1>Hello Frontend!</h1>
                <LoginButtons />
            </div>
        )
    }
}

ReactDOM.render(<App/>, window.document.getElementById("app"));