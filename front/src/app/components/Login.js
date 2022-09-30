import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import CheckLogin from "./CheckLogin";
import GetMyInfo from "./GetMyInfo";

function Login() {
  const [open, setOpen] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const [email, setEmail] = useState("");
  const [pswrd, setPswrd] = useState("");

  // Error message for logins
  const [errorMessage, setError] = useState(0);

  // Set status of logged in or not
  const [logged, setLogged] = useState(CheckLogin());

  let navigate = useNavigate();

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
        document.cookie =
          "access_token=" + access_token + ";SameSite=strict;Secure;";
        setOpen(false);
        setLogged(true);
        setError(0);
      } else {
        alert(`Error ${token.status}: ${token.statusText}`);
      }
    };
  }

  function handleLogout() {
    document.cookie = "access_token = ;";
    setLogged(false);
    setOpenLogout(false);
    navigate(0);
  }

  async function gotoProfile() {
    let result = await GetMyInfo();
    console.log(result);
    try {
      let link = result.short_uuid;
      console.log(link);
      navigate("/profile/" + link);
    } catch (error) {
      console.log(error);
      alert("Error, somehow you got no data LMAO");
    }
  }

  return (
    <div>
      <li>
        {logged ? (
          <div>
            <a href={"#"} onClick={() => gotoProfile()}>
              Profile{" "}
            </a>
            <a href={"#"} onClick={() => setOpenLogout(true)}>
              Logout
            </a>
          </div>
        ) : (
          <a href={"#"} onClick={() => setOpen(true)}>
            Login
          </a>
        )}
      </li>
      <div id="loginModal">
        {open && (
          <>
            <div className="overlay">
              <div className="modal">
                <header className="modalHeader">
                  <h2>Login</h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="closeButton"
                  >
                    &times;
                  </button>
                </header>
                <main className="modalMain">
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
                </main>
              </div>
            </div>
          </>
        )}
      </div>
      <div id="logoutModal">
        {openLogout && (
          <>
            <div className="overlay">
              <div className="modal">
                <header className="modalHeader">
                  <h2>Logout</h2>
                  <button
                    onClick={() => setOpenLogout(false)}
                    className="closeButton"
                  >
                    &times;
                  </button>
                </header>
                <main className="modalMain">
                  <h4>Are you sure you want to log out?</h4>
                  <button onClick={() => handleLogout()}>Yes, I am</button>
                </main>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
