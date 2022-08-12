import React, { useState } from "react";

function JoinForm() {
  const [firstName, setFirstName] = useState(undefined);
  const [lastName, setLastName] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  const [confirmPassword, setConfirmPassword] = useState(undefined);

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
    if (id === "password") {
      setPassword(value);
    }
    if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const submit = () => {
    console.log(password, confirmPassword);
    if (password === confirmPassword) {
      console.log("confirmed");
    }
  };

  return (
    <div className="form">
      <div className="firstname">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          placeholder="First Name"
          onChange={(e) => handleInputChange(e)}
        ></input>
      </div>
      <div className="lastname">
        <label htmlFor="lastName">Last name</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          placeholder="Last Name"
          onChange={(e) => handleInputChange(e)}
        ></input>
      </div>
      <div className="email">
        <label htmlFor="email">Email adress</label>
        <input
          type="email"
          id="email"
          value={email}
          placeholder="prao@prao.prao"
          onChange={(e) => handleInputChange(e)}
        ></input>
      </div>
      <div className="password">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => handleInputChange(e)}
        ></input>
      </div>
      <div className="password">
        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => handleInputChange(e)}
        ></input>
      </div>
      <div className="submit">
        <button type="submit" onClick={() => submit()}>
          Register
        </button>
      </div>
    </div>
  );
}

export default JoinForm;
