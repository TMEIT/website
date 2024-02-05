import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import {getApiFetcher} from "../api";
import useIsScreenWide from "../useIsScreenWide";
import {Link} from "react-router-dom";

const StyledLoginModal = styled(LoginModal)({

    //overlay
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, .7)",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 10,

    //Desktop/widescreen-headers 
    dialog: {
        position: "relative",
        zIndex: 20,
        background: "#fff",
        width: "500px",
        marginTop: "10%",

        /* Center the modal */
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
    },

    ".modalHeader": {
        background:" #44687d",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
    },

    ".modalMain": {
        padding: "20px",
    },

    ".closeButton": {
        border: "none",
        background: "transparent",
        padding: "10px",
        cursor: "pointer",
        color: "#fff",
        fontSize: "36px",
    },

    ".closeButton:hover": {
        color: "yellow",
    },

    //Mobile/thinscreen-headers
    "@media (max-width: 949px)" : {
        dialog: {
            width: "250px",
            marginTop: "10%",
            marginLeft: "auto",
            marginRight: "auto",
        }
    }, 

    ".modalHeaderMobile": {
        background:" #44687d",
        padding: "5px 10px",
        display: "flex",
        justifyContent: "space-between",
    },

    ".modalMainMobile": {
        padding: "10px",
    },

    ".closeButtonMobile": {
        border: "none",
        background: "transparent",
        padding: "5px",
        color: "#fff",
        fontsize: "18px",
    },

    //header used on both desktop and mobil
    form: {
        display: "flex",
        flexDirection: "column",
    },
});

