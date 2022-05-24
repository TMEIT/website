import React from "react";

function Home() {
    return (
        <>
            <h1>TMEIT</h1>
            <h2>Welcome to the next version of tmeit.se!</h2>
            <p>This is a project to rewrite tmeit.se completely from scratch with ReactJS
                and a simple Python backend.
                The project was stalled for a while during 2019-2021,
                but development has started again and all the existing code has been updated to the latest 2022 standards.
                You can follow the development on
                <a href={"https://github.com/TMEIT/website"}> TMEIT's Github page</a>.
            </p>
            <p>
                We are currently working adding new features to the backend to build a social media site on-par with the
                old TMEIT website.
                Real users, a login page, and a sign-up page will be added shortly.
                Support for pictures of TMEIT members, as well as sleek styling will be added before the 1.0 release.
                Right now the website is running on Lex's home server to demo the pre-release of the website,
                but the website will be moved to Linode or Google Cloud for the 1.0 release.
            </p>
            <p><strong>
                If you're interested in web development and want to learn more about how this website works,
                feel free to reach out to Justin Lex-Hammarskjöld (aka "Lex")
                and join the discussion with the TMEIT webbmarskalkar.
            </strong></p>
            <p>
                This website uses a wide variety of technologies,
                so there's probably some systems that you will find interesting.
            </p>
            <p>
                Some facts about the technology stack:
            </p>
            <ul>
                <li>The website runs on Kubernetes with technologies like "Docker" containers and a reverse proxy.</li>
                <li>The frontend is written in Javascript and CSS using Webpack and the React web framework.</li>
                <li>The backend providing the json API and the SQL database is written in Python using the FastAPI framework and the SQLalchemy database library.</li>
                <li>The website is optimized for speed, with the website downloading in less than 100kb, and a high-speed backend capable of handling thousands of requests per second on a single core.</li>
                <li>The website testing and deployment is fully automated, and if the website stops responding, Kubernetes will automatically restart it.</li>
            </ul>
            <p>
                Feel free to send us suggestions about the future of tmeit.se!
                Let us know if you're interesting in trying out some web/api development,
                and we can help you set up a developer copy of the site on your computer for testing.
            </p>
        </>
    );
}

export default Home