import React from "react";

function Home() {
    return (
        <>
            <h1>TMEIT</h1>
            <h2>Welcome to the next version of tmeit.se!</h2>
            <p>This is a project to rewrite tmeit.se completely from scratch with ReactJS
                and a simple Python backend.
                The project is still very much in its early stages, but you can follow the development on
                <a href={"https://github.com/TMEIT/website"}> TMEIT's Github page</a>.
            </p>
            <p>
                We are currently working on enabling KTH single sign-on and displaying all profiles.
                Styling for the website is planned to be added more in the later releases this Summer.
                We hope to have all everyday features added, as well as styling, in time for Mottagning 2019!
            </p>
            <p>We greatly appreciate new ideas or contributions!</p>
        </>
    );
}

export default Home