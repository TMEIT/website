import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./joinForm.css";

function JoinForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [GDPR, setGDPR] = useState(false);

  const [errorMessage, setErrorMessage] = useState(0);
  const [errorSpec, setErrorSpec] = useState("");
  let navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "firstName") {
      setFirstName(value);
    }
    if (id === "lastName") {
      setLastName(value);
    }
    if (id === "email") {
      setEmail(value);
    }
    if (id === "phone") {
      setPhone(value);
    }
    if (id === "password") {
      setPassword(value);
    }
    if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
    if (id === "GDPR") {
      setGDPR(value);
    }
  };

  const submit = () => {
    if (password != confirmPassword || password == "") {
      setErrorMessage(2);
    } else if (!GDPR) {
      setErrorMessage(1);
    } else {
      const data = {
        login_email: email,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        password: password,
      };

      const signUp = new XMLHttpRequest();
      signUp.open("POST", "/api/v1/sign_up/sign_up");
      signUp.setRequestHeader("Content-Type", "application/json");
      signUp.responseType = "json";
      signUp.send(JSON.stringify(data));

      signUp.onload = function () {
        if (signUp.status === 422) {
          let responseObj = "";
          signUp.response["detail"].forEach((e) => {
            responseObj += e.msg + "\n";
          });

          setErrorSpec(responseObj);
          setErrorMessage(4);
        } else if (signUp.status === 200) {
          setErrorMessage(3);
          navigate("/join_completed");
        } else {
          alert(`Error ${signUp.status}: ${signUp.statusText}`);
        }
      };
      signUp.onerror = function () {
        alert("Request has failed, try again or contact web masters");
      };
    }
  };

  return (
    <div>
      <div className="form">
        <div className="firstname">
          <label htmlFor="firstName">First Name </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            placeholder="First Name"
            onChange={(e) => handleInputChange(e)}
          ></input>
        </div>
        <div className="lastname">
          <label htmlFor="lastName">Last name </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            placeholder="Last Name"
            onChange={(e) => handleInputChange(e)}
          ></input>
        </div>
        <div className="email">
          <label htmlFor="email">Email adress </label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="prao@prao.prao"
            onChange={(e) => handleInputChange(e)}
          ></input>
        </div>
        <div className="phone">
          <label htmlFor="phone">phone number </label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => handleInputChange(e)}
          ></input>
        </div>
        <div className="password">
          <label htmlFor="password">Password </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => handleInputChange(e)}
          ></input>
        </div>
        <div className="password">
          <label htmlFor="confirmPassword">Confirm password </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => handleInputChange(e)}
          ></input>
        </div>
        <div className="GDPRtext">
          <label htmlFor="GDPR">
            We store your name, email address, and any information you or other
            members of TMEIT enter about you. All data is stored securely within
            the EU. Contact a master for questions or issues regarding your
            personal data. By checking this box you acknowledge this in
            conpliance with GDPR.
          </label>
          <input
            className="GDPRcheckbox"
            type="checkbox"
            id="GDPR"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div className="submit">
          <button type="submit" onClick={() => submit()}>
            Register
          </button>
        </div>
      </div>
      <div className="errorMessage">
        {(() => {
          switch (errorMessage) {
            case 0:
              return <></>;
            case 1:
              return (
                <>You must check the box to consent and register to TMEIT</>
              );

            case 2:
              return <>Password does not match or is empty</>;

            case 3:
              return <>Message has been sent and received</>;

            case 4:
              return <p>{errorSpec}</p>;
          }
        })()}
      </div>
    </div>
  );
}

export default JoinForm;