function LoginModal({className, loggedIn, setLoggedIn, setLoginModalOpen}) {
    let navigate = useNavigate();

    useEffect(() => {
        async function check_if_logged_in() {
            if(loggedIn) {
                if(await getApiFetcher().get("/me").json()) {
                    console.log("Wtf, login modal is open and we're logged in, restarting the app");
                    navigate(0);
                } else {
                    console.log("We opened the login modal, but we thought we were logged in, but we weren't logged in, wtf?");
                    setLoggedIn(false);
                }
            }
        }
        check_if_logged_in()
    }, []);

    // login credentials
    const [email, setEmail] = useState("");
    const [pswrd, setPswrd] = useState("");

    // Error message for logins
    const [errorMessage, setError] = useState(0);

    const [forgot, setForgot] = useState(false);

    const ScreenIsWide = useIsScreenWide(950);

    const Forgot = () => {setForgot(true);}

    function handleLogin(e) {
        e.preventDefault();

        const token = new XMLHttpRequest();
        token.open("POST", "/api/v1/token");
        token.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        token.responseType = "json";
        const data =
        "username=" + e.target["0"].value + "&password=" + e.target["1"].value;
        token.send(data);

        token.onload = function () {
            if (token.status === 401) {
                setError(1);
            } else if (token.status === 422) {
                setError(2);
            } else if (token.status === 200) {
                // handling of JWT
                const access_token = token.response.access_token;
                document.cookie = "access_token=" + access_token + ";SameSite=Strict;";
                setLoginModalOpen(false);
                setLoggedIn(true);
                setError(0);
                navigate(0);
            } else {
                alert(`Error ${token.status}: ${token.statusText}`);
            }
        };
    }

    function handleForgot(e) {
        e.preventDefault();

        const data = {
            email : email
        };

        const xhr = new XMLHttpRequest();
        xhr.open("PUT", "/api/v1/reset");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.responseType = "json";
        xhr.send(JSON.stringify(data));

        xhr.onload = function () {
            if (xhr.status == 200)
            {
                setError(1);
                setLoginModalOpen(false);
            }
            else if (xhr.status == 500)
                setError(2);
            else {
                alert(`Error ${xhr.status}: ${xhr.statusText}`);
            }
        }
    }

    console.log(forgot);

    if(ScreenIsWide)  //Make a big LoginModal for desktops/wider screens
    {   return (
            <div className={className}>
                {forgot?
                <dialog open>
                    <header className="modalHeader">
                        <h2>Forgot your password?</h2>
                        <button
                            onClick={() => setLoginModalOpen(false)}
                            className="closeButton"
                            >
                            &times;
                        </button>
                    </header>
                    <div className="modalMain">
                        <form onSubmit={handleForgot}>
                            <label htmlFor="email">Please input the mail-address of your account, a password reset-link will be sent to it</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    ></input>
                                <input type="submit" value="send"></input>
                        </form>
                        <div className="errorMessage">
                            {(() => {
                                switch (errorMessage) {
                                    case 0:
                                        return <></>;
                                    case 1:
                                        return <>Password reset-link has been sent! You may now close this pop-up</>;
                                    case 2:
                                        return <>Could not find email</>;
                                }
                            })()}
                        </div>
                    </div>
                </dialog>
                :
                <dialog open>
                    <header className="modalHeader">
                        <h2>Login</h2>
                        <button
                            onClick={() => setLoginModalOpen(false)}
                            className="closeButton"
                            >
                            &times;
                        </button>
                    </header>
                    <div className="modalMain">
                        <form onSubmit={handleLogin}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                ></input>
                            <label htmlFor="pswrd">Password</label>
                            <input
                                type="password"
                                id="pswrd"
                                name="password"
                                value={pswrd}
                                onChange={(e) => setPswrd(e.target.value)}
                                ></input>
                            <input type="submit" value="login"></input>
                        </form> 
                        <Link onClick={Forgot}>forgot your password?</Link>
                        <div className="errorMessage">
                            {(() => {
                                switch (errorMessage) {
                                    case 0:
                                        return <></>;
                                    case 1:
                                        return <>Incorrect email or password</>;
                                    case 2:
                                        return <>Validation error</>;
                                }
                            })()}
                        </div>
                    </div>
                </dialog>
                }
            </div>      
        )}
    else            //Make a small LoginModal for mobiles/thinner screens
    {return (
        <div className={className}>
            {forgot?
            <dialog open>
                <header className="modalHeaderMobile">
                    <h2>Forgot your password?</h2>
                    <button
                        onClick={() => setLoginModalOpen(false)}
                        className="closeButtonMobile"
                        >
                        &times;
                    </button>
                </header>
                <div className="modalMainMobile">
                    <form onSubmit={handleForgot}>
                        <label htmlFor="email">Please input the mail-address of your account, a password reset-link will be sent to it</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                ></input>
                            <input type="submit" value="send"></input>
                    </form>
                    <div className="errorMessage">
                        {(() => {
                            switch (errorMessage) {
                                case 0:
                                    return <></>;
                                case 1:
                                    return <>Password reset-link has been sent! You may now close this pop-up</>;
                                case 2:
                                    return <>Could not find email</>;
                                }
                        })()}
                    </div>
                </div>
            </dialog>
            :
            <dialog open>
                <header className="modalHeaderMobile">
                    <h2>Login</h2>
                    <button
                        onClick={() => setLoginModalOpen(false)}
                        className="closeButtonMobile"
                        >
                        &times;
                    </button>
                </header>
                <div className="modalMainMobile">
                    <form onSubmit={handleLogin}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            ></input>
                        <label htmlFor="pswrd">Password</label>
                        <input
                            type="password"
                            id="pswrd"
                            name="password"
                            value={pswrd}
                            onChange={(e) => setPswrd(e.target.value)}
                            ></input>
                        <input type="submit" value="login"></input>
                    </form>
                    <Link onClick={Forgot}>forgot your password?</Link>
                    <div className="errorMessage">
                        {(() => {
                            switch (errorMessage) {
                                case 0:
                                    return <></>;
                                case 1:
                                    return <>Incorrect email or password</>;
                                case 2:
                                    return <>Validation error</>;
                            }
                        })()}
                    </div>
                </div>
            </dialog>
            }
        </div>
    )}
}

export default StyledLoginModal;
