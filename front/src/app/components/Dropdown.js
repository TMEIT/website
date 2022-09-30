import "./dropdown.css"
import "./login.css"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GetMyInfo from "./GetMyInfo";


function Dropdown(){

    const [profile, setProfile] = useState(false);
    const [openLogout, setOpenLogout] = useState(false);

    let navigate = useNavigate();

    async function goToProfile() {
      let result = await GetMyInfo();
      try {
        let link = result.short_uuid;
        console.log(link);
        navigate("/profile/" + link);
      } catch (error) {
        console.log(error);
        alert("Error, somehow you got no data LMAO");
      }
    }

    function handleLogout() {
      document.cookie = "access_token=; expires = Thu, 01 Jan 1970 00:00:00 UTC;";
      setOpenLogout(false);
      navigate(0);
    }

    return(
      <>
          <div className="link">
            <a href={"#"} onClick={() => setProfile(!profile)}>
              Settings{" "}
            </a>
          <div className={`menu ${profile ? 'open' : ''}`}>
            <ul>
              <a href={"#"} onClick={() => goToProfile()}>
                My profile
              </a>
              <a href={"#"} onClick={() => setOpenLogout(true)}>
                Log out
              </a>
            </ul>
            </div>
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
        </>
    )
}

export default Dropdown;